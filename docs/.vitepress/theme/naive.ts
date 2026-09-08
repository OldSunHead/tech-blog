import type { GlobalThemeOverrides } from 'naive-ui'

export function blogTheme(dark: boolean): GlobalThemeOverrides {
  return {
    common: {
      primaryColor: dark ? '#7bceb2' : '#26705b',
      primaryColorHover: dark ? '#9cddc7' : '#35866e',
      primaryColorPressed: dark ? '#60b99c' : '#1d5847',
      primaryColorSuppl: '#26705b',
      bodyColor: dark ? '#131a1a' : '#f5f7f6',
      cardColor: dark ? '#1b2423' : '#ffffff',
      textColor1: dark ? '#e7edeb' : '#23342e',
      textColor2: dark ? '#b0bfba' : '#5e6f68',
      textColor3: dark ? '#91a59c' : '#5f7167',
      borderColor: dark ? '#35433d' : '#e4ebe7',
      borderRadius: '10px',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    },
    Card: { borderRadius: '18px', paddingMedium: '28px' },
    Button: { fontWeight: '500', heightLarge: '46px', paddingLarge: '0 24px' },
    Tag: { borderRadius: '6px', fontSizeSmall: '12px', heightSmall: '25px' }
  }
}
