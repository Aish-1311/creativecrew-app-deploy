import React, { useState } from "react";
import {
  Container,
  Typography,
  Link,
  MenuItem,
  Grid,
} from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    bu: "", // Business Unit
    transport: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    bu: "", // Business Unit
    transport: "",
    form: "",
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    let error = "";
    if (name === "email" && !validateEmail(value)) {
      error = "Invalid email address";
    } else if (name === "password" && !validatePassword(value)) {
      error = "Password must be at least 6 characters";
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value.trim() }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstName, lastName, email, password, role, bu, transport } =
      formData;
    const dataToSubmit = {
      firstName,
      lastName,
      email,
      password,
      role,
      bu,
      transport,
    };

    console.log("Submitting data:", dataToSubmit); // Log data being sent

    try {
      const response = await axios.post(
        "http://34.46.69.235:3001/signup",
        dataToSubmit
      );
      console.log(response.data);
      navigate("/");
      // Redirect or handle success
    } catch (error) {
      console.error("Error during Axios request:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form:
          error.response?.data?.message || "Signup failed. Please try again.",
      }));
    }
  };

  return (
    <div className="signup-container">
    
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
            Sign Up
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
              id="firstName"
              label="First Name"
              name="firstName" // Updated to match backend
              autoFocus
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              color="success"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName" // Updated to match backend
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              color="success"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
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
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              color="success"
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="role"
                  label="Role"
                  name="role"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.role}
                  helperText={errors.role}
                  color="success"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="hoe">HOE</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="bu"
                  label="Business Unit"
                  name="bu" // Updated to match backend
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!errors.bu}
                  helperText={errors.bu}
                  color="success"
                >
                  <MenuItem value="cloud">Cloud</MenuItem>
                  <MenuItem value="service">Service</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <TextField
              margin="normal"
              required
              fullWidth
              select
              id="transport"
              label="Transport"
              name="transport"
              onBlur={handleBlur}
              onChange={handleChange}
              error={!!errors.transport}
              helperText={errors.transport}
              color="success"
            >
              <MenuItem value="cab">Cab</MenuItem>
              <MenuItem value="self">Self</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </TextField>
            <Button
              color="success"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {errors.form && (
              <Typography color="error" variant="body2">
                {errors.form}
              </Typography>
            )}
            <Grid item sx={{ mb: 2 }}>
              <Link href="/" variant="body2" color="success.main">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
