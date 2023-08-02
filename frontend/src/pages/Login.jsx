import { Grid, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import aiiLogo from "../assets/aii_logo.png"; // Replace with the actual path to the image
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  
  const isAuth = Boolean(useSelector((state) => state.token))
  const navigate = useNavigate()
  console.log(isAuth)
  useEffect(() => {
    if(isAuth){
      navigate("/home")
    }
  }, [isAuth, navigate])
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold"  fontSize="32px" color="primary">
          Language Identification
        </Typography>
      </Box>

      <Box
        width="100%"
        height="100vh"
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
        sx={{ overflowY: "hidden" }} 
      >
        <Grid container spacing={isNonMobileScreens ? 4 : 2}>
          {/* Right Side: Form */}
          <Grid item xs={12} md={6}>
            <Box p={isNonMobileScreens ? "0 2rem" : "0"}>
              <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                Welcome to Language Identification - Your Language Identifier
              </Typography>
              <Form />
            </Box>
          </Grid>

          {isNonMobileScreens && (
            <Grid item xs={12} md={6}>
              <Box>
                <img src={aiiLogo} alt="Aii Logo" style={{ maxWidth: "100%" }} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
