import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { jwtDecode } from 'jwt-decode';


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, token } = useContext(AuthContext);

  // Check if the current path is either /login or /signup
  const hideHeaderOptions = ["/", "/signup", "/login"].includes(location.pathname);

  let decoded;
  if (token) {
    try {
      decoded = jwtDecode(token);
      //console.log(decoded); 
    } catch (error) {
      console.error("Invalid token specified:", error); // Handle token error (e.g., log out the user) 
    }
  }

  const handleHome = () => {
    if (location.pathname !== "/seatAllocationAdmin" && decoded.role === 'admin') {
      console.log(decoded);
      return navigate("/seatAllocationAdmin");
    }
    if (location.pathname !== "/hoe" && decoded.role === 'hoe') {
      return navigate("/hoe");
    }
    if (location.pathname !== "/manager" && decoded.role === 'manager') {
      return navigate("/manager");
    }
    if (location.pathname !== "/employee" && decoded.role === 'employee') {
      return navigate("/employee");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfile = () => {
    if (location.pathname !== "/profile") {
      navigate("/profile");
    }
  };

  const handleGraphs = () => {
    if (location.pathname !== "/graph") {
      navigate("/graph");
    }
  };

  const handleNoShowSeats = () => {
    if (location.pathname !== "/noShowSeats") {
      navigate("/noShowSeats");
    }
  };

  const handleSeatPool = () => {
    if (location.pathname !== "/seatpool") {
      navigate("/seatpool");
    }
  };

  const handlePlan = () => {
    if (decoded.role === 'admin') {
      if (location.pathname !== "/plan") {
        navigate("/plan");
      }
    } else {
      if (location.pathname !== "/hoeplan") {
        navigate("/hoeplan");
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="success" position="static">
        <Toolbar sx={{flexWrap: "wrap", gap:1}}>
          {!hideHeaderOptions && token &&
            <IconButton color="inherit" onClick={handleHome}>
              <HomeRoundedIcon />
            </IconButton>
          }
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Creative Crew
          </Typography>
          {!hideHeaderOptions && (
            <>
              {token && (decoded.role === "admin" || decoded.role === "hoe") && <Typography
                variant="subtitle1"
                component="div"
                onClick={handlePlan}
                sx={{ padding: "1%", cursor: "pointer", "&:hover": { color: "white" } }}
              >
                Plan
              </Typography>}
              <Typography
                variant="subtitle1"
                component="div"
                onClick={handleGraphs}
                sx={{ padding: "1%", cursor: "pointer", "&:hover": { color: "white" } }}
              >
                Graphs
              </Typography>
              <IconButton color="inherit" onClick={handleProfile}>
                <PersonIcon />
              </IconButton>
              {token && decoded.role === "employee" && (
                  <Typography
                    variant="subtitle1"
                    component="div"
                    onClick={handleNoShowSeats}
                    sx={{ padding: "1%", cursor: "pointer", "&:hover": { color: "white" } }}
                  >
                    noShowSeats
                  </Typography>
                )}
                {token && decoded.role === "employee" && (
                  <Typography
                    variant="subtitle1"
                    component="div"
                    onClick={handleSeatPool}
                    sx={{ padding: "1%", cursor: "pointer", "&:hover": { color: "white" } }}
                  >
                    freePool
                  </Typography>
                )}
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ padding: "1%", cursor: "pointer", "&:hover": { color: "white" } }}
                onClick={handleLogout}
              >
                Logout
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

