import React from 'react';
import { Button } from '@mui/material';

const Seat = ({ number, isSelected, onClick, employeeDetails, employeesList, isSeatsChanging, totalManagerSeats, floor, day, seatData }) => {


    const { seats_array } = employeeDetails;
    let employeeSeatonDay = []
    let allEmployeeSeatsOnDay = []
    //console.log("seats_array",seats_array);
    let isDisabled = true; // to disable all seats when isSeatsChanging is false
    let dummy;
    let allocatedSeats;

    if (employeesList.length > 0) {

        if (day === 'all') {
            employeeSeatonDay = seats_array;
        }
        else {
            employeeSeatonDay = [seatData[day]];
        }

        if (day === "all") {
            allEmployeeSeatsOnDay = seats_array;
        }
        else {
            allEmployeeSeatsOnDay = employeesList.map(employee =>
                employeeDetails.id === employee.id ? seatData[day] : employee.seat_data[day]
            );
        }

        if (day === 'all') dummy = employeesList.flatMap(employee => employee.seats_array); // to get all allocated seats 
        else dummy = allEmployeeSeatsOnDay;

        if (day === 'all') allocatedSeats = isSeatsChanging ? dummy.filter(item => !employeeDetails.seats_array.includes(item)) : dummy;
        else allocatedSeats = isSeatsChanging ? dummy.filter(item => !employeeSeatonDay.includes(item)) : dummy;
        /* allocated seats represent no of seats allocated so that we can't select those allocated seats
         Note: if isSeatsChanging value is true selectedManager seats will also counts as available seats(unallocated seats)*/

        if (day === 'all') isDisabled = !isSeatsChanging ? isDisabled : employeeDetails.seats_array.includes(number) || (!allocatedSeats.includes(number) && (totalManagerSeats.includes(number))) ? false : isDisabled;
        else isDisabled = !isSeatsChanging ? isDisabled : employeeSeatonDay.includes(number) || (!allocatedSeats.includes(number) && (totalManagerSeats.includes(number))) ? false : isDisabled;
        /* the above line is to enable unallocated seats to select by HOE  to allocate to manager*/
    } else {
        allocatedSeats = [];
        isDisabled = true;
    }
    // console.log("dummy", dummy);
    // console.log("allocated", allocatedSeats);
    // console.log(isDisabled);

    return (
        <Button
            variant="contained"
            onClick={onClick}
            style={{ margin: '5px' }}
            disabled={isDisabled}
            sx={{
                width: 30,
                backgroundColor: isSelected ? '#007bff' : '#28a745',
                '&.Mui-disabled': {
                    backgroundColor: employeeSeatonDay.includes(number) ? "#ffc107" : allocatedSeats.includes(number) ? "#fd7e14" : (totalManagerSeats.includes(number)) ? "#28a745" : ""
                },
            }}
        >
            {floor}-{number}
        </Button>
    );
};

export default Seat;