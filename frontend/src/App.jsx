import React from "react";
import { Routes, Route } from 'react-router-dom';
import { themeSettings } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import LoginPage from './pages/Login';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import Home from "./pages/Home";

function App() {
  const mode = useSelector((state) => state.mode)
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector((state) => state.token))
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer /> {/* Place ToastContainer here */}
        <Routes>
          {/* {isAuth&(<><Route path="/home" /></>)} */}
          <Route path='/' element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
