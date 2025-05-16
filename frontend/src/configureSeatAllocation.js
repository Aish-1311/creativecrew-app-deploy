import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Snackbar, Alert } from '@mui/material';
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./capacitySeatingAllocation.css";
import "./seatAllocation.css"; // Make sure you have the correct path and name
import { baseurl } from './utils';
const initialState = {
  country: "",
  countryId : '',
  state: "",
  stateId: '',
  city: "",
  cityId: '',
  campus: "",
  campusId: '',
  floor: "",
  capacity: "",
};
const capacity = 100;
const ConfigureSeatAllocation = () => {
  const initialSeats = Array(capacity).fill({ status: 0 });
  const [seats, setSeats] = useState(initialSeats);
  const [values, setValues] = React.useState(initialState);
  const [allocationData, setData] = React.useState([]);
  const [allocateSeatSecFlag, setAllocateSeatSecFlag] = useState(false);
  const [capacityList, setCapacityList] = React.useState([]);
  const [countries, setCountries] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [campuses, setCampuses] = React.useState([]);
  const [configFlag, setConfigFlag] = React.useState("Add");
  const [currentId, setCurrentId] = React.useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarText, setSnackBarText] = useState('');
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [errors, setErrors] = React.useState({
    country: '',
    state: '',
    city: '',
    campus: '',
    floor: ''
  });

  const [isAddingNewCountry, setIsAddingNewCountry] = useState(false);
  const [isAddingNewState, setIsAddingNewState] = useState(false);
  const [isAddingNewCity, setIsAddingNewCity] = useState(false);
  const [isAddingNewCampus, setIsAddingNewCampus] = useState(false);


  const navigate = useNavigate();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    setSnackBarText('')
  };

  const snackbarStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
  };

  React.useEffect(() => {
    getConfiguredData();
    getCountries();
    getStates();
    getCities();
    getCampuses();
  }, []);
  const getConfiguredData = async () => {
    await axios
      .get(`${baseurl}/getSeatingCapacityAdmin`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCapacityList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCountries = async () => {
    await axios.get(`${baseurl}/countries`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          console.log("countries", res.data)
          setCountries(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getStates = async () => {
    await axios.get(`${baseurl}/states`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          console.log("states", res.data)
          setStates(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getCities = async () => {
    await axios.get(`${baseurl}/cities`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCities(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getCampuses = async () => {
    await axios.get(`${baseurl}/campuses`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCampuses(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const onClickingAddNewCountry = () => {
    setIsAddingNewCountry(true);
  }
  const onClickingAddNewState = () => {
    setIsAddingNewState(true);
  }
  const onClickingAddNewCity = () => {
    setIsAddingNewCity(true);
  }
  const onClickingAddNewCampus = () => {
    setIsAddingNewCampus(true);
  }


  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" })
    // }
  };

  const handleAllocation = () => {
    setConfigFlag("Add")
    setAllocateSeatSecFlag(true);
    clearAllocation();
  };
  const validate = () => {
    const newErrors = {};

    if (!values.country) {
      newErrors.country = "required"
    }
    if (!values.state) {
      newErrors.state = "required"
    }
    if (!values.city) {
      newErrors.city = "required"
    }
    if (!values.campus) {
      newErrors.campus = "required"
    }
    if (!values.floor) {
      newErrors.floor = "required"
    }
    if (!values.capacity) {
      newErrors.capacity = "required"
    }
    return newErrors;
  };

  const validatingDataWhileSeatConfiguration = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
    if (!values.country || !values.state || !values.city || !values.floor || !values.capacity || !values.campus) {

      return;

    }
    if (configFlag == "Edit") {
      editCapacity();
    } else {
      createCapacity();
    }
    setAllocateSeatSecFlag(false);
    setIsEditingCapacity(false);
  }

  const handleSubmitAllocation = async () => {
    if (values.country === '' || values.state === '' || values.city === '' || values.campus === '' || values.floor === '' || values.capacity === '') {
      return
    }

    else if (isAddingNewCountry) {
        try {
  
          const response = await axios.get(`${baseurl}/searchCountry`, {
            params : {
            country : values.country
          }});
          console.log(response);
          if (response.data !== '' && response.data.data.length > 0) {
            setSnackBarText(response.data.msg);
            setOpenSnackbar(true);
          } else {
            getSeatConfiguration();
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    
    else if (isAddingNewState) {
      try {

        const response = await axios.get(`${baseurl}/searchState`, {
          params : {
          state : values.state
        }});
        console.log(response);
        if (response.data !== '' && response.data.data.length > 0) {
          setSnackBarText(response.data.msg);
          setOpenSnackbar(true);
        } else {
          getSeatConfiguration();
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    else if (isAddingNewCity) {
      try {

        const response = await axios.get(`${baseurl}/searchCity`, {
          params : {
            city : values.city
        }});
        console.log(response);
        if (response.data !== '' && response.data.data.length > 0) {
          setSnackBarText(response.data.msg);
          setOpenSnackbar(true);
        } else {
          getSeatConfiguration();
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    else if (isAddingNewCampus) {
      try {

        const response = await axios.get(`${baseurl}/searchCampus`, {
          params : {
            campus : values.campus
        }});
        console.log(response);
        if (response.data !== '' && response.data.data.length > 0) {
          setSnackBarText(response.data.msg);
          setOpenSnackbar(true);
        } else {
          getSeatConfiguration();
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    else if (!isEditingCapacity) {
      getSeatConfiguration();
    }
     else {
      validatingDataWhileSeatConfiguration();
    }

  };
  const getSeatConfiguration = async () => {
     if (!isEditingCapacity) {
      try {

        const response = await axios.get(`${baseurl}/getFloorConfiguration`, {
          params: {
            campus: values.campus,
            floor: values.floor,
            country: values.country,
            state: values.state,
            city: values.city
          }
        });
        console.log(response);
        console.log(response.data.length);

        if (response.data.result.length === 0) {
          validatingDataWhileSeatConfiguration();
        }
        else {
          setSnackBarText(response.data.msg);
          setOpenSnackbar(true);
          
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  }

  const createCapacity = async () => {
    await axios
      .post(`${baseurl}/createSeatingCapacityAdmin`, 
        {
          campus: values.campus,
          floor: values.floor,
          country: values.country,
          state: values.state,
          city: values.city,
          capacity : values.capacity,
          isAddingNewCampus,
          isAddingNewCity,
          isAddingNewCountry,
          isAddingNewState
      })
      .then((res) => {
        if (res.data) {
          getCountries();
          getStates();
          getCities();
          getCampuses();
          setCapacityList(res.data);
          getConfiguredData();
          clearAllocation();
          setIsAddingNewCountry(false);
          setIsAddingNewState(false);
          setIsAddingNewCity(false);
          setIsEditingCapacity(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editCapacity = async () => {
    await axios
      .put(
        `${baseurl}/updateSeatingCapacityAdmin/${currentId}`,
        values
      )
      .then((res) => {
        if (res.data) {
          getConfiguredData();
          clearAllocation();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const clearAllocation = () => {
    let copyInitialState = JSON.parse(JSON.stringify(initialState));
    setValues(copyInitialState);
    setCurrentId(0);
    setErrors({})
  };
  const handleBack = () => {
    setAllocateSeatSecFlag(false);
    clearAllocation();
  };
  const handleSeatAllocation = () => {
    navigate("/seatAllocationAdmin");
  };
  const handleEdit = (row, i) => {
    setCurrentId(row.id);
    setValues(row);
    setConfigFlag("Edit");
    setAllocateSeatSecFlag(true);
    setErrors({});
    setIsEditingCapacity(true);

  };
  const handleDelete = async (row, id) => {
    await axios
      .delete(`${baseurl}/deleteSeatingCapacityAdmin/${row.id}`)
      .then((res) => {
        if (res.data) {
          getConfiguredData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="seatAllocationContainer">
      <Grid container spacing={2} justifyContent={"center"}>
        {allocateSeatSecFlag ? (
          <Grid
            item
            md={3}
            sx={{ maxWidth: 410, margin: "7%" }}
            className="allocateContainer"
          >
            <Box
              sx={{
                minWidth: 120,
                alignItems: "center",
                display: "flex",
                justifyContent: "start",
                margin: "10px",
                cursor: "pointer",
              }}
            >
              <ChevronLeftRoundedIcon
                className="backIconCls"
                onClick={handleBack}
              />{" "}
              <h2 className="fontFamily">{configFlag} new seating capacity</h2>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium" required>
                {!isAddingNewCountry ? <><InputLabel id="demo-simple-select-label">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.country}
                    label="Country"
                    name="country"
                    disabled={configFlag == "Edit"}
                    onChange={(e) => {
                      setValues({ ...values, country: e.target.value === 'newCountry' ? '' : e.target.value, state: "", city: "", campus: "", floor: "" });
                      setErrors({ ...errors, [e.target.name]: "" });
                      if (e.target.value === 'newCountry') {
                        setIsAddingNewCountry(true);
                        setIsAddingNewState(true);
                        setIsAddingNewCity(true);
                        setIsAddingNewCampus(true);
                      }
                    }}
                  >
                    <MenuItem key={'newCountry'} value={"newCountry"} sx={{
                      color: '#ABB6B5',
                      fontStyle: 'italic',
                      '&:hover': { backgroundColor: '#BBF9DD', color: '#ABB6B5' }, // Hover effects
                    }}>Add New Country</MenuItem>
                    {countries.map((item) => (
                      <MenuItem key={item.country} value={item.country}>
                        {item.country}
                      </MenuItem>
                    ))}
                  </Select>
                </>
                  :
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      required
                      label='New Country'
                      value={values.country}
                      onChange={(e) => {
                        const input = e.target.value;
                        const capitalized = input
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        setValues({ ...values, country: capitalized })
                      }}
                      onBlur={() => {
                        setValues({ ...values, country: values.country.trim() });
                      }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Cancel and return to dropdown" arrow>
                              <IconButton
                                aria-label="cancel"
                                onClick={() => {
                                  setIsAddingNewCountry(false); // Go back to Select dropdown
                                  setIsAddingNewState(false);
                                  setIsAddingNewCity(false);
                                  setIsAddingNewCampus(false);
                                  setValues({ ...values, country: "", state: "", city: "", campus: "", floor : "" });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
                {errors.country ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "14px" }}>Required*</div> : ""}

              </FormControl>

            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium" required>
                {!isAddingNewState ? <><InputLabel id="demo-simple-select-label">State</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.state}
                    label="State"
                    name="state"
                    disabled={configFlag == "Edit"}
                    onChange={(e) => {
                      setValues({ ...values, state: e.target.value === 'newState' ? '' : e.target.value, city: "", campus: "", floor: "" });
                      setErrors({ ...errors, [e.target.name]: "" });
                      if (e.target.value === 'newState') {
                        setIsAddingNewState(true);
                        setIsAddingNewCity(true);
                        setIsAddingNewCampus(true);
                      }
                    }}
                  >
                    {values.country !== '' && <MenuItem key={'newState'} value={"newState"} sx={{
                      color: '#ABB6B5',
                      fontStyle: 'italic',
                      '&:hover': { backgroundColor: '#BBF9DD', color: '#ABB6B5' }, // Hover effects
                    }} >Add New State</MenuItem>}
                    {states.filter(item => item.country === values.country).map((item) => (
                      <MenuItem key={item.state} value={item.state}>
                        {item.state}
                      </MenuItem>
                    ))}
                  </Select>
                </>
                  :
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      required
                      label='New State'
                      value={values.state}
                      onChange={(e) => {
                        const input = e.target.value;
                        const capitalized = input
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        setValues({ ...values, state: capitalized })
                      }}
                      onBlur={() => {
                        setValues({ ...values, state: values.state.trim() });
                      }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Cancel and return to dropdown" arrow>
                              <IconButton
                                aria-label="cancel"
                                onClick={() => {
                                  setIsAddingNewState(false); // Go back to Select dropdown
                                  setIsAddingNewCity(false);
                                  setIsAddingNewCampus(false);
                                  setValues({ ...values, state: "", city: "", campus: "", floor : "" });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
                {errors.state ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "12px" }}>State is required</div> : ""}
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium" required>
                {!isAddingNewCity ? <><InputLabel id="demo-simple-select-label">City</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.city}
                    label="City"
                    name="city"
                    disabled={configFlag == "Edit"}
                    onChange={(e) => {
                      setValues({ ...values, city: e.target.value === 'newCity' ? '' : e.target.value, campus: "", floor: "" });
                      setErrors({ ...errors, [e.target.name]: "" });
                      if (e.target.value === 'newCity') {
                        setIsAddingNewCity(true);
                        setIsAddingNewCampus(true);
                      }
                    }}
                  >
                    {values.state !== '' && <MenuItem key={'newCity'} value={"newCity"} sx={{
                      color: '#ABB6B5',
                      fontStyle: 'italic',
                      '&:hover': { backgroundColor: '#BBF9DD', color: '#ABB6B5' }, // Hover effects
                    }} >Add New City</MenuItem>}
                    {cities.filter(item => item.state === values.state).map((item) => (
                      <MenuItem key={item.city} value={item.city}>
                        {item.city}
                      </MenuItem>
                    ))}

                  </Select>
                </>
                  :
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      required
                      label='New City'
                      value={values.city}
                      onChange={(e) => {
                        const input = e.target.value;
                        const capitalized = input
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        setValues({ ...values, city: capitalized })
                      }}
                      onBlur={() => {
                        setValues({ ...values, city: values.city.trim() });
                      }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Cancel and return to dropdown" arrow>
                              <IconButton
                                aria-label="cancel"
                                onClick={() => {
                                  setIsAddingNewCity(false);
                                  setIsAddingNewCampus(false);
                                  setValues({ ...values, city: "", campus: "", floor : "" });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
                {errors.city ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "12px" }}>City is required</div> : ""}

              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium" required>
                {!isAddingNewCampus ? <><InputLabel id="demo-simple-select-label">Campus</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.campus}
                    label="Location"
                    name="campus"
                    disabled={configFlag == "Edit"}
                    onChange={(e) => {
                      setValues({ ...values, campus: e.target.value === 'newCampus' ? '' : e.target.value, floor: "" });
                      setErrors({ ...errors, [e.target.name]: "" });
                      if (e.target.value === 'newCampus') setIsAddingNewCampus(true);
                    }}
                  >
                    {values.city !== '' && <MenuItem key={'newCampus'} value={"newCampus"} sx={{
                      color: '#ABB6B5',
                      fontStyle: 'italic',
                      '&:hover': { backgroundColor: '#BBF9DD', color: '#ABB6B5' }, // Hover effects
                    }} >Add New Campus</MenuItem>}
                    {campuses.filter(item => item.city === values.city).map((item) => (
                      <MenuItem key={item.campus} value={item.campus}>
                        {item.campus}
                      </MenuItem>
                    ))}

                  </Select>
                </>
                  :
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      required
                      label='New Campus'
                      value={values.campus}
                      onChange={(e) => {
                        const input = e.target.value;
                        const capitalized = input
                          .split(' ')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                        setValues({ ...values, campus: capitalized })
                      }}
                      onBlur={() => {
                        setValues({ ...values, campus: values.campus.trim() });
                      }}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Cancel and return to dropdown" arrow>
                              <IconButton
                                aria-label="cancel"
                                onClick={() => {
                                  setIsAddingNewCampus(false);
                                  setValues({ ...values, campus: "", floor: "" });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                }
                {errors.campus ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "12px" }}>Location is required</div> : ""}

              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium" required>
                <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.floor}
                  label="Floor"
                  name="floor"
                  disabled={configFlag == "Edit"}
                  onChange={(e) => {
                    setValues({ ...values, floor: e.target.value });
                    setErrors({ ...errors, [e.target.name]: "" });
                  }}
                  MenuProps={{
                    style: { border: "none", maxHeight: "200px" }, // Adjust the maxHeight as needed
                  }}
                >
                  {/* Generate menu items for floor numbers 1 to 100 */}
                  {Array.from({ length: 200 }, (_, index) => (
                    <MenuItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}
                    </MenuItem>
                  ))}
                </Select>
                {errors.floor ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "12px" }}>Floor is required</div> : ""}

              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                {/* <InputLabel id="demo-simple-select-label">No of seats</InputLabel> */}
                <TextField
                  required
                  id="outlined-number"
                  label="Allocation seats"
                  type="number"
                  name="capacity"
                  value={values.capacity}
                  onChange={(e) => {
                    setValues({ ...values, capacity: e.target.value });
                    setErrors({ ...errors, [e.target.name]: "" });
                  }}
                />
                {errors.capacity ? <div className="fontFamily" style={{ color: "red", paddingTop: "5px", fontSize: "12px" }}>Add capacity</div> : ""}

                {/* <Input id="outlined-basic" variant="outlined"   name='maxSeats' value={values.maxSeats} onChange={handleChange} type="number"/> */}
              </FormControl>
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <Grid container justifyContent={"end"}>
                <Button
                  sx={{ mr: 2 }}
                  className="secondaryBtnColors"
                  onClick={clearAllocation}
                >
                  Clear
                </Button>
                <Button
                  sx={{ mr: 2 }}
                  className="primaryBtnColors"
                  onClick={handleSubmitAllocation}
                >
                  Submit
                </Button>
              </Grid>
            </Box>
          </Grid>
        ) : (
          <Grid item xs={11}>
            <Box
              sx={{
                display: "flex",
                margin: "2%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 className="fontFamily">Seating Capacity</h3>
              <Grid>
                <Button
                  className="primaryBtnColors"
                  onClick={handleAllocation}
                  sx={{ textTransform: "capitalize", margin: "5px" }}
                >
                  Add new seating capacity
                </Button>
                <Button
                  className="primaryBtnColors"
                  onClick={handleSeatAllocation}
                  sx={{ textTransform: "capitalize", margin: "5px" }}
                >
                  Allocate seats
                </Button>
              </Grid>
            </Box>
            <Box className="seatAllocationClass">
              <TableContainer className="capacityTableContainer" sx={{ maxWidth: "100%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Country&nbsp;</TableCell>
                      <TableCell align="left">State&nbsp;</TableCell>
                      <TableCell align="left">City&nbsp;</TableCell>
                      <TableCell align="left">Location&nbsp;</TableCell>
                      <TableCell align="left">Floor&nbsp;</TableCell>
                      <TableCell align="left">Capacity&nbsp;</TableCell>
                      <TableCell align="left">Edit&nbsp;</TableCell>
                      <TableCell align="left">Delete&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {capacityList.length > 0 &&
                      capacityList.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell align="left">{row.country}</TableCell>
                          <TableCell align="left">{row.state}</TableCell>
                          <TableCell align="left">{row.city}</TableCell>
                          <TableCell align="left">{row.campus}</TableCell>
                          <TableCell align="left">{row.floor}</TableCell>
                          <TableCell align="left">{row.capacity}</TableCell>
                          <TableCell
                            align="center"
                            onClick={(index) => handleEdit(row, index)}
                          >
                            <EditOutlinedIcon />
                          </TableCell>
                          <TableCell
                            align="center"
                            onClick={(index) => handleDelete(row, index)}
                          >
                            <DeleteOutlineOutlinedIcon />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            {/* {seats.map((seat,i)=>(
          <div className='seat' key={i}></div>
        ))} */}
          </Grid>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          style={snackbarStyle}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackBarText}
          </Alert>
        </Snackbar>
      </Grid>
    </div>
  );
};

export default ConfigureSeatAllocation;
