# Git Pull 出现 divergent branches 的原因与解决方法

在使用 Git 拉取远程代码时，有时执行 `git pull` 会出现 `divergent branches` 相关提示，并最终提示：

```text
fatal: Need to specify how to reconcile divergent branches.
```

这通常意味着：**本地分支和远程分支都产生了新的提交，Git 无法自动判断应该采用 Merge 还是 Rebase 来整合两边的提交。**

本文记录该问题的原因、解决方法以及实际开发中应该如何选择。

---

## 一、问题现象

执行：

```bash
git pull
```

可能出现类似提示：

```text
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:

hint:   git config pull.rebase false
hint:   git config pull.rebase true
hint:   git config pull.ff only

fatal: Need to specify how to reconcile divergent branches.
```

其中最关键的一句是：

```text
You have divergent branches
```

意思是：

> 当前本地分支与远程分支已经产生了分叉。

---

## 二、为什么会出现这个问题

假设最开始本地和远程的提交历史完全一致：

```text
A --- B
      ↑
   local
   remote
```

之后，远程仓库有人提交了代码：

```text
A --- B --- C
            ↑
          remote
```

与此同时，本地也产生了一个新的提交：

```text
A --- B --- D
            ↑
          local
```

此时完整的提交历史就变成：

```text
          C  ← remote
         /
A --- B
         \
          D  ← local
```

也就是说：

- 远程有本地没有的提交 `C`
- 本地有远程没有的提交 `D`

两个分支都向前发展了。

这就是：

```text
divergent branches
```

也就是**分支发生分叉**。

此时执行：

```bash
git pull
```

Git 需要知道：

> 应该使用 Merge 还是 Rebase 来整合这两条提交历史？

如果没有配置默认策略，Git 就可能要求你明确指定。

---

## 三、解决方法

主要有三种策略：

1. Merge
2. Rebase
3. Fast-forward only

其中日常开发最常见的是前两种。

---

## 四、方案一：使用 Merge

执行：

```bash
git pull --no-rebase
```

Git 会把远程分支和本地分支进行合并。

例如原来的提交：

```text
          C
         /
A --- B
         \
          D
```

Merge 后可能变成：

```text
          C -----
         /       \
A --- B           M
         \       /
          D -----
```

其中 `M` 是 Git 自动产生的 **Merge Commit**。

### 优点

- 不会修改已有提交历史
- 相对安全
- 能够完整保留分支合并过程
- 比较适合多人协作的公共分支

### 缺点

提交历史可能出现较多 Merge Commit，看起来不够简洁。

---

## 五、方案二：使用 Rebase

执行：

```bash
git pull --rebase
```

Git 会先取得远程提交，然后把自己的本地提交重新放到远程提交后面。

原本：

```text
          C
         /
A --- B
         \
          D
```

Rebase 后：

```text
A --- B --- C --- D'
```

这里的 `D'` 可以理解为：

> Git 根据原来的 `D` 重新生成了一个新的提交。

最终提交历史会变成一条直线。

### 优点

提交历史更加整洁：

```text
A --- B --- C --- D
```

不会产生额外的 Merge Commit。

### 缺点

Rebase 会改写提交历史。

因此，对于已经推送到远程、并且多人共同使用的提交，需要谨慎执行 Rebase。

---

## 六、方案三：只允许 Fast-forward

还可以执行：

```bash
git pull --ff-only
```

它的意思是：

> 只有能够直接快进时才允许 pull。

例如：

```text
本地：

A --- B

远程：

A --- B --- C
```

此时本地可以直接移动到 `C`：

```text
A --- B --- C
```

这种情况不存在分叉，因此可以正常执行。

但是如果已经出现：

```text
          C
         /
A --- B
         \
          D
```

`--ff-only` 会直接拒绝合并。

因此它更像是一种**防止 Git 自动产生复杂合并历史的保护策略**。

---

## 七、设置默认 Pull 策略

如果不想每次都写：

```bash
git pull --rebase
```

可以设置默认行为。

### 默认使用 Merge

```bash
git config --global pull.rebase false
```

以后：

```bash
git pull
```

默认使用 Merge。

---

### 默认使用 Rebase

```bash
git config --global pull.rebase true
```

以后：

```bash
git pull
```

默认使用 Rebase。

---

### 默认只允许 Fast-forward

```bash
git config --global pull.ff only
```

以后只有可以 Fast-forward 时，`git pull` 才会成功。

---

## 八、只给当前项目设置

如果不希望影响电脑上的其他 Git 项目，可以去掉 `--global`。

例如：

```bash
git config pull.rebase true
```

这个配置只对**当前 Git 仓库**生效。

而：

```bash
git config --global pull.rebase true
```

则会影响当前用户使用的所有 Git 仓库。

---

## 九、实际开发中怎么选

简单来说：

| 场景 | 建议 |
| --- | --- |
| 个人开发分支 | Rebase |
| 希望提交历史保持直线 | Rebase |
| 多人共同维护的公共分支 | 根据团队规范决定 |
| 不希望修改提交历史 | Merge |
| 希望禁止自动产生 Merge Commit | Fast-forward only |

团队项目最重要的不是哪一种方式绝对更好，而是：

> **团队成员使用统一的 Git 工作流。**

如果项目已经规定使用 Merge 或 Rebase，应优先遵循项目规范。

---

## 十、处理前先查看当前状态

如果遇到 `divergent branches`，不要急着执行各种命令。

建议先查看：

```bash
git status
```

然后：

```bash
git log --oneline --graph --decorate --all
```

第二条命令可以比较直观地看到本地和远程分支的提交关系。

确认发生了什么以后，再决定使用：

```bash
git pull --rebase
```

还是：

```bash
git pull --no-rebase
```

---

## 十一、总结

`divergent branches` 本身并不是 Git 出错。

它真正表达的是：

> **本地分支和远程分支都存在对方没有的新提交，Git 需要你决定如何整合它们。**

常用的三个处理方式：

```bash
# Merge
git pull --no-rebase

# Rebase
git pull --rebase

# 只允许 Fast-forward
git pull --ff-only
```

遇到这类问题时，最重要的是先理解当前分支的提交关系，而不是看到报错后直接复制命令执行。

对于 Git 来说，理解 **Merge、Rebase、Fast-forward** 之间的区别，比记住某一条解决命令更重要。