---
title: Docker 项目部署基础流程
description: 记录使用 Docker 部署项目时，从构建镜像到启动容器的基础操作流程。
date: 2026-09-08
category: 技术笔记
tags:
  - Docker
  - 部署
  - Dockerfile
  - Docker Compose
---

# Docker 项目部署基础流程

Docker 是实际项目部署中常见的方式。它将应用程序及运行环境一起封装到镜像中，减少 Java、Python、Node.js 等运行环境在不同服务器上的差异。

本文以一个已经构建完成的 Java JAR 应用为例，记录从镜像构建、容器启动到后续更新的基础流程。这套思路同样适用于其他语言的服务，只需要替换构建产物和启动命令。

> `EXPOSE` 只用于声明容器预期使用的端口；真正让宿主机能够访问服务，需要在 `docker run` 或 Compose 中配置端口映射。

## 一、部署流程概览

一个项目使用 Docker 部署时，通常会经过下面的流程：

```text
项目源码 → 构建应用 → 生成运行产物 → 构建镜像 → 启动容器 → 验证服务
```

对于 Java 应用，运行产物通常是 JAR 文件：

```text
Java 源码 → Gradle / Maven → app.jar → Docker Image → Docker Container
```

## 二、部署前准备

### 确认 Docker 环境

先确认服务器已经安装 Docker，并且 Docker 服务能够正常工作：

```bash
docker --version
docker info
```

`docker --version` 用于确认客户端版本；`docker info` 能正常返回 Docker Server 信息，才说明守护进程可用。

### 准备项目目录

假设服务器上的项目目录为 `/opt/my-app`，目录中已经包含构建好的 JAR 文件和 Dockerfile：

```text
/opt/my-app
├── app.jar
└── Dockerfile
```

其中 `app.jar` 是 Maven 或 Gradle 构建得到的 Java 应用。生产环境中应避免把源码、日志、密钥或不需要的构建文件放入镜像构建上下文。

## 三、编写 Dockerfile

在项目目录创建名为 `Dockerfile` 的文件：

```dockerfile
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

各指令的含义如下：

- `FROM eclipse-temurin:21-jre`：使用 Java 21 JRE 作为运行环境；运行 JAR 不需要完整 JDK。
- `WORKDIR /app`：将容器内工作目录设为 `/app`。
- `COPY app.jar app.jar`：把构建产物复制到 `/app/app.jar`。
- `EXPOSE 8080`：声明应用通常监听 8080 端口。
- `ENTRYPOINT [...]`：容器启动时执行 `java -jar app.jar`。

## 四、构建并启动容器

进入项目目录后构建镜像：

```bash
cd /opt/my-app
docker build -t my-app:1.0 .
```

其中 `my-app` 是镜像名，`1.0` 是版本标签；最后的 `.` 表示将当前目录作为构建上下文。构建完成后可以确认镜像是否存在：

```bash
docker images my-app
```

然后启动容器：

```bash
docker run -d \
  --name my-app \
  -p 8080:8080 \
  my-app:1.0
```

- `-d`：让容器在后台运行。
- `--name my-app`：为容器指定稳定名称，后续查看日志和管理容器更方便。
- `-p 8080:8080`：把宿主机 8080 端口映射到容器 8080 端口，格式为 `宿主机端口:容器端口`。

## 五、验证与日常运维

启动后先确认容器状态和应用日志：

```bash
docker ps
docker logs my-app
```

如果应用提供 HTTP 接口，还应从服务器或可访问该服务的机器执行一次实际请求，例如：

```bash
curl http://127.0.0.1:8080/actuator/health
```

请将 `/actuator/health` 替换为项目真实的健康检查或业务接口。容器显示为 `Up` 只代表进程仍在运行，不代表服务一定可用。

常用运维命令可以集中记忆：

```bash
# 持续查看日志；Ctrl + C 只退出日志跟随，不会停止容器
docker logs -f my-app

# 查看全部容器，包括已退出的容器
docker ps -a

# 停止、启动和重启
docker stop my-app
docker start my-app
docker restart my-app

# 进入容器；精简镜像通常只有 sh，没有 bash
docker exec -it my-app sh
```

## 六、更新应用并重新部署

代码更新并重新生成 `app.jar` 后，不要覆盖仍在运行的旧容器。更清晰的做法是构建新标签的镜像，再替换旧容器：

```bash
# 停止并删除旧容器；不会删除旧镜像
docker stop my-app
docker rm my-app

# 构建新版本并启动
docker build -t my-app:1.1 .
docker run -d \
  --name my-app \
  -p 8080:8080 \
  my-app:1.1
```

确认新版本工作正常后，如需释放空间，再删除不再使用的旧镜像：

```bash
docker rmi my-app:1.0
```

如果镜像仍被其他容器引用，Docker 会拒绝删除；先通过 `docker ps -a` 确认引用关系，不要直接批量清理。

## 七、使用 Docker Compose 管理多服务

如果一个项目除应用外还依赖 PostgreSQL、Redis、MinIO 等服务，逐个执行 `docker run` 会难以维护。此时可以使用 Docker Compose 将服务、端口和依赖关系放在同一个 `compose.yaml` 中：

```yaml
services:
  app:
    image: my-app:1.0
    ports:
      - "8080:8080"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
```

常用操作如下：

```bash
# 后台创建并启动所有服务
docker compose up -d

# 查看 Compose 管理的服务状态
docker compose ps

# 停止并移除服务容器和默认网络
docker compose down
```

数据库密码、访问令牌等敏感配置不应直接写入文章示例或提交到仓库。实际项目可通过环境变量、`.env` 文件的安全管理方式或部署平台的密钥机制注入。

## 八、总结

最基础的 Docker 部署流程是：

```text
准备应用产物 → 编写 Dockerfile → docker build → docker run → docker ps / docker logs → 实际请求验证
```

Docker 的价值在于将应用和运行环境一起封装，使部署环境更一致。单服务可以从 `docker build` 和 `docker run` 开始；当服务逐渐增多时，再使用 Docker Compose 统一管理。
