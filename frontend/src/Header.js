import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Check if the current path is either /login or /signup
  const hideLogout = ["/", "/signup"].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="success" position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Creative Crew Technology Center
          </Typography>
          {!hideLogout && (
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ padding: "1%", cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}