import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Paper, TextField, Box, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Seat from './Seat';

const Hoe = () => {
  const [HoeList, setHoeList] = useState([]);
  const [HOE, setHoe] = useState({});  //to store and update HOE
  const [locations, setLocations] = useState([]);

  const [managers, setManagers] = useState([]); //to store and update all managers under HOE
  const [selectedManager, setSelectedManager] = useState('');  //to store and update selected manager in drop-down
  const [selectedSeats, setSelectedSeats] = useState([]);   //to store seats while selecting
  const [isSeatsChanging, setIsSeatsChanging] = useState(false); //we cannot select seats when isSeatsChanging is false

  const [openSnackbar, setOpenSnackbar] = useState(false); // to show a small popup when we update table in database with content "Data Updated Successfully"

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');

  /*-------- these constants are used to show respected values in the dropdowns --------*/
  const countries = [...new Set(locations.map(location => location.country))];
  const states = [...new Set(locations.filter(location => location.country === selectedCountry).map(location => location.state))];
  const cities = [...new Set(locations.filter(location => location.state === selectedState).map(location => location.city))];
  const campuses = [...new Set(locations.filter(location => location.city === selectedCity).map(location => location.campus))];
  const floors = [...new Set(locations.filter(location => location.campus === selectedCampus).map(location => location.floor))];

  /*-------- handleSnackbarClose function is to show & close popup after updating table --------*/
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };


  useEffect(() => {
    getHOEDetails(1);  // Aslo change id in line 110 && 141
  }, []);

  /*-------- getHOEDetails function get HOE and Managers details from database --------*/
  const getHOEDetails = async (id) => {
    try {
      const response1 = await axios.get(`http://34.46.69.235:3001/getHOEFromTable/${id}`);

      await Promise.all([
        setHoeList(response1.data),
        setHoe(response1.data[0]),
        setLocations(response1.data),
        setSelectedCountry(response1.data[0].country),
        setSelectedState(response1.data[0].state),
        setSelectedCity(response1.data[0].city),
        setSelectedCampus(response1.data[0].campus),
        setSelectedFloor(response1.data[0].floor),
      ]);

      // console.log(selectedCampus);
      // console.log(selectedFloor);
      // console.log(response1.data);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const getManagerDetails = useCallback(async (id) => {
    try {
      const response2 = await axios.get(`http://34.46.69.235:3001/getManagersByHOEIdFromTable/${id}`, {
        params: {
          campus: selectedCampus,
          floor: selectedFloor,
          country: selectedCountry,
          state: selectedState,
          city: selectedCity
        }
      });

      //console.log("response 2", response2.data);
      // console.log('Managers data:', response2.data);
      // console.log("Selected Manager:", response2.data[0]);

      setManagers(response2.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name })));

      if (response2.data.length > 0) {
        if (selectedManager === '') {
          setSelectedManager({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name });
        } else {
          const managerDetails = response2.data.filter(item => item.id === selectedManager.id);
          if (managerDetails.length === 0) {
            setSelectedManager({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name });
          } else {
            setSelectedManager({ ...managerDetails[0], name: managerDetails[0].first_name + " " + managerDetails[0].last_name });
          }
        }
      } else {
        setManagers([]);
        setSelectedManager('');
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [selectedFloor, selectedCampus, selectedManager]);

  useEffect(() => {
    if (selectedFloor !== "") {
      getManagerDetails(1);  // Aslo change id in line 41 && 141
    }
  }, [selectedFloor]);

  /*-------- handleManagerChange function is to change selectedManager --------*/
  const handleManagerChange = (event) => {
    const filteredList = managers.filter(manager => manager.id === event.target.value);
    setSelectedManager(filteredList[0]);
    setIsSeatsChanging(false);
    setSelectedSeats([]);
  };

  /*-------- handleSeatClick function is to update selectedSeats upon selecting/deselecting a seat --------*/
  const handleSeatClick = (seat) => {
    if (!selectedSeats.includes(seat)) {
      setSelectedSeats([...selectedSeats, seat]);
    } else {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    }
  };

  /*-------- onClickingUpdateSeats function is to update respective selectedManager seats in database --------*/
  const onClickingUpdateSeats = async () => {
    selectedSeats.sort((a, b) => a - b);
    if (selectedManager && selectedSeats.length > 0) {
      try {
        await axios.put(`http://34.46.69.235:3001/updateManagerData/${selectedManager.id}`, {
          seats: selectedSeats
        });
        setSelectedSeats([]);
        setIsSeatsChanging(false);
        getManagerDetails(1); // Refresh data  // Aslo change id in line 41 && 110
        setOpenSnackbar(true); // Show Snackbar
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please select atleast one seat.");
    }
  };

  /*-------- renderSeats function is to get Seats from Seat component in Seat.js file --------*/
  const renderSeats = () => {
    let seats = [];
    /*ranges.forEach(range => {*/
    for (let i = 1; i <= HOE.total; i++) {
      seats.push(
        <Seat
          floor={HOE.floor}
          totalHoeSeats={HOE.seats}
          managerDetails={selectedManager}
          managersList={managers}
          isSeatsChanging={isSeatsChanging}
          key={i}
          number={i}
          isSelected={selectedSeats.includes(i)}
          onClick={() => handleSeatClick(i)}
        />
      );
    }//}
    //)
    return seats;
  };

  /*-------- onClickingChangeSeats function enables all selectedManager and available seats and we will able to select those seats --------*/
  const onClickingChangeSeats = () => {
    setIsSeatsChanging(true);
    setSelectedSeats([...selectedSeats, ...selectedManager.seats_array]);
  }

  /*-------- countAllocatedSeats function is to get values to display in table at top --------*/
  const countAllocatedSeats = () => {
    const seats = managers.flatMap(manager => manager.seats_array);
    const filteredSeats = isSeatsChanging ? seats.filter(item => !selectedManager.seats_array.includes(item)) : seats;
    return filteredSeats.length;
  }

  return (
    <div style={{ marginTop: 50, marginBottom: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box>
        <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap" gap={2} mb={2}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              value={selectedCountry}
              label="Country"
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState('');
                setSelectedCity('');
                setSelectedCampus('');
                setSelectedFloor('');
              }}
            >
              {countries.map((country, index) => (
                <MenuItem key={index} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={!selectedCountry}>
            <InputLabel id="state-select-label">State</InputLabel>
            <Select
              labelId="state-select-label"
              id="state-select"
              value={selectedState}
              label="State"
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
                setSelectedCampus('');
                setSelectedFloor('');
              }}
            >
              {states.map((state, index) => (
                <MenuItem key={index} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={!selectedState}>
            <InputLabel id="city-select-label">City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={selectedCity}
              label="City"
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedCampus('');
                setSelectedFloor('');
              }}
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={!selectedCity}>
            <InputLabel id="campus-select-label">Campus</InputLabel>
            <Select
              labelId="campus-select-label"
              id="campus-select"
              value={selectedCampus}
              label="Campus"
              onChange={(e) => {
                setSelectedCampus(e.target.value);
                setSelectedFloor('');
                setIsSeatsChanging(false);
              }}
            >
              {campuses.map((campus, index) => (
                <MenuItem key={index} value={campus}>
                  {campus}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }} disabled={!selectedCampus}>
            <InputLabel id="floor-select-label">Floor</InputLabel>
            <Select
              labelId="floor-select-label"
              id="floor-select"
              value={selectedFloor}
              label="Floor"
              onChange={(e) => {
                setSelectedFloor(e.target.value);
                setHoe(HoeList.filter(item => item.campus === selectedCampus && item.floor === e.target.value)[0]);
                setIsSeatsChanging(false);
                setSelectedSeats([]);
                setManagers([]);
                setSelectedManager("");
              }}
            >
              {floors.map((floor, index) => (
                <MenuItem key={index} value={floor}>
                  {floor}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {HoeList.length > 0 && <TableContainer component={Paper} sx={{ marginTop: '20px', marginBottom: '40px', width: "80%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Seats Assigned By Admin</TableCell>
              <TableCell>{HOE.seats.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seats Assigned To Managers</TableCell>
              <TableCell>{String(countAllocatedSeats())}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Seats Available</TableCell>
              <TableCell>{String(HOE.seats.length - countAllocatedSeats())}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>}
      <FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
        <InputLabel id="manager-select-label">Select Manager</InputLabel>
        <Select
          labelId="manager-select-label"
          id="manager-select"
          value={selectedManager ? selectedManager.id : ""}
          label="Select Manager"
          onChange={handleManagerChange}
        >
          {managers.map((manager) => (
            <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6" >Seats Layout</Typography>

      <Box display="flex" flexDirection="row" gap={2}>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">Country: {HOE.country}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">State: {HOE.state}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">City: {HOE.city}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">Campus: {HOE.campus}</Typography>
        </Box>
        <Box p={1} border={1} borderRadius={4}>
          <Typography variant="body2">Floor: {HOE.floor}</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} style={{ margin: '20px 20px', width: "90%", display: "flex", justifyContent: "center", maxHeight: "400px", overflowY: "auto" }}>
        {HoeList.length > 0 && renderSeats()}
      </Grid>

      <Grid container spacing={5} justifyContent="center" marginBottom={5}>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#28a745', display: 'inline-block', marginRight: '5px' }} />
          <Typography variant="body2" display="inline">Available Seats</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#ffc107', display: 'inline-block', marginRight: '5px' }} />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">Manager Seats</Typography>
        </Grid>
        <Grid item>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#007bff', display: 'inline-block', marginRight: '5px' }} />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">Selected Seats</Typography>
        </Grid>
        <Grid item>
          <Box sx={{
            width: 20, height: 20, background: '#fd7e14', display: 'inline-block', marginRight: '5px', position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: '50%',
              backgroundColor: '#ffc107'
            }
          }} />
          <Typography variant="body2" display="inline">Allocated Seats</Typography>
        </Grid>
      </Grid>

      {/*<Button variant="contained" color="primary" onClick={allocateSeats}>Allocate Seats</Button> */}
      {!isSeatsChanging && managers.length > 0 &&
        <Button variant="contained" color="primary" onClick={onClickingChangeSeats}>Change Seats for {selectedManager.name}</Button>}
      {isSeatsChanging && <Paper elevation={0} style={{ padding: '20px', marginTop: '20px' }}>
        <TextField
          label="Selected Seats"
          fullWidth
          value={selectedSeats}
          style={{ marginBottom: '25px' }}
          InputProps={{
            readOnly: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={onClickingUpdateSeats}>Update Seats for {selectedManager.name}</Button>
      </Paper>}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Data updated successfully!
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Hoe;

