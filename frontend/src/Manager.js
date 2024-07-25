//changed ranges in giving renderSeats function

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Paper, TextField, Box, Snackbar, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import Seat from './ManagerSeats';

const Manager = () => {
    const days = [
        { id: 'Monday', value: 'Monday' },
        { id: 'Tuesday', value: 'Tuesday' },
        { id: 'Wednesday', value: 'Wednesday' },
        { id: 'Thursday', value: 'Thursday' },
        { id: 'Friday', value: 'Friday' },
        { id: 'All Days', value: 'all' }
    ];

    const [manager, setManager] = useState({});  //to store and update HOE
    const [employees, setEmployees] = useState([]); //to store and update all managers under HOE
    const [selectedEmployee, setSelectedEmployee] = useState('');  //to store and update selected manager in drop-down
    const [selectedSeats, setSelectedSeats] = useState("WFH");   //to store seats while selecting
    const [isSeatsChanging, setIsSeatsChanging] = useState(false); //we cannot select seats when isSeatsChanging is false
    const [selectedDay, setSelectedDay] = useState(days[5].value);
    const [seatData, setSeatData] = useState({});

    const [openSnackbar, setOpenSnackbar] = useState(false); // to show a small popup when we update table in database with content "Data Updated Successfully"
    const [OpenWFHSnackbar, setOpenWFHSnackbar] = useState(false);
    /*-------- handleSnackbarClose function is to show & close popup after updating table --------*/
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };
    const handleWFHSnackbarClose = () => {
        setOpenWFHSnackbar(false);
    };

    const snackbarStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
    };


    useEffect(() => {
        getManagerDetails(1);  //Line 133
    }, []);

    /*-------- getHOEDetails function get HOE and Managers details from database --------*/
    const getManagerDetails = async (id) => {
        try {
            const response1 = await axios.get(`http://34.46.69.235:3001/getManagerFromTable/${id}`);
            const response2 = await axios.get(`http://34.46.69.235:3001/getEmployeesByManagerIdFromTable/${id}`);
            // console.log(response1.data);
            // console.log('Manager data:', response1.data[0]);
            //  console.log("Employees", response2.data);

            setManager(response1.data[0]);
            //console.log(response1.data[0] > 0);
            setEmployees(response2.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name, seats_array: [...new Set(Object.values(item.seat_data))] })));


            if (response2.data.length > 0) {
                if (selectedEmployee === '') {
                    setSelectedEmployee({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name, seats_array: [...new Set(Object.values(response2.data[0].seat_data))] });
                    setSeatData(response2.data[0].seat_data);
                } else {
                    const employeeDetails = response2.data.filter(item => item.id === selectedEmployee.id);
                    //console.log("employeeDetails", employeeDetails);
                    if (employeeDetails.length === 0) {
                        setSelectedEmployee({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name, seats_array: [...new Set(Object.values(response2.data[0].seat_data))] });
                        setSeatData(response2.data[0].seat_data);
                    } else {
                        setSelectedEmployee({ ...employeeDetails[0], name: employeeDetails[0].first_name + " " + employeeDetails[0].last_name, seats_array: [...new Set(Object.values(employeeDetails[0].seat_data))] });
                        setSeatData(employeeDetails[0].seat_data);
                    }
                }
            } else {
                setEmployees([]);
                setSelectedEmployee('');
                setSeatData({});
            }
            // setSelectedEmployee({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name, seats_array: [...new Set(Object.values(response2.data[0].seat_data))] });
            // setSeatData(response2.data[0].seat_data);

            // if (response2.data.length > 0) {
            //   if (selectedManager === '') {
            //     setSelectedManager({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name });
            //   } else {
            //     const managerDetails = response2.data.filter(item => item.id === selectedManager.id);
            //     if (managerDetails.length === 0) {
            //       setSelectedManager({ ...response2.data[0], name: response2.data[0].first_name + " " + response2.data[0].last_name });
            //     } else {
            //       setSelectedManager({ ...managerDetails[0], name: managerDetails[0].first_name + " " + managerDetails[0].last_name });
            //     }
            //   }
            // } else {
            //   setManagers([]);
            //   setSelectedManager('');
            // }

        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    /*-------- handleManagerChange function is to change selectedManager --------*/
    const handleManagerChange = (event) => {
        // console.log("event", event.target.value);
        // console.log(managers);
        const filteredList = employees.filter(manager => manager.id === event.target.value);
        setSelectedEmployee(filteredList[0]);
        setSeatData(filteredList[0].seat_data);
        setIsSeatsChanging(false);
        setSelectedSeats("WFH");
        if (selectedDay !== "all" && filteredList[0].seat_data[selectedDay] === 'WFH') setOpenWFHSnackbar(true);
    };

    /*-------- handleSeatClick function is to update selectedSeats upon selecting/deselecting a seat --------*/
    const handleSeatClick = (seat) => {
        if (!(selectedSeats === parseInt(seat))) {
            setSelectedSeats(seat);
            setSeatData({ ...seatData, [selectedDay]: seat })
        } else {
            setSelectedSeats("WFH");
            setSeatData({ ...seatData, [selectedDay]: "WFH" })
        }
    };

    /*-------- onClickingUpdateSeats function is to update respective selectedManager seats in database --------*/
    const onClickingUpdateSeats = async () => {
        //selectedSeats.sort((a, b) => a - b);
        //console.log(selectedSeats);
        //console.log(typeof (selectedSeats));
        if (selectedEmployee) {
            try {
                await axios.put(`http://34.46.69.235:3001/updateEmployeeSeatData/${selectedEmployee.id}`, {
                    seats: seatData
                });
                setSelectedSeats("WFH");
                setIsSeatsChanging(false);
                getManagerDetails(1); // Refresh data
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
        for (let i = 1; i <= manager.total; i++) {
            //console.log("selcted seats", selectedSeats);
            seats.push(
                <Seat
                    seatData={seatData}
                    day={selectedDay}
                    floor={manager.floor}
                    totalManagerSeats={manager.seats_array}
                    employeeDetails={selectedEmployee}
                    employeesList={employees}
                    isSeatsChanging={isSeatsChanging}
                    key={i}
                    number={i}
                    isSelected={selectedSeats === i}
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
        if (selectedDay === "all") {
            setSelectedDay("Monday");
            setSelectedSeats(seatData["Monday"]);
        }
        else {
            setSelectedSeats(seatData[selectedDay]);
        }
    }

    const handleClickDay = (day) => {
        setSelectedDay(day);
        if (isSeatsChanging) setSelectedSeats(seatData[day]);
        console.log(seatData[day]);

        if (day !== "all" && seatData[day] === 'WFH') {
            setOpenWFHSnackbar(true);
            setTimeout(() => {
                setOpenWFHSnackbar(true); // Reopen the snackbar after a short delay
            }, 0);
        }

        //below lines to filter employees based on selectedDay to show total allocations on that particular day
        //return employees.filter(employee => typeof (employee.seat_data[day]) === 'number');

        // Add your logic here for what happens when a button is clicked
    };

    const employeesAllocatedOnSelectedDay = () => {
        if (selectedDay === 'all') {
            const arrayHavingAllSeatsValues = employees.map(employee => [...new Set(Object.values(employee.seat_data))]).flat();
            const arrayAfterRemovingWFH = arrayHavingAllSeatsValues.filter(item => typeof (item) == 'number');
            return arrayAfterRemovingWFH.length;
        }

        return employees.filter(employee => typeof (employee.seat_data[selectedDay]) === 'number').length;
    }

    return (
        <div style={{ marginTop: 50, marginBottom: 50, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {Object.keys(manager).length > 0 && <TableContainer component={Paper} sx={{ marginTop: '20px', marginBottom: '40px', width: "80%" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Seats Assigned By HOE</TableCell>
                            <TableCell>{manager.seats_array.length}</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableBody>
                        <TableRow>
                            <TableCell>Seats Assigned To Employees  {selectedDay === "all" ? `For The Week` : `on ${selectedDay}`}</TableCell>
                            <TableCell>{employeesAllocatedOnSelectedDay()}</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableBody>
                        <TableRow>
                            <TableCell>Seats Available  {selectedDay === "all" ? `For The Week` : `on ${selectedDay}`}</TableCell>
                            <TableCell>{manager.seats_array.length - employeesAllocatedOnSelectedDay()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>}
            <FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
                <InputLabel id="manager-select-label">Select Employee</InputLabel>
                <Select
                    labelId="manager-select-label"
                    id="manager-select"
                    value={selectedEmployee ? selectedEmployee.id : ""}
                    label="Select Employee"
                    onChange={handleManagerChange}
                >
                    {employees.map((manager) => (
                        <MenuItem key={manager.id} value={manager.id}>{manager.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box display="flex" flexDirection="row" justifyContent='center' flexWrap='wrap' alignItems="center" gap={2} mb={2}>
                {days.map((day) => (
                    <Button key={day.id} variant="contained" disabled={isSeatsChanging ? day.value === "all" ? true : false : false} onClick={() => handleClickDay(day.value)} sx={{ backgroundColor: selectedDay === day.value ? "primary" : "grey" }}>
                        {day.id}
                    </Button>
                ))}
            </Box>

            <Typography variant="h6" >Seats Layout</Typography>

            <Box display="flex" flexDirection="row" gap={2}>
                <Box p={1} border={1} borderRadius={4}>
                    <Typography variant="body2">Country: {manager.country}</Typography>
                </Box>
                <Box p={1} border={1} borderRadius={4}>
                    <Typography variant="body2">State: {manager.state}</Typography>
                </Box>
                <Box p={1} border={1} borderRadius={4}>
                    <Typography variant="body2">City: {manager.city}</Typography>
                </Box>
                <Box p={1} border={1} borderRadius={4}>
                    <Typography variant="body2">City: {manager.campus}</Typography>
                </Box>
                <Box p={1} border={1} borderRadius={4}>
                    <Typography variant="body2">Floor: {manager.floor}</Typography>
                </Box>
            </Box>

            <Grid container spacing={2} style={{ margin: '20px 20px', width: "90%", display: "flex", justifyContent: "center", height: "400px", overflowY: "auto" }}>
                {Object.keys(manager).length > 0 && renderSeats()}
            </Grid>

            <Grid container spacing={5} justifyContent="center" marginBottom={5}>
                <Grid item>
                    <Box sx={{ width: 20, height: 20, backgroundColor: '#28a745', display: 'inline-block', marginRight: '5px' }} />
                    <Typography variant="body2" display="inline">Available Seats</Typography>
                </Grid>
                <Grid item>
                    <Box sx={{ width: 20, height: 20, backgroundColor: '#ffc107', display: 'inline-block', marginRight: '5px' }} />
                    <Typography sx={{ height: 20 }} variant="body2" display="inline">Employee Seats</Typography>
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
            {!isSeatsChanging && employees.length > 0 &&
                <Button variant="contained" color="primary" onClick={onClickingChangeSeats}>Change Seats for {selectedEmployee.name}</Button>}
            {isSeatsChanging && <Paper elevation={0} style={{ padding: '20px', marginTop: '20px' }}>
                <TextField
                    label="Selected Seats"
                    fullWidth
                    value={JSON.stringify(seatData).slice(1, -1).replace(/,/g, ',   ').replace(/"/g, '')}
                    style={{ marginBottom: '25px' }}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Button variant="contained" color="primary" onClick={onClickingUpdateSeats}>Update Seats for {selectedEmployee.name}</Button>
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

            <Snackbar
                open={OpenWFHSnackbar}
                autoHideDuration={2000}
                onClose={handleWFHSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={snackbarStyle}
            >
                <Alert onClose={handleWFHSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Employee works From Home on {selectedDay}
                </Alert>
            </Snackbar>

        </div>
    );
};

export default Manager;

