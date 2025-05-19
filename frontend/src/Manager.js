//changed ranges in giving renderSeats function

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
    Button, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Paper, TextField, Box, Snackbar, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, InputAdornment, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete
} from '@mui/material';
import Seat from './ManagerSeats';
import { baseurl } from './utils';
import { AuthContext } from "./AuthProvider";
import { jwtDecode } from 'jwt-decode'
import CloseIcon from '@mui/icons-material/Close';


import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogContentText from '@mui/material/DialogContentText';

const Manager = () => {
    const days = [
        { id: 'Monday', value: 'Monday' },
        { id: 'Tuesday', value: 'Tuesday' },
        { id: 'Wednesday', value: 'Wednesday' },
        { id: 'Thursday', value: 'Thursday' },
        { id: 'Friday', value: 'Friday' }
    ];

    const [managerId, setManagerId] = useState('');
    const [managersList, setManagersList] = useState([]);
    const [manager, setManager] = useState({});  //to store and update HOE
    const [employees, setEmployees] = useState([]); //to store and update all managers under HOE
    const [selectedEmployee, setSelectedEmployee] = useState('');  //to store and update selected manager in drop-down
    const [selectedSeats, setSelectedSeats] = useState("WFH");   //to store seats while selecting
    const [isSeatsChanging, setIsSeatsChanging] = useState(false); //we cannot select seats when isSeatsChanging is false
    const [selectedDay, setSelectedDay] = useState(days[0].value);
    const [seatData, setSeatData] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false); // to show a small popup when we update table in database with content "Data Updated Successfully"
    const [OpenWFHSnackbar, setOpenWFHSnackbar] = useState(false);
    const [OpenTeamSnackbar, setOpenTeamSnackbar] = useState(false);


    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newSeats, setNewSeats] = useState({ "Monday": "WFH", "Tuesday": "WFH", "Wednesday": "WFH", "Thursday": "WFH", "Friday": "WFH" }); // New state variable for seats
    const [newFirstNameError, setNewFirstNameError] = useState('');
    const [newLastNameError, setNewLastNameError] = useState('');
    const [isAddingEmployee, setIsAddingEmployee] = useState(false); // Track if we are adding a new employee
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [isAddingNewTeam, setIsAddingNewTeam] = useState(false);
    const [newTeam, setNewTeam] = useState('');
    const [snackBarText, setSnackBarText] = useState('');
    const [open, setOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNewEmployee, setSelectedNewEmployee] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editTeam, setEditTeam] = useState(null);
    const [openEmployeeTeamDelete, setOpenEmployeeTeamDelete] = useState(false);
    const [defaultId, setDefaultId] = useState(null);

    const { token } = useContext(AuthContext);
    const decode = jwtDecode(token);



    const handleNewEmployeeBlur = (event) => {
        const { name, value } = event.target;
        if (name === "newFirstName") {
            if (value.trim() === "") {
                setNewFirstNameError("*Required");
            } else {
                setNewFirstNameError("");
            }
        } else if (name === "newLastName") {
            if (value.trim() === "") {
                setNewLastNameError("*Required");
            } else {
                setNewLastNameError("");
            }
        }
    };

    const onClickingAddEmployeeButton = async () => {
        if (newFirstName !== "" && newLastName !== "") {
            try {
                const response = await axios.post(`${baseurl}/addNewEmployee`, {
                    firstName: newFirstName,
                    lastName: newLastName,
                    managerId: manager.id,
                    seat_data: newSeats,
                    businessUnit: manager.business_unit,
                    defaultId
                });

                const newEmployee = response.data.result;
                const employeeList = [...employees, { ...newEmployee, name: `${newEmployee.first_name} ${newEmployee.last_name}`, seats_array: [...new Set(Object.values(newEmployee.seat_data))] }];
                const sortedEmployeeList = employeeList.sort((x, y) => x.first_name.localeCompare(y.first_name));
                setEmployees(sortedEmployeeList);

                // Clear the form
                setNewFirstName("");
                setNewLastName("");
                setNewSeats([]);
                setNewFirstNameError("");
                setNewLastNameError("");
                setIsAddingEmployee(false); // Reset adding state
                setIsSeatsChanging(false);
                setNewSeats({ "Monday": "WFH", "Tuesday": "WFH", "Wednesday": "WFH", "Thursday": "WFH", "Friday": "WFH" });
                setOpenWFHSnackbar(false);

                // Optionally, set the newly added employee as the selected employee
                setSelectedEmployee({ ...newEmployee, name: `${newEmployee.first_name} ${newEmployee.last_name}`, seats_array: [...new Set(Object.values(newEmployee.seat_data))] });
                setSeatData(newEmployee.seat_data);

            } catch (err) {
                console.error('Error adding employee:', err);
            }
        } else {
            if (newFirstName === "") setNewFirstNameError("*Required");
            if (newLastName === "") setNewLastNameError("*Required");
            if (newSeats.length === 0) alert("Please select at least one seat");
        }
    };

    const onClickingAddNewEmployeeButton = () => {
        setSelectedTeam(defaultId);
        setManager(managersList.find(item => item.team_id === defaultId));
        setIsAddingEmployee(true);
        setIsSeatsChanging(true);
        setNewFirstName(""); // Clear the input fields
        setNewLastName("");
        //setNewSeats([]);
        setNewFirstNameError(""); // Clear any previous error messages
        setNewLastNameError("");
        setSelectedSeats("WFH");
        setSeatData({ ...newSeats });
        setSelectedEmployee('');
        setOpenWFHSnackbar(false);

        if (selectedDay === "all") {
            setSelectedDay("Monday");
            setSelectedSeats(newSeats["Monday"]);
        }
        else {
            setSelectedSeats(newSeats[selectedDay]);
        }
    };

    /*-------- handleSnackbarClose function is to show & close popup after updating table --------*/
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };
    const handleWFHSnackbarClose = () => {
        setOpenWFHSnackbar(false);
    };
    const handleTeamSnackbarClose = () => {
        setOpenTeamSnackbar(false);
    };

    const snackbarStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
    };



    useEffect(() => {
        fetchManagerDetails(); // Call the async function
    }, []);

    const fetchManagerDetails = async () => {
        if (token) {

            try {
                // Use decoded details in the query body
                const response1 = await axios.get(`${baseurl}/getManagerIdFromTable`, {
                    params: { // Using params to send query parameters
                        bu: decode.bu,
                        firstName: decode.firstName,
                        lastName: decode.lastName
                    }
                });

                const response_data = response1;
                setManagerId(response1.data.map(item => item.id));
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }
    };


    useEffect(() => {
        if (managerId !== '') {
            getManagerDetails(managerId);
        }  //Line 133
    }, [managerId]);

    /*-------- getHOEDetails function get HOE and Managers details from database --------*/
    const getManagerDetails = async (id) => {
        try {
            const response1 = await axios.get(`${baseurl}/getManagerFromTable/${id}`);
            const response2 = await axios.get(`${baseurl}/getEmployeesByManagerIdFromTable/${id}`);
            
            let teamId;
            if (token) {

                try {
                    // Use decoded details in the query body
                    const response3 = await axios.get(`${baseurl}/getManagerTeamsFromTable`, {
                        params: { // Using params to send query parameters
                            bu: decode.bu,
                            firstName: decode.firstName,
                            lastName: decode.lastName
                        }
                    });

                    setTeams(response3.data);
                    teamId = response3.data.find(team => team.team === 'Default').id;
                    setSelectedTeam(response3.data.find(team => team.team === 'Default').id);
                    setDefaultId(teamId);
                } catch (err) {
                    console.error('Error fetching data:', err);
                }
            }
            const filteredManager = response1.data.find(manager => manager.team_id === teamId);
            setManagersList(response1.data);
            setManager(filteredManager);
            setEmployees(response2.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name, seats_array: [...new Set(Object.values(item.seat_data))] })));


            if (response2.data.length > 0) {
                const filteredEmployeeList = response2.data.filter(item => item.team_id === teamId);
                if (selectedEmployee === '') {
                    setSelectedEmployee({ ...filteredEmployeeList[0], name: filteredEmployeeList[0].first_name + " " + filteredEmployeeList[0].last_name, seats_array: [...new Set(Object.values(filteredEmployeeList[0].seat_data))] });
                    setSeatData(response2.data[0].seat_data);
                } else {
                    const employeeDetails = response2.data.filter(item => item.id === selectedEmployee.id);
                    if (employeeDetails.length === 0) {
                        setSelectedEmployee({ ...filteredEmployeeList[0], name: filteredEmployeeList[0].first_name + " " + filteredEmployeeList[0].last_name, seats_array: [...new Set(Object.values(filteredEmployeeList[0].seat_data))] });
                        setSeatData(filteredEmployeeList[0].seat_data);
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

    /*-------- handleEmployeeChange function is to change selectedManager --------*/
    const handleEmployeeChange = (event) => {
        if (event.target.value === 'addEmployee') return setIsSearching(true)
        else if (event.target.value === null) return;
        const filteredList = employees.filter(manager => manager.id === event.target.value);
        setSelectedEmployee(filteredList[0]);
        setSeatData(filteredList[0].seat_data);
        setIsSeatsChanging(false);
        setSelectedSeats("WFH");
        setIsAddingEmployee(false);
        setNewFirstName("");
        setNewLastName("");
        setNewFirstNameError("");
        setNewLastNameError("");
        if (selectedDay !== "all" && filteredList[0].seat_data[selectedDay] === 'WFH') setOpenWFHSnackbar(true);
    };

    const handleTeamChange = (event) => {
        setIsAddingNewTeam(event.target.value === 'addNewTeam' ? true : false);
        setSelectedTeam(event.target.value);
        if (event.target.value !== 'addNewTeam') {
            setManager(managersList.find(item => item.team_id === event.target.value));
        }
        const filteredList = employees.filter(manager => manager.team_id === event.target.value);

        setSelectedEmployee(filteredList.length > 0 ? filteredList[0] : '');
        setSeatData(filteredList.length > 0 ? filteredList[0].seat_data : {});
        setIsSeatsChanging(false);
        setIsSearching(false);
        setSearchTerm('');
        setSelectedSeats("WFH");
        setIsAddingEmployee(false);
        setNewFirstName("");
        setNewLastName("");
        setNewFirstNameError("");
        setNewLastNameError("");
        if (selectedDay !== "all" && filteredList.length > 0 && filteredList[0].seat_data[selectedDay] === 'WFH') setOpenWFHSnackbar(true);
    };

    const handleSubmitTeam = async () => {
        if (newTeam === '') {
            return;
        } else if (isAddingNewTeam) {
            try {

                const response = await axios.get(`${baseurl}/searchTeam`, {
                    params: {
                        team: newTeam,
                        firstName: manager.first_name,
                        lastName: manager.last_name,
                        bu: manager.business_unit
                    }
                });
                
                if (response.data !== '' && response.data.data.length > 0) {
                    setSnackBarText(response.data.msg);
                    setOpenTeamSnackbar(true);
                } else {
                    createTeam();
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        }

    }

    const createTeam = async () => {
        try {

            const response = await axios.post(`${baseurl}/addTeam`, {
                team: newTeam,
                firstName: manager.first_name,
                lastName: manager.last_name,
                bu: manager.business_unit,
                country: manager.country,
                state: manager.state,
                city: manager.city,
                campus: manager.campus,
                floor: manager.floor,
                hoeId: manager.hoe_id
            });
            
            if (response.data !== '' && response.data.data.length > 0) {
                setTeams(response.data.data);
                setSnackBarText(response.data.msg);
                setOpenTeamSnackbar(true);
                setSelectedTeam(response.data.data.filter(team => team.team === newTeam)[0].id);
                setNewTeam('');
                setIsAddingNewTeam(false);
                fetchManagerDetails();
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    /*-------- handleSeatClick function is to update selectedSeats upon selecting/deselecting a seat --------*/
    const handleSeatClick = (seat) => {
        if (!(selectedSeats === parseInt(seat))) {
            setSelectedSeats(seat);
            setSeatData({ ...seatData, [selectedDay]: seat })
            if (isAddingEmployee) {
                setNewSeats({ ...seatData, [selectedDay]: seat })
            }
        } else {
            setSelectedSeats("WFH");
            setSeatData({ ...seatData, [selectedDay]: "WFH" })
            if (isAddingEmployee) {
                setNewSeats({ ...seatData, [selectedDay]: "WFH" })
            }
        }
    };

    /*-------- onClickingUpdateSeats function is to update respective selectedManager seats in database --------*/
    const onClickingUpdateSeats = async () => {
        //selectedSeats.sort((a, b) => a - b);
        if (selectedEmployee) {
            try {
                const response = await axios.put(`${baseurl}/updateEmployeeSeatData/${selectedEmployee.id}`, {
                    seats: seatData
                });

                const updatedEmployee = response.data.result.rows[0];
                const employeeObject = { ...updatedEmployee, name: `${updatedEmployee.first_name} ${updatedEmployee.last_name}`, seats_array: [...new Set(Object.values(updatedEmployee.seat_data))] };
                const updateEmployeesList = employees.filter(item => item.id !== updatedEmployee.id);
                const employeeList = [...updateEmployeesList, employeeObject];
                const sortedEmployeeList = employeeList.sort((x, y) => x.first_name.localeCompare(y.first_name));
                setSelectedEmployee(employeeObject);
                setEmployees(sortedEmployeeList);
                setSelectedSeats("WFH");
                setIsSeatsChanging(false);
                setOpenSnackbar(true); // Show Snackbar
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Please select atleast one seat.");
        }
    };

    const onClickingCancel = () => {
        setIsSeatsChanging(false);
    }

    const onCancellingAddEmployee = () => {
        setIsSeatsChanging(false);
        setIsAddingEmployee(false);
        setSelectedEmployee(employees.filter(item => item.team_id === defaultId)[0]);
        setSeatData(employees.filter(item => item.team_id === defaultId)[0].seat_data);
        setNewFirstName(""); // Clear the input fields
        setNewLastName("");
        setNewFirstNameError(""); // Clear any previous error messages
        setNewLastNameError("");
        setNewSeats({ "Monday": "WFH", "Tuesday": "WFH", "Wednesday": "WFH", "Thursday": "WFH", "Friday": "WFH" });
        setSelectedDay(days[0].value);
        setOpenWFHSnackbar(false);
        
        // Optionally, set the newly added employee as the selected employee
        // setSelectedEmployee({ ...newEmployee, name: `${newEmployee.first_name} ${newEmployee.last_name}`, seats_array: [...new Set(Object.values(newEmployee.seat_data))] });
        // setSeatData(newEmployee.seat_data);
    }

    /*-------- renderSeats function is to get Seats from Seat component in Seat.js file --------*/
    const renderSeats = () => {
        let seats = [];

        /*ranges.forEach(range => {*/
        for (let i = 1; i <= manager.total; i++) {
            seats.push(
                <Seat
                    seatData={seatData}
                    day={selectedDay}
                    floor={manager.floor}
                    newSeats={newSeats}
                    isAddingEmployee={isAddingEmployee}
                    totalManagerSeats={manager.seats_data[selectedDay].length > 0 ? manager.seats_data[selectedDay] : []}
                    employeeDetails={selectedEmployee}
                    employeesList={employees.filter(employee => employee.team_id === selectedTeam)}
                    isSeatsChanging={isSeatsChanging}
                    key={i}
                    number={i}
                    isSelected={selectedSeats === i}
                    onClick={() => handleSeatClick(i)}
                    selectedDay={selectedDay}
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
            const arrayHavingAllSeatsValues = employees.filter(item => item.team_id === selectedTeam).map(employee => [...new Set(Object.values(employee.seat_data))]).flat();
            const arrayAfterRemovingWFH = arrayHavingAllSeatsValues.filter(item => typeof (item) == 'number');
            const uniqueArray = [...new Set(arrayAfterRemovingWFH)];
            return uniqueArray.length;
        }

        return employees.filter(employee => employee.team_id === selectedTeam && typeof (employee.seat_data[selectedDay]) === 'number').length;
    }

    // Open edit dialog
    const handleEdit = (team) => {
        setEditTeam(team);
        setOpenEditDialog(true);
    };

    // Save changes
    const handleSaveEdit = async () => {
        try {

            const response = await axios.get(`${baseurl}/searchTeam`, {
                params: {
                    team: newTeam,
                    firstName: manager.first_name,
                    lastName: manager.last_name,
                    bu: manager.business_unit
                }
            });
            if (response.data !== '' && response.data.data.length > 0) {
                setSnackBarText(response.data.msg);
                setOpenTeamSnackbar(true);
            } else {
                editTeamName();
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const editTeamName = async () => {
        try {

            const response = await axios.put(`${baseurl}/editTeam`, {
                id: editTeam.id,
                name: editTeam.team,
                firstName: manager.first_name,
                lastName: manager.last_name,
                bu: manager.business_unit
            });
            if (response.data !== '' && response.data.data.length > 0) {
                setOpenEditDialog(false);
                setTeams(response.data.data);
                setSnackBarText(response.data.msg);
                setOpenTeamSnackbar(true);
                setSelectedTeam(response.data.data.filter(team => team.team === editTeam.team)[0].id);
                setEditTeam(null);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const handleDeleteTeam = async (teamId) => {
        // Filter out the team with the matching ID
        //const updatedTeams = teams.filter(team => team.id !== teamId);

        try {
            const response = await axios.delete(`${baseurl}/deleteTeam`,
                {
                    params: {
                        id: teamId,
                        defaultId,
                        managerId: managersList.find(item => item.team_id === defaultId).id
                    }
                }
            )
            setSnackBarText(response.data.msg);
            setOpenTeamSnackbar(true);
            getManagerDetails(managerId);
        } catch (err) {
            console.error(err);
        }

        // Update state
        setSelectedTeam(teams.find(team => team.team = 'Default').id);
        setOpen(false);
    };

    const handleAddEmployeeToTeam = async () => {
        if (selectedNewEmployee.team_id !== defaultId) {
            setSnackBarText(['error', 'Employee Already allocated to Other team']);
            setOpenTeamSnackbar(true);
        }
        else {
            try {
                const response = await axios.put(`${baseurl}/assignEmployeeToTeam`, {
                    id: selectedNewEmployee.id,
                    teamId: selectedTeam,
                    mngId: manager.id,
                    managerIds: managerId
                });
                if (response.data !== '' && response.data.data.length > 0) {
                    setIsSearching(false);
                    setSnackBarText(response.data.msg);
                    setOpenTeamSnackbar(true);
                    const employeesList = response.data.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name, seats_array: [...new Set(Object.values(item.seat_data))] }))
                    setEmployees(employeesList);
                    setSelectedEmployee(employeesList.filter(employee => employee.name === selectedNewEmployee.name)[0]);
                    setSeatData(employeesList.filter(employee => employee.name === selectedNewEmployee.name)[0].seat_data);
                }
            } catch (err) {
                console.error('Error fetching data', err);
            }
        }
    }

    const handleClose = () => {
        setOpen(false);
        setOpenEmployeeTeamDelete(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickDeleteEmployeeFromTeam = () => {
        setOpenEmployeeTeamDelete(true);
        setIsSeatsChanging(false);
    };

    const handleDeleteEmployeeFromTeam = async (employee) => {
        
        try {
            const response = await axios.put(`${baseurl}/deleteEmployeeFromTeam`,
                {
                    id: employee.id,
                    managerId: managersList.find(item => item.team_id === defaultId).id,
                    defaultId,
                    managerIds: managerId
                }
            )
            if (response.data !== '' && response.data.data.length > 0) {
                setEmployees(response.data.data.map(item => ({ ...item, name: item.first_name + " " + item.last_name, seats_array: [...new Set(Object.values(item.seat_data))] })));
                setSelectedEmployee('');
                setSeatData({});
                setOpenEmployeeTeamDelete(false);
                setSnackBarText(response.data.msg);
                setOpenTeamSnackbar(true);
            }
        } catch (err) {
            console.error(err);
        }
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
                            <TableCell>{manager.seats_data[selectedDay].length > 0 ? manager.seats_data[selectedDay].length : 0}</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableBody>
                        <TableRow>
                            <TableCell>Seats Assigned To Employees on {`${selectedDay}`}</TableCell>
                            <TableCell>{employeesAllocatedOnSelectedDay()}</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableBody>
                        <TableRow>
                            <TableCell>Seats Available  {selectedDay === "all" ? `For The Week` : `on ${selectedDay}`}</TableCell>
                            <TableCell>{manager.seats_data[selectedDay].length - employeesAllocatedOnSelectedDay()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>}

            <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap" gap={2} mb={2}>
                <Box sx={{ width: 300, marginBottom: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="team-select-label">Select Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            id="team-select"
                            value={selectedTeam}
                            label="Select Team"
                            onChange={handleTeamChange}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 250, // Limits dropdown height
                                        overflowY: "auto", // Enables scrolling
                                    },
                                },
                            }}
                            renderValue={(selected) => {
                                if (selected === "addNewTeam") return "Add New Team";
                                //if (selected === "All" || !teams.some(team => team.id === selected)) return "All";
                                // Find selected team name and display ONLY the name
                                const selectedTeamObj = teams.find(team => team.id === selected);
                                return selectedTeamObj.team !== 'Default' ? selectedTeamObj.team : "Default";
                            }}
                            disabled={isSeatsChanging}
                        >
                            <MenuItem key={"addNewTeam"} value={"addNewTeam"} sx={{ color: "#817EF2", fontStyle: "italic" }}>
                                Add New Team
                            </MenuItem>
                            {teams.map((team) => (
                                <MenuItem key={team.id} value={team.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    {team.team.length > 20 ? team.team.substring(0, 20) + "..." : team.team}
                                    {team.team !== "Default" &&
                                        <Box>
                                            <IconButton onClick={() => handleEdit(team)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleClickOpen(team.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Edit Team Dialog */}
                    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                        <DialogTitle>Edit Team Name</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Team Name"
                                value={editTeam?.team || ""}
                                onChange={(e) => setEditTeam({ ...editTeam, team: e.target.value })}
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveEdit}>Save</Button>
                        </DialogActions>
                    </Dialog>

                    {teams.length > 0 && <Dialog open={open}>
                        <DialogTitle style={{ color: 'red' }}>Caution!</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Do you want to delete {selectedTeam !== '' && selectedTeam !== 'addNewTeam' && teams.find(item => item.id === selectedTeam).team} team?"
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary" >
                                Cancel
                            </Button>
                            <Button onClick={() => handleDeleteTeam(selectedTeam)} color="warning">
                                Proceed
                            </Button>
                        </DialogActions>
                    </Dialog>}

                </Box>
                {!isAddingNewTeam && !isSearching && <FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
                    <InputLabel id="manager-select-label">Select Employee</InputLabel>
                    <Select
                        labelId="manager-select-label"
                        id="manager-select"
                        value={selectedEmployee ? selectedEmployee.id : ""}
                        label="Select Employee"
                        onChange={handleEmployeeChange}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 250, // Limits dropdown height
                                    overflowY: "auto", // Enables scrolling
                                },
                            },
                        }}
                        renderValue={(selected) => {
                            // Find selected team name and display ONLY the name
                            const selectedTeamObj = employees.find(employee => employee.id === selected);
                            return selectedTeamObj ? selectedTeamObj.name : "";
                        }}
                        disabled={isSeatsChanging}
                    // disabled={selectedTeam === 'All' ? employees.length === 0 : employees.filter(employee => employee.team_id === selectedTeam).length === 0}
                    >
                        {selectedTeam !== defaultId && <MenuItem key='addEmployee' value='addEmployee' sx={{ color: "#817EF2", fontStyle: "italic" }}>Add Employee to Team</MenuItem>}
                        {employees.map((manager) => {
                            if (manager.team_id === selectedTeam) return <MenuItem key={manager.id} value={manager.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                {manager.name}
                                {selectedTeam !== defaultId && <Box>
                                    <IconButton onClick={() => handleClickDeleteEmployeeFromTeam(manager.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>}
                            </MenuItem>
                        })}
                    </Select>
                </FormControl>}

                {teams.length > 0 && employees.length > 0 && selectedEmployee !== '' && selectedTeam !== '' && <Dialog open={openEmployeeTeamDelete}>
                    <DialogTitle style={{ color: 'red' }}>Caution!</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you want to delete {employees.find(item => item.id === selectedEmployee.id).name} from {teams.find(item => item.id === selectedTeam).team}?"
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" >
                            Cancel
                        </Button>
                        <Button onClick={() => handleDeleteEmployeeFromTeam(selectedEmployee)} color="warning">
                            Proceed
                        </Button>
                    </DialogActions>
                </Dialog>}

                {isSearching && !isAddingNewTeam && <><FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
                    <Autocomplete
                        options={employees.filter(employee => employee.name.toLowerCase().includes(searchTerm.toLowerCase()))}
                        getOptionLabel={(option) => option.name}
                        inputValue={searchTerm}
                        onInputChange={(event, newInputValue) => {
                            setSearchTerm(newInputValue);
                            setSelectedNewEmployee('');
                        }}
                        onChange={(event, selectEmployee) => {
                            if (selectEmployee) {
                                setSelectedNewEmployee('');
                                setTimeout(() => setSelectedNewEmployee(selectEmployee), 0);
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Search Employee" variant="outlined" />}
                        fullWidth
                    />
                </FormControl>
                    <FormControl fullWidth style={{ marginBottom: '20px', width: '150px' }}>
                        <Grid container style={{ height: '100%' }} alignItems={'center'}>
                            <Button
                                color="primary"
                                variant='contained'
                                onClick={handleAddEmployeeToTeam}
                                fullWidth
                                style={{ height: '80%' }}
                                disabled={selectedNewEmployee === ''}
                            >
                                Add To Team
                            </Button>
                        </Grid>
                    </FormControl>
                </>
                }

                {isAddingNewTeam &&
                    <>
                        <FormControl fullWidth style={{ marginBottom: '20px', width: '300px' }}>
                            <TextField
                                required
                                label='New Team'
                                value={newTeam}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    const capitalized = input
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ');
                                    setNewTeam(capitalized)
                                }}
                                onBlur={() => {
                                    setNewTeam(newTeam.trim());
                                }}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Cancel" arrow>
                                                <IconButton
                                                    aria-label="cancel"
                                                    onClick={() => {
                                                        setIsAddingNewTeam(false); // Go back to Select dropdown
                                                        const teamId = teams.find(item => item.team === 'Default').id
                                                        setSelectedTeam(teamId);
                                                        setManager(managersList.find(item => item.team_id === teamId));
                                                        setSelectedEmployee(employees.filter(item => item.team_id === teamId)[0]);
                                                        setSeatData(employees.filter(item => item.team_id === teamId)[0].seat_data);
                                                        setNewTeam('');
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        <FormControl fullWidth style={{ marginBottom: '20px', width: '150px' }}>
                            <Grid container style={{ height: '100%' }} alignItems={'center'}>
                                <Button
                                    color="primary"
                                    variant='contained'
                                    onClick={handleSubmitTeam}
                                    fullWidth
                                    style={{ height: '80%' }}
                                >
                                    Add Team
                                </Button>
                            </Grid>
                        </FormControl>
                    </>
                }
            </Box>

            <Box display="flex" flexDirection="row" justifyContent='center' flexWrap='wrap' alignItems="center" gap={2} mb={2}>
                {days.map((day) => (
                    <Button key={day.id} variant="contained" disabled={isAddingNewTeam ? true : false} onClick={() => handleClickDay(day.value)} sx={{ backgroundColor: selectedDay === day.value ? "primary" : "grey" }}>
                        {day.id}
                    </Button>
                ))}
            </Box>

            <Typography variant="h5" >Seats Layout</Typography><br></br>

            <Box display="flex" flexDirection="row" justifyContent='center' flexWrap='wrap' alignItems='center' rowGap={2} columnGap={1.5}>
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
            {!isSeatsChanging && employees.length > 0 && !isAddingEmployee && selectedEmployee !== '' &&
                <Button variant="contained" color="primary" sx={{ marginBottom: 5 }} onClick={onClickingChangeSeats}>Change Seats for {selectedEmployee.name}</Button>}
            {isSeatsChanging && !isAddingEmployee && <Paper elevation={0} style={{ padding: '20px', marginTop: '20px' }}>
                <TextField
                    label="Selected Seats"
                    fullWidth
                    value={JSON.stringify(seatData).slice(1, -1).replace(/,/g, ',   ').replace(/"/g, '')}
                    style={{ marginBottom: '25px' }}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' gap={2}>
                    <Button variant="contained" color="primary" onClick={onClickingUpdateSeats}>Update Seats for {selectedEmployee.name}</Button>
                    <Button variant="contained" color="primary" onClick={onClickingCancel}>Cancel</Button>
                </Box>
            </Paper>}





            {/* Button to open form for adding a new employee */}
            {!isSeatsChanging && employees.length >= 0 && !isAddingEmployee && !isAddingNewTeam &&
                <Button variant="contained" color="primary" onClick={onClickingAddNewEmployeeButton}>Add New Employee</Button>}

            {/* Form for adding a new employee */}
            {isAddingEmployee &&
                <Paper elevation={0} style={{ padding: '20px', marginTop: '20px' }}>
                    <TextField
                        label="First Name"
                        name="newFirstName"
                        fullWidth
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        style={{ marginBottom: '15px' }}
                        autoFocus
                        onBlur={handleNewEmployeeBlur}
                        error={!!newFirstNameError}
                        helperText={newFirstNameError}
                        color="success"
                    />
                    <TextField
                        label="Last Name"
                        name="newLastName"
                        fullWidth
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        style={{ marginBottom: '25px' }}
                        autoFocus
                        onBlur={handleNewEmployeeBlur}
                        error={!!newLastNameError}
                        helperText={newLastNameError}
                        color="success"
                    />
                    <TextField
                        label="Selected Seat for Each Day"
                        name='selectedSeats'
                        fullWidth
                        value={JSON.stringify(newSeats).slice(1, -1).replace(/,/g, ',   ').replace(/"/g, '')}
                        //onChange={(e) => setNewSeats(e.target.value.split(',').map(seat => seat.trim()))}
                        style={{ marginBottom: '25px' }}
                        InputProps={{
                            readOnly: true,
                        }}
                        autoFocus
                    />
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems='center' gap={2}>
                        <Button variant="contained" color="primary" onClick={onClickingAddEmployeeButton}>
                            Add Employee
                        </Button>
                        <Button variant="contained" color="primary" onClick={onCancellingAddEmployee}>Cancel</Button>
                    </Box>
                </Paper>
            }

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

            {!isAddingEmployee && <Snackbar
                open={OpenWFHSnackbar}
                autoHideDuration={2000}
                onClose={handleWFHSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={snackbarStyle}
            >
                <Alert onClose={handleWFHSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    Employee works From Home on {selectedDay}
                </Alert>
            </Snackbar>}

            <Snackbar
                open={OpenTeamSnackbar}
                autoHideDuration={5000}
                onClose={handleTeamSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={snackbarStyle}
            >
                <Alert onClose={handleTeamSnackbarClose} severity={snackBarText[0]} sx={{ width: '100%' }}>
                    {snackBarText[1]}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Manager;

