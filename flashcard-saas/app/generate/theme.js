// theme.js
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue color for primary actions
    },
    background: {
      default: '#fff', // White background for light mode
      paper: '#f5f5f5', // Light gray paper background
    },
    text: {
      primary: '#000', // Black text for light mode
      secondary: '#555', // Dark gray text for secondary content
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue color for primary actions
    },
    background: {
      default: '#121212', // Dark background for dark mode
      paper: '#1e1e1e', // Slightly lighter dark paper background
    },
    text: {
      primary: '#fff', // White text for dark mode
      secondary: '#ccc', // Light gray text for secondary content
    },
  },
});
