import React from 'react';
import { Button } from '@mui/material';

const Seat = ({ number, isSelected, onClick, managerDetails, managersList, isSeatsChanging, totalHoeSeats, floor }) => {

    let isDisabled = true;
    let seats;
    let allocatedSeats
    if (managerDetails !== "" && managersList.length > 0) {
        const dummy = managersList.flatMap(manager => manager.seats_array); // to get all allocated seats 
        allocatedSeats = isSeatsChanging ? dummy.filter(item => !managerDetails.seats_array.includes(item)) : dummy;
        /* allocated seats represent no of seats allocated so that we can't select those allocated seats
         Note: if isSeatsChanging value is true selectedManager seats will also counts as available seats(unallocated seats)*/

        // to disable all seats when isSeatsChanging is false
        isDisabled = !isSeatsChanging ? isDisabled : managerDetails.seats_array.includes(number) || (!allocatedSeats.includes(number) && (totalHoeSeats.includes(number))) ? false : isDisabled;
        /* the above line is to enable unallocated seats to select by HOE  to allocate to manager*/

        const { seats_array } = managerDetails;
        seats = seats_array;
    } else {
        allocatedSeats = [];
        isDisabled = true;
        seats = [];
    }

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
                    backgroundColor: seats.includes(number) ? "#ffc107" : allocatedSeats.includes(number) ? "#fd7e14" : (totalHoeSeats.includes(number)) ? "#28a745" : ""
                },
            }}
        >
            {floor}-{number}
        </Button>
    );
};

export default Seat;