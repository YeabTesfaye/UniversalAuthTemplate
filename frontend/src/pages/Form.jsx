import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import { useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../state";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from 'react-toastify';
import axios from "axios"; // Import Axios

const BASE_URL = 'http://localhost:8000/api/v1';

const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("Required")
    .matches(/^[a-zA-Z]+$/, "First name must contain only letters"),
  lastName: yup
    .string()
    .required("Required")
    .matches(/^[a-zA-Z]+$/, "Last name must contain only letters"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
    ),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
  firstName: "", // Add these fields with initial values
  lastName: "", // Add these fields with initial values
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // useEffect(() => {
  //   const user = useSelector((state) => state.auth.user)
  // }, [user])

  const register = async (values, onSubmitProps) => {
    try {
      const savedUser = await axios.post(`${BASE_URL}/user/register`, values);
      onSubmitProps.resetForm();
      if (savedUser.data) {
        setPageType("login");
        toast.success('Registration successful! An email has been sent for verification.',
          { position: toast.POSITION.TOP_RIGHT })
      }
    } catch (error) {
      console.error("Error while registering:", error);
      toast.error('An error occurred during registration',
        { position: toast.POSITION.TOP_RIGHT })
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const {data} = await axios.post(`${BASE_URL}/user/login`, values);
      console.log(data, values)
      onSubmitProps.resetForm();
      if (data) {
        dispatch(
          setLogin({
            user: data.user,
            token: data.token,
          })
        );
        navigate("/home");
      }
    } catch (error) {
      console.error("Error while logging in:", error);
      // Handle errors here
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {!isLogin && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <Box sx={{ gridColumn: "span 4", position: "relative" }}>
              {/* Password Field */}
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />
              {/* Password visibility toggle button */}
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: showPassword ? palette.primary.main : palette.text.disabled,
                }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Box
                sx={{
                  width: "250px", // Adjust the width as needed to prevent wrapping
                }}
              >
                <Typography
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                  }}
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                      color: palette.primary.light,
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
