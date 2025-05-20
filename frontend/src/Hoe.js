import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  TextField,
  Box,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Seat from "./Seat";
import { baseurl } from "./utils";
import { AuthContext } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";

const days = [
  { id: "Monday", value: "Monday" },
  { id: "Tuesday", value: "Tuesday" },
  { id: "Wednesday", value: "Wednesday" },
  { id: "Thursday", value: "Thursday" },
  { id: "Friday", value: "Friday" },
];

const Hoe = () => {
  const [seatData, setSeatData] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  });
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [HoeList, setHoeList] = useState([]);
  const [HOE, setHoe] = useState({}); // to store and update HOE
  const [locations, setLocations] = useState([]);
  const [managers, setManagers] = useState([]); // to store and update all managers under HOE
  const [selectedManager, setSelectedManager] = useState(""); // to store and update selected manager in drop-down
  const [selectedSeats, setSelectedSeats] = useState([]); // to store seats while selecting
  const [isSeatsChanging, setIsSeatsChanging] = useState(false); // we cannot select seats when isSeatsChanging is false
  const [isAddingManager, setIsAddingManager] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [seatCount, setSeatCount] = useState(0); // Added state for seat count
  const [selectedSeatCount, setSelectedSeatCount] = useState(0); // Added state for selected seat count
  // to show a small popup when we update table in database with content "Data Updated Successfully"
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [hoeId, setHoeId] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("default");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [isEditingManager, setIsEditingManager] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedTeams, setEditedTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");

  const { token } = useContext(AuthContext);
  // const decoded = jwtDecode(token);
  // const hoe_bu = decoded.bu === "cloud" ? 1 :
  //   decoded.bu === "service" ? 2 :
  //     decoded.bu === "sales" ? 3 :
  //       decoded.bu === "Group Infrastructure Services" ? 4 : 5;

  /*-------- these constants are used to show respected values in the dropdowns --------*/
  const countries = [...new Set(locations.map((location) => location.country))];
  const states = [
    ...new Set(
      locations
        .filter((location) => location.country === selectedCountry)
        .map((location) => location.state)
    ),
  ];
  const cities = [
    ...new Set(
      locations
        .filter((location) => location.state === selectedState)
        .map((location) => location.city)
    ),
  ];
  const campuses = [
    ...new Set(
      locations
        .filter((location) => location.city === selectedCity)
        .map((location) => location.campus)
    ),
  ];
  const floors = [
    ...new Set(
      locations
        .filter((location) => location.campus === selectedCampus)
        .map((location) => location.floor)
    ),
  ];

  /*-------- handleSnackbarClose function is to show & close popup after updating table --------*/
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchHoeDetails = async () => {
      if (token) {
        const decoded = jwtDecode(token);
        try {
          // Use decoded details in the query body
          const response1 = await axios.get(`${baseurl}/getHoeIdFromTable`, {
            params: {
              // Using params to send query parameters
              bu: decoded.bu,
            },
          });

          const response_data = response1;
          setHoeId(response_data.data[0].id);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };

    fetchHoeDetails(); // Call the async function
  }, []);

  useEffect(() => {
    hoeId !== "" && getHOEDetails(hoeId); // Also change id in line 110 && 141
  }, [hoeId]);

  /*-------- getHOEDetails function get HOE and Managers details from database --------*/
  const getHOEDetails = async (id) => {
    try {
      const response1 = await axios.get(`${baseurl}/getHOEFromTable/${id}`);

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
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getManagerDetails = useCallback(
    async (id) => {
      try {
        const response2 = await axios.get(
          `${baseurl}/getManagersByHOEIdFromTable/${id}`,
          {
            params: {
              campus: selectedCampus,
              floor: selectedFloor,
              country: selectedCountry,
              state: selectedState,
              city: selectedCity,
            },
          }
        );
        const response3 = await axios.get(`${baseurl}/getTeams`, {
          params: { bu: HOE.name },
        });

        await setTeams(response3.data.data);

        // const groupedData = response2.data.length > 0 ? response2.data.reduce((acc, item) => {
        //   const key = `${item.first_name}+ " " + ${item.last_name}`; // Unique key for grouping

        //   if (!acc[key]) {
        //     acc[key] = {
        //       first_name: item.first_name,
        //       last_name: item.last_name,
        //       teams: [{ team: item.team_id, seats_data: item.seats_data, id:item.id }]
        //     };
        //   } else {
        //     acc[key].teams.push({ team: item.team, number: item.number });
        //   }

        //   return acc;
        // }, {}) : {};

        const groupedData =
          (await response2.data.length) > 0
            ? Object.values(
                response2.data.reduce((acc, item) => {
                  const key = `${item.first_name}-${item.last_name}`; // Unique key for grouping

                  if (!acc[key]) {
                    acc[key] = { ...item, teams: [], id: "" };
                    delete acc[key].seats_data;
                    delete acc[key].team_id;
                  }
                  acc[key].teams.push({
                    teamId: item.team_id,
                    seats_data: item.seats_data,
                    seats_array: item.seats_data,
                    id: item.id,
                  });
                  acc[key].id = JSON.stringify(
                    acc[key].teams.map((team) => ({
                      id: team.id,
                      teamId: team.teamId,
                    }))
                  );
                  return acc;
                }, {})
              )
            : [];

        await setManagers(
          groupedData.map((item) => ({
            ...item,
            name: item.first_name + " " + item.last_name,
          }))
        );
        if (response2.data.length > 0) {
          if (
            selectedManager !== "" &&
            selectedTeam !== "" &&
            selectedTeam !== "default"
          ) {
            const result = groupedData.filter(
              (item) => item.id === selectedManager.id
            );
            setSelectedManager({
              ...result[0],
              name: result[0].first_name + " " + result[0].last_name,
            });
          } else if (selectedManager === "" && !isAddingManager) {
            await setSelectedManager({
              ...groupedData[0],
              name: groupedData[0].first_name + " " + groupedData[0].last_name,
            });
          } else {
            const managerDetails =
              firstName !== "" && lastName !== ""
                ? groupedData.filter(
                    (item) =>
                      item.first_name === firstName &&
                      item.last_name === lastName
                  )
                : groupedData.filter(
                    (item) =>
                      JSON.stringify(item.teams) ===
                      JSON.stringify(selectedManager.teams)
                  );
            setFirstName("");
            setLastName("");
            if (managerDetails.length === 0) {
              await setSelectedManager({
                ...groupedData[0],
                name:
                  groupedData[0].first_name + " " + groupedData[0].last_name,
              });
            } else {
              await setSelectedManager({
                ...managerDetails[0],
                name:
                  managerDetails[0].first_name +
                  " " +
                  managerDetails[0].last_name,
              });
            }
          }
        } else {
          await setManagers([]);
          await setSelectedManager("");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    },
    [selectedFloor, selectedCampus, selectedManager]
  );

  useEffect(() => {
    if (selectedTeam === "default" || selectedTeam === "") {
      const filteredList = managers.filter(
        (item) =>
          item.first_name + " " + item.last_name === selectedManager.name
      );

      if (isSeatsChanging) return;
      else if (filteredList.length > 0)
        setSelectedTeam(
          filteredList[0].teams.find(
            (item) =>
              teams.find((row) => row.id === item.teamId).team === "Default"
          ).teamId
        );
      else if (managers.length === 0) setSelectedTeam("");
      else setSelectedTeam("default");
    }
  }, [selectedManager]);

  useEffect(() => {
    if (selectedFloor !== "" && hoeId !== "") {
      getManagerDetails(hoeId); // Also change id in line 41 && 141. You have to change id at four places
    }
  }, [selectedFloor]);

  /*-------- handleManagerChange function is to change selectedManager --------*/
  const handleManagerChange = (event) => {
    const filteredList = managers.filter(
      (manager) => manager.id === event.target.value
    );
    setSelectedManager(filteredList[0]);
    setSelectedTeam(
      filteredList[0].teams.find(
        (item) => teams.find((row) => row.id === item.teamId).team === "Default"
      ).teamId
    );
    setIsSeatsChanging(false);
    setSelectedSeats([]);
    setIsAddingManager(false);
    setFirstName("");
    setLastName("");
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
    setIsSeatsChanging(false);
    setSelectedSeats([]);

    setIsAddingManager(false);
    setFirstName("");
    setLastName("");
  };

  const onClickingDay = (day) => {
    if (isSeatsChanging && !isAddingManager) {
      setSelectedManager({
        ...selectedManager,
        teams: selectedManager.teams.map((item) =>
          item.teamId === selectedTeam
            ? {
                ...item,
                seats_array: {
                  ...item.seats_array,
                  [selectedDay]: selectedSeats,
                },
                seats_data: {
                  ...item.seats_data,
                  [selectedDay]: selectedSeats,
                },
              }
            : item
        ),
      });
      setSelectedSeats(
        selectedManager.teams.find((item) => item.teamId === selectedTeam)
          .seats_array[day] || []
      );
    } else if (isAddingManager) {
      setSeatData({ ...seatData, [selectedDay]: selectedSeats });
      setSelectedSeats(seatData[day] || []); // Ensure the selected seats for the new day are displayed
      seatData[day].length > 0
        ? setSeatCount(seatData[day].length)
        : setSeatCount(0);
      seatData[day].length > 0
        ? setSelectedSeatCount(seatData[day].length)
        : setSelectedSeatCount(0);
    }
    setSelectedDay(day);
  };

  /*-------- handleSeatClick function is to update selectedSeats upon selecting/deselecting a seat --------*/
  const handleSeatClick = (seat) => {
    const updatedSeatData = { ...seatData };

    if (isAddingManager) {
      if (seatCount <= 0) {
        alert("Please provide a seat count before selecting seats.");
        return;
      }

      if (selectedSeats.includes(seat)) {
        updatedSeatData[selectedDay] = updatedSeatData[selectedDay].filter(
          (s) => s !== seat
        );
        setSelectedSeatCount(selectedSeatCount - 1);
      } else {
        if (selectedSeatCount >= seatCount) {
          alert(
            `You have already selected the required number of seats: ${seatCount}`
          );
          return;
        }
        let count = seatCount - selectedSeatCount;
        let newSelectedSeats = [];

        for (let i = seat; i < seat + count; i++) {
          if (
            !HOE.seats.includes(i) ||
            updatedSeatData[selectedDay].includes(i) ||
            managers.some((manager) =>
              manager.teams.some((item) =>
                item.seats_array[selectedDay].includes(i)
              )
            )
          )
            break;
          newSelectedSeats.push(i);
        }

        updatedSeatData[selectedDay] = [
          ...updatedSeatData[selectedDay],
          ...newSelectedSeats,
        ];
        setSelectedSeatCount(selectedSeatCount + newSelectedSeats.length);
      }
      setSeatData(updatedSeatData);
      setSelectedSeats(updatedSeatData[selectedDay]); // Ensure the selected seats for the current day are displayed
    } else {
      if (!selectedSeats.includes(seat)) {
        setSelectedSeats([...selectedSeats, seat]);
        // updatedSeatData[selectedDay] = [...updatedSeatData[selectedDay], seat];
        // setSelectedSeatCount(selectedSeatCount + 1);
      } else {
        setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        // updatedSeatData[selectedDay] = updatedSeatData[selectedDay].filter(s => s !== seat);
        // setSelectedSeatCount(selectedSeatCount - 1);
      }
    }

    // setSeatData(updatedSeatData);
    // setSelectedSeats(updatedSeatData[selectedDay]); // Ensure the selected seats for the current day are displayed
  };

  /*-------- onClickingUpdateSeats function is to update respective selectedManager seats in database --------*/
  const onClickingUpdateSeats = async () => {
    const team = selectedTeam;
    selectedSeats.sort((a, b) => a - b);
    if (selectedManager) {
      try {
        const response = await axios.put(
          `${baseurl}/updateManagerData/${
            selectedManager.teams.find((item) => item.teamId === selectedTeam)
              .id
          }`,
          {
            seats: {
              ...selectedManager.teams.find(
                (item) => item.teamId === selectedTeam
              ).seats_array,
              [selectedDay]: selectedSeats,
            },
          }
        );
        const updatedManager = {
          ...selectedManager,
          teams: selectedManager.teams.map((item) =>
            item.teamId === selectedTeam
              ? {
                  ...item,
                  seats_array: response.data.result.rows[0].seats_data,
                  seats_data: response.data.result.rows[0].seats_data,
                }
              : item
          ),
        };
        const updatedManagersList = managers.map((item) =>
          item.id === selectedManager.id ? updatedManager : item
        );
        setSelectedSeats([]);
        setIsSeatsChanging(false);
        setManagers(updatedManagersList);
        setSelectedManager(updatedManager);
        //getManagerDetails(hoeId); // Refresh data  // Also change id in line 41 && 110
        setOpenSnackbar(true); // Show Snackbar
        setSelectedTeam(team);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Please select at least one seat.");
    }
  };

  const onClickingCancel = () => {
    setIsSeatsChanging(false);
    setSelectedSeats([]);
    setSelectedManager(
      managers.find(
        (item) =>
          item.name === selectedManager.name &&
          item.business_unit == selectedManager.business_unit
      )
    );
  };

  /*-------- renderSeats function is to get Seats from Seat component in Seat.js file --------*/
  const renderSeats = () => {
    let seats = [];
    // const managerDetails = {...selectedManager, id: teams.find(item =>  item.teamId === selectedTeam).id, seats_array: teams.find(item =>  item.teamId === selectedTeam).id}
    for (let i = 1; i <= HOE.total; i++) {
      seats.push(
        <Seat
          floor={HOE.floor}
          isAddingManager={isAddingManager}
          totalHoeSeats={HOE.seats}
          managerDetails={selectedManager}
          managersList={managers}
          isSeatsChanging={isSeatsChanging}
          key={i}
          number={i}
          isSelected={selectedSeats.includes(i)}
          onClick={() => handleSeatClick(i)}
          selectedDay={selectedDay}
          selectedSeats={selectedSeats}
          seatData={seatData}
          selectedTeam={selectedTeam}
        />
      );
    }
    return seats;
  };

  /*-------- onClickingChangeSeats function enables all selectedManager and available seats and we will be able to select those seats --------*/
  const onClickingChangeSeats = () => {
    setIsSeatsChanging(true);
    setSelectedSeats([
      ...selectedSeats,
      ...selectedManager.teams.find((team) => team.teamId === selectedTeam)
        .seats_array[selectedDay],
    ]);
  };

  const onClickingAddNewManager = () => {
    setIsAddingManager(true);
    setSelectedSeats([]);
    setIsSeatsChanging(true);
    setSelectedManager("");
    setFirstName("");
    setLastName("");
    setFirstNameError("");
    setLastNameError("");
    setSeatCount(0);
    setSelectedSeatCount(0);
  };

  const onClickingCancelAddManager = () => {
    setIsAddingManager(false);
    setSelectedSeats([]);
    setIsSeatsChanging(false);
    setSelectedManager(managers[0]);
    setSelectedTeam(
      managers[0].teams.find(
        (item) => teams.find((row) => row.id === item.teamId).team === "Default"
      ).teamId
    );
    setFirstName("");
    setLastName("");
    setFirstNameError("");
    setLastNameError("");
    setSeatCount(0);
    setSelectedSeatCount(0);
  };

  const onClickingAddManager = async () => {
    if (firstName !== "" && lastName !== "") {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat");
      } else {
        try {
          const response = await axios.post(`${baseurl}/addNewManager`, {
            firstName: firstName,
            lastName: lastName,
            businessUnit: HOE.name,
            country: HOE.country,
            state: HOE.state,
            city: HOE.city,
            campus: HOE.campus,
            floor: HOE.floor,
            seats_array: seatData,
            hoe_id: HOE.id,
            team: "Default",
          });
          const newManager = response.data.result;
          setIsSeatsChanging(false);
          setIsAddingManager(false);
          setSelectedSeats([]);
          setSeatData({
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
          });
          await getManagerDetails(hoeId);
          //setSelectedManager({ ...newManager, name: `${newManager.first_name} ${newManager.last_name}`, seats_array: newManager.seats_data });
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  /*-------- countAllocatedSeats function is to get values to display in table at top --------*/
  const countAllocatedSeats = () => {
    const seats = managers.flatMap((manager) =>
      manager.teams.flatMap((team) => team.seats_array[selectedDay])
    );
    const filteredSeats =
      isSeatsChanging && !isAddingManager
        ? seats.filter(
            (item) =>
              !selectedManager.teams
                .flatMap((team) => team.seats_array[selectedDay])
                .includes(item)
          )
        : seats;
    return filteredSeats.length;
  };

  const countAllocatedTeamSeats = () => {
    const seats = managers
      .filter((manager) => manager.id === selectedManager.id)[0]
      .teams.filter((team) => team.teamId === selectedTeam)[0].seats_array[
      selectedDay
    ];
    return seats.length;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === "firstname") {
      if (event.target.value.trim() === "") {
        setFirstNameError("*Required");
      } else {
        setFirstNameError("");
      }
    } else if (name === "lastname") {
      if (event.target.value.trim() === "") {
        setLastNameError("*Required");
      } else {
        setLastNameError("");
      }
    }
  };

  const onClickingEditManager = () => {
    setIsEditingManager(true);
    setEditedFirstName(selectedManager.first_name || "");
    setEditedLastName(selectedManager.last_name || "");

    const managerTeams = teams.filter(
      (team) =>
        team.first_name === selectedManager.first_name &&
        team.last_name === selectedManager.last_name
    );
    setEditedTeams(managerTeams);
  };

  const removeManager = (managerId) => {
    const updatedManagers = managers.filter(
      (manager) => manager.id !== managerId
    );
    setManagers(updatedManagers);

    // Also remove teams associated with this manager (if needed)
    const updatedTeams = teams.filter(
      (team) =>
        team.first_name !== selectedManager.first_name ||
        team.last_name !== selectedManager.last_name
    );
    setTeams(updatedTeams);

    // Clear the selection
    setSelectedManager("");
    setSelectedTeam("default");

    // Optionally show a success message
    setOpenSnackbar(true);
  };

  const onClickingRemoveManager = () => {
    if (!selectedManager) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to remove manager ${selectedManager.name}?`
    );
    if (confirmDelete) {
      removeManager(selectedManager.id);
    }
  };

  const addNewTeam = (newTeamName) => {
    const newTeam = {
      id: Date.now().toString(), // simple unique ID (you can replace with your own logic)
      team: newTeamName,
      first_name: editedFirstName,
      last_name: editedLastName,
    };

    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  const onClickingSaveEditedManager = () => {
    // Update manager names
    const updatedManagers = managers.map((manager) => {
      if (manager.id === selectedManager.id) {
        return {
          ...manager,
          first_name: editedFirstName,
          last_name: editedLastName,
        };
      }
      return manager;
    });

    // Update teams belonging to the edited manager with new manager names
    const updatedTeams = teams.map((team) => {
      if (
        team.first_name === selectedManager.first_name &&
        team.last_name === selectedManager.last_name
      ) {
        return {
          ...team,
          first_name: editedFirstName,
          last_name: editedLastName,
        };
      }
      return team;
    });

    setManagers(updatedManagers);
    setTeams(updatedTeams);

    // Update selectedManager to reflect edits
    const updatedSelected = updatedManagers.find(
      (mgr) => mgr.id === selectedManager.id
    );
    setSelectedManager({ ...updatedSelected });

    // Check if selectedTeam still belongs to this manager after editing
    const teamsForManager = updatedTeams.filter(
      (team) =>
        team.first_name === editedFirstName && team.last_name === editedLastName
    );

    const isSelectedTeamValid = teamsForManager.some(
      (team) => team.id === selectedTeam
    );

    if (!isSelectedTeamValid) {
      // If current selectedTeam is no longer valid, reset it to default or empty
      setSelectedTeam("default"); // or setSelectedTeam("")
    }

    // Reset edit mode and form fields
    setIsEditingManager(false);
    setEditedFirstName("");
    setEditedLastName("");
  };

  return (
    <div
      style={{
        marginTop: 50,
        marginBottom: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
          mb={2}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="country-select-label">Country</InputLabel>
            <Select
              labelId="country-select-label"
              id="country-select"
              value={selectedCountry}
              label="Country"
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedState("");
                setSelectedCity("");
                setSelectedCampus("");
                setSelectedFloor("");
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
                setSelectedCity("");
                setSelectedCampus("");
                setSelectedFloor("");
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
                setSelectedCampus("");
                setSelectedFloor("");
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
                setSelectedFloor("");
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
                setHoe(
                  HoeList.filter(
                    (item) =>
                      item.campus === selectedCampus &&
                      item.floor === e.target.value
                  )[0]
                );
                setIsSeatsChanging(false);
                setSelectedSeats([]);
                setManagers([]);
                setSelectedManager("");
                setSelectedTeam("default");
                // getManagerDetails(hoeId);
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

      {HoeList.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ marginTop: "20px", marginBottom: "40px", width: "80%" }}
        >
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
                <TableCell>
                  Seats Assigned To Managers on {selectedDay}
                </TableCell>
                <TableCell>{String(countAllocatedSeats())}</TableCell>
              </TableRow>
              {teams.length > 0 &&
                selectedTeam !== "default" &&
                selectedTeam !== "" &&
                !isAddingManager && (
                  <TableRow>
                    <TableCell>
                      Seats Assigned To{" "}
                      {teams.filter((item) => item.id === selectedTeam)[0].team}{" "}
                      on {selectedDay}
                    </TableCell>
                    <TableCell>{String(countAllocatedTeamSeats())}</TableCell>
                  </TableRow>
                )}
              <TableRow>
                <TableCell>Seats Available on {selectedDay}</TableCell>
                <TableCell>
                  {String(HOE.seats.length - countAllocatedSeats())}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
        gap={2}
        mb={2}
      >
        <FormControl fullWidth style={{ marginBottom: "20px", width: "300px" }}>
          <InputLabel id="manager-select-label">Select Manager</InputLabel>
          <Select
            labelId="manager-select-label"
            id="manager-select"
            value={selectedManager ? selectedManager.id : ""}
            label="Select Manager"
            onChange={handleManagerChange}
            disabled={managers.length === 0 || isSeatsChanging}
          >
            {managers.map((manager) => (
              <MenuItem key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Your "Select Team" dropdown */}
        <FormControl fullWidth style={{ marginBottom: "20px", width: "300px" }}>
          <InputLabel id="team-select-label">Select Team</InputLabel>
          <Select
            labelId="team-select-label"
            id="team-select"
            value={selectedTeam ? selectedTeam : ""}
            label="Select Team"
            onChange={handleTeamChange}
            disabled={managers.length === 0 || isSeatsChanging}
          >
            {teams.filter(
              (item) =>
                item.first_name === selectedManager?.first_name &&
                item.last_name === selectedManager?.last_name
            ).length === 0 &&
              managers.length !== 0 && (
                <MenuItem key="default" value="default">
                  Default
                </MenuItem>
              )}

            {teams
              .filter(
                (item) =>
                  item.first_name === selectedManager?.first_name &&
                  item.last_name === selectedManager?.last_name
              )
              .map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.team}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Add New Team input and button here */}

        <Box
          display="flex"
          gap={2}
          justifyContent="center"
          flexWrap="wrap"
          mb={2}
        >
          {selectedManager && selectedTeam && selectedTeam !== "default" && (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClickingEditManager}
                disabled={isSeatsChanging}
              >
                Edit Manager
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={!selectedManager || isSeatsChanging}
                onClick={() => onClickingRemoveManager()}
              >
                Remove Manager
              </Button>
            </>
          )}
        </Box>
        {isEditingManager && (
          <Paper elevation={0} style={{ padding: "20px", marginTop: "20px" }}>
            <TextField
              label="Edit First Name"
              fullWidth
              value={editedFirstName}
              onChange={(e) => setEditedFirstName(e.target.value)}
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Edit Last Name"
              fullWidth
              value={editedLastName}
              onChange={(e) => setEditedLastName(e.target.value)}
              style={{ marginBottom: "25px" }}
            />

            <TextField
              label="Add New Team"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              style={{ marginBottom: "10px", width: "300px" }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (newTeamName.trim() !== "") {
                  addNewTeam(newTeamName.trim());
                  setNewTeamName(""); // clear input after adding
                }
              }}
            >
              Add Team
            </Button>

            {/* <Typography variant="h6" gutterBottom>
              Edit Teams
            </Typography>
            {editedTeams.map((team, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                mb={1}
              >
                <TextField
                  value={team.team}
                  onChange={(e) => {
                    const updatedTeams = [...editedTeams];
                    updatedTeams[index].team = e.target.value;
                    setEditedTeams(updatedTeams);
                  }}
                  fullWidth
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const updatedTeams = editedTeams.filter(
                      (_, i) => i !== index
                    );
                    setEditedTeams(updatedTeams);
                  }}
                >
                  Remove
                </Button>
              </Box>
            ))} */}

            {/* <Box display="flex" gap={2} mt={2}>
              <TextField
                label="New Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={() => {
                  if (newTeamName.trim()) {
                    setEditedTeams([
                      ...editedTeams,
                      {
                        id: `${Date.now()}`, // temporary ID
                        first_name: editedFirstName,
                        last_name: editedLastName,
                        team: newTeamName.trim(),
                      },
                    ]);
                    setNewTeamName("");
                  }
                }}
              >
                Add Team
              </Button>
            </Box> */}

            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={onClickingSaveEditedManager}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setIsEditingManager(false)}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        flexWrap="wrap"
        alignItems="center"
        gap={2}
        mb={2}
      >
        {days.map((day) => (
          <Button
            key={day.id}
            variant="contained"
            onClick={() => onClickingDay(day.value)}
            sx={{
              backgroundColor: selectedDay === day.value ? "primary" : "grey",
            }}
          >
            {day.id}
          </Button>
        ))}
      </Box>

      {/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */}
      <Typography variant="h6">Seats Layout</Typography>

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

      <Grid
        container
        spacing={2}
        style={{
          margin: "20px 20px",
          width: "90%",
          display: "flex",
          justifyContent: "center",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <>
          {/*console.log(HoeList.length,"||", selectedManager, "||", selectedTeam)*/}
          {/*console.log(HoeList.length > 0,"||", isAddingManager, selectedManager !== '', "||", selectedTeam !== '', selectedTeam === 'default')*/}
          {HoeList.length > 0 && renderSeats()}
        </>
      </Grid>

      <Grid container spacing={5} justifyContent="center" marginBottom={5}>
        <Grid item>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#28a745",
              display: "inline-block",
              marginRight: "5px",
            }}
          />
          <Typography variant="body2" display="inline">
            Available Seats
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#ffc107",
              display: "inline-block",
              marginRight: "5px",
            }}
          />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">
            Manager Seats
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: "#007bff",
              display: "inline-block",
              marginRight: "5px",
            }}
          />
          <Typography sx={{ height: 20 }} variant="body2" display="inline">
            Selected Seats
          </Typography>
        </Grid>
        <Grid item>
          <Box
            sx={{
              width: 20,
              height: 20,
              background: "#fd7e14",
              display: "inline-block",
              marginRight: "5px",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: "50%",
                backgroundColor: "#ffc107",
              },
            }}
          />
          <Typography variant="body2" display="inline">
            Allocated Seats
          </Typography>
        </Grid>
      </Grid>

      {!isSeatsChanging &&
        managers.length > 0 &&
        HOE.seats.length > 0 &&
        !isAddingManager &&
        teams.length > 0 &&
        selectedTeam !== "" &&
        selectedTeam !== "default" && (
          <Button
            variant="contained"
            color="primary"
            onClick={onClickingChangeSeats}
          >
            Change Seats for {selectedManager.name}'s{" "}
            {teams.find((item) => item.id === selectedTeam).team}
          </Button>
        )}
      {isSeatsChanging && !isAddingManager && (
        <Paper elevation={0} style={{ padding: "20px", marginTop: "20px" }}>
          <TextField
            label="Selected Seats"
            fullWidth
            value={selectedSeats}
            style={{ marginBottom: "25px" }}
            InputProps={{
              readOnly: true,
            }}
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onClickingUpdateSeats}
            >
              Update Seats for {selectedManager.name}'s{" "}
              {teams.find((item) => item.id === selectedTeam).team}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onClickingCancel}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      {!isSeatsChanging &&
        !isAddingManager &&
        HoeList.length > 0 &&
        HOE.seats.length > 0 &&
        HOE.seats.length - countAllocatedSeats() > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={onClickingAddNewManager}
            sx={{ marginTop: 5 }}
          >
            Add New Manager
          </Button>
        )}

      {isSeatsChanging && isAddingManager && (
        <Paper elevation={0} style={{ padding: "20px", marginTop: "20px" }}>
          <TextField
            label="First Name"
            name="firstname"
            fullWidth
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ marginBottom: "15px" }}
            autoFocus
            onBlur={handleBlur}
            error={!!firstNameError}
            helperText={firstNameError}
            color="success"
          />
          <TextField
            label="Last Name"
            name="lastname"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={{ marginBottom: "25px" }}
            autoFocus
            onBlur={handleBlur}
            error={!!lastNameError}
            helperText={lastNameError}
            color="success"
          />
          <TextField
            label="Seat Count"
            type="number"
            name="seatcount"
            fullWidth
            value={seatCount}
            onChange={(e) => setSeatCount(parseInt(e.target.value))}
            style={{ marginBottom: "25px" }}
            inputProps={{
              min: 1,
              max: HOE.seats.length - countAllocatedSeats(),
            }}
          />
          <TextField
            label="Seats Selected Count"
            name="seatsselectedcount"
            fullWidth
            value={selectedSeatCount}
            style={{ marginBottom: "25px" }}
            InputProps={{
              readOnly: true,
            }}
            autoFocus
          />
          <TextField
            label="Selected Seats"
            name="selectedseats"
            fullWidth
            value={seatData[selectedDay].join(", ")}
            style={{ marginBottom: "25px" }}
            InputProps={{
              readOnly: true,
            }}
            autoFocus
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={onClickingAddManager}
            >
              Add Manager
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={onClickingCancelAddManager}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Data updated successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Hoe;
