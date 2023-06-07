import { createTheme } from '@mui/material/styles';

const myColors = {
  blue: 'rgb(25, 118, 210)',
  purple: 'rgb(156, 39, 176)',
  green: 'rgb(46, 125, 50)',
  orange: 'rgb(237, 108, 2)',
  red: 'rgb(211, 47, 47)',
};

export const userTheme = () => {
  return createTheme({
    palette: {
      mode: localStorage.getItem('brightnessMode') || 'light',
      primary: {
        main: myColors[localStorage.getItem('colorTheme') || 'blue']
      }
    }
  });
}
