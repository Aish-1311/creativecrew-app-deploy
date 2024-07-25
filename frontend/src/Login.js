import { Container, Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate(); // Add this line
  const { login } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    } else if (name === "password") {
      if (!validatePassword(value)) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (!validateEmail(email) || !validatePassword(password)) {
  //     setError("Please fix the validation errors");
  //     return;
  //   }

  //   try {
  //     const response = await axios.post("http://34.46.69.235:3001/", {
  //       email,
  //       password,
  //     });
  //     const { accessToken, role } = response.data;

  //     // Save token and role (e.g., in localStorage or state)
  //     localStorage.setItem("token", accessToken);
  //     localStorage.setItem("role", role);
  //     login(accessToken, role);
  //     // Redirect based on role
  //     switch (role) {
  //       case "admin":
  //         navigate("/seatAllocationAdmin");
  //         break;
  //       case "manager":
  //         navigate("/manager");
  //         break;
  //       case "employee":
  //         navigate("/employee");
  //         break;
  //       case "hoe":
  //         navigate("/hoe");
  //         break;
  //       default:
  //         navigate("/"); // Fallback redirection
  //     }
  //   } catch (error) {
  //     console.error("Error during Axios request:", error);
  //     setError("Login failed. Please try again.");
  //   }
  // };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email) || !validatePassword(password)) {
      setError("Please fix the validation errors");
      return;
    }
  
    try {
      const response = await axios.post("http://34.46.69.235:3001/", {
        email,
        password,
      });
      const { token, role, firstName, lastName } = response.data;
  
      // Save token, role, and user details (e.g., in localStorage or state)
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);
      login(token, role);
      
      // Redirect based on role
      switch (role) {
        case "admin":
          navigate("/seatAllocationAdmin");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "employee":
          navigate("/employee");
          break;
        case "hoe":
          navigate("/hoe");
          break;
        default:
          navigate("/"); // Fallback redirection
      }
    } catch (error) {
      console.error("Error during Axios request:", error);
      setError("Login failed. Please try again.");
    }
  };
  

  return (
    <div className="login-container">
      {/* <AppBar position="static" color="success">
        <Toolbar />
      </AppBar> */}
      <Container align="center" className="card" component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            color="success.main"
            fontWeight="bold"
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onBlur={handleBlur}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              color="success"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              onBlur={handleBlur}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              color="success"
            />
            <Button
              color="success"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Grid item>
              <Link href="/signup" variant="body2" color="success.main">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

