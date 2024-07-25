import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useState } from "react";
import "./seatAllocation.css"; // Make sure you have the correct path and name
const initialState={
  country: "",
  state: "",
  city: "",
  floor: "",
  bu: "",
  maxSeats: "",
}
const data = [
  {
    bu: "cloud",
    from: 1,
    to: 50,
    floor: 5,
    seats: 50,
    manager: "Hima",
    role: 1213,
  },
  {
    bu: "service",
    from: 51,
    to: 60,
    floor: 5,
    seats: 10,
    manager: "Asish",
    role: 1214,
  },
]; 
const maxSeats = 100;
const SeatAllocation = () => {
  const initialSeats = Array(maxSeats).fill({ status: 0 });
  const [seats, setSeats] = useState(initialSeats);
  const [values, setValues] = React.useState(initialState);
  const [allocationData, setData] = React.useState([]);
  const [allocateSeatSecFlag, setAllocateSeatSecFlag] = useState(false);
  // React.useEffect(()=>{
  //   const copiedArray = JSON.parse(JSON.stringify(data));
  //   for(i=0;i<copiedArray.length;i++){
  //     let arrObj=copiedArray[i]
  //     let obj={maxSeats:arrObj,from:arrObj.from}

  //     allocationData[['bu']]=obj
  //   }
  // },[])
  const handleChange = (event) => {
    // if(event.target.value){
    setValues({ ...values, [event.target.name]: event.target.value });
    // }
  };
  const colorCodeF = (bu) => {
    let colorCode =
      bu == "cloud" ? "green" : bu == "service" ? "purple" : "#d1cdcd";
    return colorCode;
  };
  const handleAllocation = () => {
    setAllocateSeatSecFlag(true);
  };
  const handleSubmitAllocation = () => {
    setAllocateSeatSecFlag(false);
  };
  const clearAllocation=()=>{
    let copyInitialState = JSON.parse(JSON.stringify(initialState));
    setValues(copyInitialState)
  }
  const handleBack=()=>{
    setAllocateSeatSecFlag(false);

  }
  console.log(allocationData, "seats", values);
  return (
    <div className="seatAllocationContainer">
      <Grid container spacing={2} justifyContent={"center"}>
        {allocateSeatSecFlag ? (
          <Grid item md={3} sx={{ maxWidth: 130 }} className='allocateContainer'>
             <Box sx={{ minWidth: 120,alignItems:'center',display:'flex',justifyContent:'start',margin:'10px',cursor:'pointer' }} >
             <ChevronLeftRoundedIcon className='backIconCls' onClick={handleBack}/> <h2 className="fontFamily">Allocate Seats</h2>
                
             </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.country}
                  label="Country"
                  name="country"
                  onChange={handleChange}
                >
                  <MenuItem value={"india"}>India</MenuItem>
                  <MenuItem value={"uk"}>UK</MenuItem>
                  <MenuItem value={"us"}>US</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                <InputLabel id="demo-simple-select-label">State</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.state}
                  label="State"
                  name="state"
                  onChange={handleChange}
                >
                  <MenuItem value={"telangana"}>Telangana</MenuItem>
                  <MenuItem value={"karnataka"}>Karnataka</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                <InputLabel id="demo-simple-select-label">City</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.city}
                  label="City"
                  name="city"
                  onChange={handleChange}
                >
                  <MenuItem value={"hyderabad"}>Hyderabad</MenuItem>
                  <MenuItem value={"bangalore"}>Bangalore</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                <InputLabel id="demo-simple-select-label">
                  Business Unit
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.bu}
                  label="Business Unit"
                  name="bu"
                  onChange={handleChange}
                >
                  <MenuItem value={"cloud"}>Cloud</MenuItem>
                  <MenuItem value={"Service"}>Service</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                <InputLabel id="demo-simple-select-label">Floor</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.floor}
                  label="Floor"
                  name="floor"
                  onChange={handleChange}
                >
                  <MenuItem value={"5"}>5</MenuItem>
                  <MenuItem value={"6"}>6</MenuItem>
                  <MenuItem value={"10"}>10</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl sx={{ m: 2, minWidth: "90%" }} size="medium">
                {/* <InputLabel id="demo-simple-select-label">No of seats</InputLabel> */}
                <TextField
                  id="outlined-number"
                  label="Allocation seats"
                  type="number"
                  name="maxSeats"
                  value={values.maxSeats}
                  onChange={handleChange}
                />
                {/* <Input id="outlined-basic" variant="outlined"   name='maxSeats' value={values.maxSeats} onChange={handleChange} type="number"/> */}
              </FormControl>
            </Box>
            <Box sx={{ marginTop: "10px" }}>
              <Grid container justifyContent={"end"}>
                <Button   sx={{ mr: 2 }} className="secondaryBtnColors" onClick={clearAllocation}>
                  Clear
                </Button>
                <Button   sx={{ mr: 2 }}  className="primaryBtnColors" onClick={handleSubmitAllocation}>
                  Assign to HOE
                </Button>
              </Grid>
            </Box>
          </Grid>
        ) : (
          <Grid item md={9}>
            <Box sx={{ textAlign: "right", margin: "2%" }}>
              <Button
                className="primaryBtnColors"
                onClick={handleAllocation}
              >
                Allocate Seats
              </Button>
            </Box>
            <Box className="seatAllocationClass">
              <h2 className="fontFamily">Seat Allocation</h2>
              {data.map((row, rowIndex) => (
                <>
                  {Array.from({ length: row.seats }, (_, index) => (
                    <div
                      className="seat"
                      key={index}
                      style={{ background: colorCodeF(row.bu) }}
                    >
                      {" "}
                    </div>
                  ))}
                </>
              ))}

              {Array.from({ length: maxSeats - 60 }, (_, index) => (
                <div
                  className="seat"
                  key={index}
                  style={{ background: colorCodeF("") }}
                >
                  {" "}
                </div>
              ))}

              <div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "green",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Cloud </div>
                </div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "purple",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Service </div>
                </div>
                <div className="legendsSeating">
                  <div
                    className="seat"
                    style={{
                      background: "#d1cdcd",
                      height: "10px",
                      width: "10px",
                    }}
                  >
                    {" "}
                  </div>
                  <div>Unallocated Seats </div>
                </div>
              </div>
            </Box>
            {/* {seats.map((seat,i)=>(
          <div className='seat' key={i}></div>
        ))} */}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default SeatAllocation;
