// import statements (same as before)
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
  const [actionedSeats, setActionedSeats] = useState(new Set());
  const { token } = useContext(AuthContext);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const decoded = jwtDecode(token);

  // Fetch seat data
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
                    console.error(
                      `Failed to book seat ${seatNumber} on ${day}:`,
                      error.message
                    );
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(
          "Error fetching seat data:",
          error.response?.data || error.message
        );
      }
    };

    const today = new Date().getDay();
    if (today === 0) {
      localStorage.removeItem("seatActions");
      setActionedSeats(new Set());
    } else {
      const stored = JSON.parse(localStorage.getItem("seatActions")) || {};
      setActionedSeats(new Set(Object.keys(stored)));
    }

    if (token) fetchSeatData();
  }, [token]);

  // Fetch booked seats
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

  const handleAction = async (seat, day, action) => {
    const seatKey = `${seat.seat_data[0][day]}-${day}`;
    if (actionedSeats.has(seatKey)) return;

    const confirmMsg =
      action === "NoShow"
        ? "Are you sure you want to mark No Show for this day?"
        : "Confirm you are occupying the seat this day?";
    const isConfirmed = window.confirm(confirmMsg);
    if (!isConfirmed) return;

    try {
      if (action === "NoShow") {
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
      } else {
        await axios.post(`${baseurl}/confirmOccupySeat`, {
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
      }

      const updated = new Set(actionedSeats);
      updated.add(seatKey);
      setActionedSeats(updated);

      const stored = JSON.parse(localStorage.getItem("seatActions")) || {};
      stored[seatKey] = new Date().toISOString();
      localStorage.setItem("seatActions", JSON.stringify(stored));

      alert(
        action === "NoShow"
          ? `Marked as No Show for ${day}`
          : `Confirmed Occupy for ${day}`
      );
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      alert(`Failed to perform action: ${action}`);
    }
  };

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
        prev.filter(
          (s) => !(s.day === seat.day && s.seat_number === seat.seat_number)
        )
      );
      alert("Seat cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling seat:", error.message);
      alert("Failed to cancel seat.");
    }
  };

  return (
    <Container sx={{ mt: 4, px: isMobile ? 2 : 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          mb: 3,
          color: "#2c3e50",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Welcome, {decoded.firstName} {decoded.lastName}!
      </Typography>

      <Box sx={{ overflowX: "auto", mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Seat Allocation
        </Typography>
        <TableContainer
          component={Paper}
          elevation={5}
          sx={{ borderRadius: 3 }}
        >
          <Table>
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
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#ecf0f1" },
                    }}
                  >
                    <TableCell align="center">
                      {seat.first_name} {seat.last_name}
                    </TableCell>
                    <TableCell align="center">{seat.country}</TableCell>
                    <TableCell align="center">{seat.state}</TableCell>
                    <TableCell align="center">{seat.city}</TableCell>
                    <TableCell align="center">{seat.floor}</TableCell>
                    <TableCell align="center">{seat.business_unit}</TableCell>
                    <TableCell align="center">{seat.campus}</TableCell>
                    <TableCell align="center">
                      {Array.isArray(seat.seat_data) &&
                      seat.seat_data.length > 0 ? (
                        <List
                          sx={{
                            p: 1,
                            backgroundColor: "#dff9fb",
                            borderRadius: "8px",
                            display: "inline-block",
                            textAlign: "left",
                          }}
                        >
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                          ].map((day) => {
                            const seatVal = seat.seat_data[0][day];
                            const seatKey = `${seatVal}-${day}`;
                            return (
                              <ListItem
                                key={day}
                                sx={{
                                  p: "4px",
                                  fontSize: "0.9rem",
                                  fontWeight: "bold",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "start",
                                  color:
                                    seatVal === "WFH" ? "#e74c3c" : "#27ae60",
                                  backgroundColor:
                                    seatVal === "WFH" ? "#fdecea" : "#eafaf1",
                                  borderRadius: "6px",
                                  mb: "6px",
                                }}
                              >
                                {day}: {seatVal || "No data"}
                                {seatVal !== "WFH" && seatVal !== "No data" && (
                                  <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      onClick={() =>
                                        handleAction(seat, day, "NoShow")
                                      }
                                      disabled={actionedSeats.has(seatKey)}
                                    >
                                      No Show
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      onClick={() =>
                                        handleAction(seat, day, "Occupy")
                                      }
                                      disabled={actionedSeats.has(seatKey)}
                                    >
                                      Occupy
                                    </Button>
                                  </Box>
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: "#e74c3c", fontWeight: "bold" }}
                        >
                          No data available
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ color: "#e74c3c", fontWeight: "bold" }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Booked Seats */}
      <Box sx={{ overflowX: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Your Booked Seats
        </Typography>
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{ borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#2c3e50" }}>
              <TableRow>
                {[
                  "Day",
                  "Seat Number",
                  "Campus",
                  "Floor",
                  "City",
                  "Cancel",
                ].map((header) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{ color: "#fff", fontWeight: "bold" }}
                  >
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
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ color: "#e74c3c" }}
                  >
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
