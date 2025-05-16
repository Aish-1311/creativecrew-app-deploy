import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  Box,
  useMediaQuery,
  Button,
} from "@mui/material";
import axios from "axios";
import { baseurl } from "./utils";
import { AuthContext } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";

export default function Employee() {
  const [seatData, setSeatData] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [noShowSeats, setNoShowSeats] = useState(new Set());
  const { token } = useContext(AuthContext);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const decoded = jwtDecode(token);

  // Fetch seat allocation and pre-fill employee_selected_seats
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        if (token) {
          const response = await axios.get(`${baseurl}/getSeatData`, {
            params: {
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              bu: decoded.bu,
            },
          });

          const data = response.data.map((item) => ({
            ...item,
            seat_data: [item.seat_data],
          }));
          setSeatData(data);

          for (const seat of data) {
            const seatEntries = seat.seat_data[0];
            for (const [day, seatNumber] of Object.entries(seatEntries)) {
              if (seatNumber !== "WFH" && seatNumber !== "No data") {
                try {
                  await axios.post(`${baseurl}/selectSeat`, {
                    first_name: decoded.firstName,
                    last_name: decoded.lastName,
                    seat_number: seatNumber,
                    country: seat.country,
                    state: seat.state,
                    city: seat.city,
                    campus: seat.campus,
                    floor: seat.floor,
                    day: day,
                  });
                } catch (error) {
                  if (error.response?.status !== 409) {
                    console.error(`Failed to book seat ${seatNumber} on ${day}:`, error.message);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching seat data:", error.response?.data || error.message);
      }
    };

    const today = new Date().getDay();
    if (today === 0) {
      localStorage.removeItem("noShowSeats");
      setNoShowSeats(new Set());
    } else {
      const storedNoShowData = JSON.parse(localStorage.getItem("noShowSeats")) || {};
      setNoShowSeats(new Set(Object.keys(storedNoShowData)));
    }

    if (token) {
      fetchSeatData();
    }
  }, [token]);

  // Fetch booked seats from employee_selected_seats
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get(`${baseurl}/getSelectedSeats`, {
          params: {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
          },
        });
        setBookedSeats(response.data);
      } catch (error) {
        console.error("Error fetching booked seats:", error.message);
      }
    };

    if (token) fetchBookedSeats();
  }, [token]);

  // Handle No Show
  const handleNoShow = async (seat, day) => {
    const seatKey = `${seat.seat_data[0][day]}-${day}`;
    if (noShowSeats.has(seatKey)) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to cancel this seat for this week? It will reopen after Sunday."
    );

    if (!isConfirmed) return;

    try {
      await axios.post(`${baseurl}/markNoShow`, {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        seatNumber: seat.seat_data[0][day],
        country: seat.country,
        state: seat.state,
        city: seat.city,
        campus: seat.campus,
        floor: seat.floor,
        day,
      });

      const updatedNoShowSeats = new Set(noShowSeats);
      updatedNoShowSeats.add(seatKey);
      setNoShowSeats(updatedNoShowSeats);

      const storedNoShowData = JSON.parse(localStorage.getItem("noShowSeats")) || {};
      storedNoShowData[seatKey] = new Date().toISOString();
      localStorage.setItem("noShowSeats", JSON.stringify(storedNoShowData));

      alert(`Marked as No Show for ${day}`);
    } catch (error) {
      console.error("Error marking No Show:", error);
      alert("Failed to mark No Show");
    }
  };

  // Cancel selected seat
  const cancelSeat = async (seat) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to cancel your seat for ${seat.day}?`
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`${baseurl}/cancelSeat`, {
        data: {
          first_name: decoded.firstName,
          last_name: decoded.lastName,
          day: seat.day,
        },
      });

      setBookedSeats((prev) =>
        prev.filter((s) => !(s.day === seat.day && s.seat_number === seat.seat_number))
      );
      alert("Seat cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling seat:", error.message);
      alert("Failed to cancel seat.");
    }
  };

  return (
    <Container xs={{ mt: 4, px: isMobile ? 1 : 5 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ mb: 3, color: "#2c3e50", fontWeight: "bold", textAlign: "center" }}
      >
        Welcome, {decoded.firstName} {decoded.lastName}!
      </Typography>

      {/* Seat Allocation Table */}
      <Box sx={{ overflowX: "auto", mb: 4 }}>
          
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: isMobile ? "center" : "left"  }}>
          Seat Allocation
        </Typography>
        <TableContainer component={Paper} elevation={5} sx={{ borderRadius: "12px", minWidth: isMobile ? 600 : "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#2980b9" }}>
                {[
                  "Manager Name",
                  "Country",
                  "State",
                  "City",
                  "Floor",
                  "Business Unit",
                  "Campus",
                  "Seat Allocation",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{ color: "white", fontWeight: "bold", py: 1 }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {seatData.length > 0 ? (
                seatData.map((seat, index) => (
                  <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#ecf0f1" } }}>
                    <TableCell align="center">{seat.first_name} {seat.last_name}</TableCell>
                    <TableCell align="center">{seat.country}</TableCell>
                    <TableCell align="center">{seat.state}</TableCell>
                    <TableCell align="center">{seat.city}</TableCell>
                    <TableCell align="center">{seat.floor}</TableCell>
                    <TableCell align="center">{seat.business_unit}</TableCell>
                    <TableCell align="center">{seat.campus}</TableCell>
                    <TableCell align="center">
                      {Array.isArray(seat.seat_data) && seat.seat_data.length > 0 ? (
                        <List sx={{ p: 1, backgroundColor: "#dff9fb", borderRadius: "8px", display: "inline-block", textAlign: "left" }}>
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
                            const seatKey = `${seat.seat_data[0][day]}-${day}`;
                            return (
                              <ListItem
                                key={day}
                                sx={{
                                  p: "4px",
                                  fontSize: "0.9rem",
                                  fontWeight: "bold",
                                  color: seat.seat_data[0][day] === "WFH" ? "#e74c3c" : "#27ae60",
                                  backgroundColor: seat.seat_data[0][day] === "WFH" ? "#fdecea" : "#eafaf1",
                                  borderRadius: "6px",
                                  mb: "4px",
                                }}
                              >
                                {day}: {seat.seat_data[0][day] || "No data"}
                                {seat.seat_data[0][day] !== "WFH" &&
                                  seat.seat_data[0][day] !== "No data" && (
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      sx={{ ml: 1 }}
                                      onClick={() => handleNoShow(seat, day)}
                                      disabled={noShowSeats.has(seatKey)}
                                    >
                                      {noShowSeats.has(seatKey) ? "No Showed" : "No Show"}
                                    </Button>
                                  )}
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography variant="body2" sx={{ color: "#e74c3c", fontWeight: "bold" }}>
                          No data available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ color: "#e74c3c", fontWeight: "bold" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


      {/* Booked Seats Table */}
      <Box sx={{ overflowX: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Your Booked Seats
        </Typography>
        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#2c3e50" }}>
              <TableRow>
                {["Day", "Seat Number", "Campus", "Floor", "City", "Cancel"].map((header) => (
                  <TableCell key={header} align="center" sx={{ color: "#fff", fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookedSeats.length > 0 ? (
                bookedSeats.map((seat, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{seat.day}</TableCell>
                    <TableCell align="center">{seat.seat_number}</TableCell>
                    <TableCell align="center">{seat.campus}</TableCell>
                    <TableCell align="center">{seat.floor}</TableCell>
                    <TableCell align="center">{seat.city}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => cancelSeat(seat)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: "#e74c3c" }}>
                    No seats booked.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}