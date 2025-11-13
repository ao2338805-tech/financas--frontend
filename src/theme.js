import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#eb799fff', // vibrante
    accent: '#ff9fc0',
    background: '#fff6fb',
    surface: '#ffffff',
    text: '#3b0230',
    placeholder: '#b85d7a',
    notification: '#ff6b9f',
  },
  roundness: 12,
};

export const layout = {
  headerHeight: 140,
};

