import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem } from "@mui/material";
import axios from 'axios';

export default function Employee() {
  const [seatData, setSeatData] = useState([]);
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  // Function to get the current day in a format matching the keys in seat_data
  const getCurrentDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    console.log(days[today-1]);
    return days[today - 1] || 'Monday'; // Default to Monday if day not found
  };

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get('http://34.46.69.235:3001/getSeatData', {
          params: { firstName, lastName }
        });
        console.log('Fetched seat data:', response.data);
        setSeatData(response.data);
      } catch (error) {
        console.error("Error fetching seat data:", error.response ? error.response.data : error.message);
      }
    };

    if (firstName && lastName) {
      fetchSeatData();
    }
  }, [firstName, lastName]);

  const currentDay = getCurrentDay();

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography
        variant="h4"
        sx={{ 
          marginBottom: '20px', 
          color: '#388e3c', // Custom green color
          fontFamily: 'Roboto'
        }}
      >
        Welcome, {firstName} {lastName}!
      </Typography>
      <TableContainer component={Paper} elevation={3} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ backgroundColor: '#66bb6a', color: 'white' }}>Manager Name</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#66bb6a', color: 'white' }}>Floor</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#66bb6a', color: 'white' }}>Business Unit</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#66bb6a', color: 'white' }}>Campus</TableCell>
              <TableCell align="center" sx={{ backgroundColor: '#66bb6a', color: 'white' }}>Seat Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {seatData.length > 0 ? (
              seatData.map((seat, index) => (
                <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#e8f5e9' } }}>
                  <TableCell align="center" sx={{ color: '#2e7d32' }}>{seat.manager_name}</TableCell>
                  <TableCell align="center" sx={{ color: '#2e7d32' }}>{seat.floor}</TableCell>
                  <TableCell align="center" sx={{ color: '#2e7d32' }}>{seat.bu}</TableCell>
                  <TableCell align="center" sx={{ color: '#2e7d32' }}>{seat.campus}</TableCell>
                  <TableCell align="center" sx={{ color: '#2e7d32' }}>
                    {Array.isArray(seat.seat_data) && seat.seat_data.length > 0 ? (
                      seat.seat_data.map((data, dataIndex) => (
                        <List key={dataIndex} sx={{ padding: 0, display: 'inline' }}>
                          {data[currentDay] ? (
                            <ListItem sx={{ padding: '2px 0', fontSize: '0.875rem', display: 'inline', margin: '0' }}>
                              {data[currentDay]}
                            </ListItem>
                          ) : (
                            <Typography variant="body2">No data for today</Typography>
                          )}
                        </List>
                      ))
                    ) : (
                      <Typography variant="body2">No data available</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: '#d32f2f' }}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
