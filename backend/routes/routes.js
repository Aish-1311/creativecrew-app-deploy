const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const { Model } = require("sequelize");

// Auth routes
router.post("/signup", controller.signup);
router.post("/", controller.login);

// Admin routes
router.get("/getBu", controller.getBu);
router.get("/getAllocatedSetsAdmin", controller.getAllocatedSetsAdmin);
router.get("/getSeatingCapacityAdmin", controller.getSeatingCapacityAdmin);
router.post("/createSeatingCapacityAdmin", controller.postSeatingCapacityAdmin);
router.put(
  "/updateSeatingCapacityAdmin/:id",
  controller.updateSeatingCapacityAdmin
);
router.delete(
  "/deleteSeatingCapacityAdmin/:id",
  controller.deleteSeatingCapacityAdmin
);
router.post("/createAllocatedSetsAdmin", controller.createAllocatedSetsAdmin);
router.get(
  "/getSeatingCapacityAdminByFilter",
  controller.getSeatingCapacityAdminByFilter
);
router.get("/getFloorConfiguration", controller.getFloorConfiguration);
router.get(
  "/getDetailsBeforeAllocation",
  controller.getDetailsBeforeAllocation
);
router.put("/updateToSameRow", controller.updateToSameRow);
router.put("/removeSeatsForHOE", controller.removeSeatsForHOE);

//HOE page routes
router.get("/getHoeIdFromTable", controller.getHoeIdFromTable);
router.get("/getHOEFromTable/:id", controller.getHOEFromTable);
router.get(
  "/getManagersByHOEIdFromTable/:id",
  controller.getManagersByHOEIdFromTable
);
router.put("/updateManagerData/:id", controller.updateManagerData);
router.post("/addNewManager", controller.addNewManager);
router.get("/getTeams", controller.getTeams);

// Employee page route
router.get("/getSeatData", controller.getSeatData);

// Manager page routes
router.get("/getManagerIdFromTable", controller.getManagerIdFromTable);
router.get("/getManagerFromTable/:id", controller.getManagerFromTable);
router.get(
  "/getEmployeesByManagerIdFromTable/:id",
  controller.getEmployeesByManagerIdFromTable
);
router.put("/updateEmployeeSeatData/:id", controller.updateEmployeeSeatData);
router.post("/addNewEmployee", controller.addNewEmployee);
router.get("/getManagerTeamsFromTable", controller.getManagerTeamsFromTable);
router.get("/searchTeam", controller.searchTeam);
router.post("/addTeam", controller.addTeam);
router.put("/editTeam", controller.editTeam);
router.delete("/deleteTeam", controller.deleteTeam);
router.put("/assignEmployeeToTeam", controller.assignEmployeeToTeam);
router.put("/deleteEmployeeFromTeam", controller.deleteEmployeeFromTeam);

//Matrix

router.get(
  "/getAllocationForAdminMatrix",
  controller.getAllocationForAdminMatrix
);
router.get("/getAllocationForHOEMatrix", controller.getAllocationForHOEMatrix);
router.get(
  "/getAllocationForManagerMatrix",
  controller.getAllocationForManagerMatrix
);
router.get("/getBUByFloor", controller.getBUByFloor);
router.get("/getAllocationForBUwise", controller.getAllocationForBUwise);
router.get("/getManagersByFloor", controller.getManagersByFloor);
router.get("/getTransportMetrix", controller.getTransportMetrix);

//Graphs
router.get("/getManagerAllocationData", controller.getManagerAllocationData);
router.get("/getSeatAllocationData", controller.getSeatAllocationData);
router.get("/getSeatingCapacityData", controller.getSeatingCapacityData);
router.get("/getManagerIdForGraph", controller.getManagerIdForGraph);
router.get("/getGraphDetailsForManager", controller.getGraphDetailsForManager);

//Profile
router.post("/changePassword", controller.changePassword);

//Floor Plan
router.get("/countries", controller.countries);
router.get("/states", controller.states);
router.get("/cities", controller.cities);
router.get("/campuses", controller.campuses);
router.get("/searchCountry", controller.searchCountry);
router.get("/searchState", controller.searchState);
router.get("/searchCity", controller.searchCity);
router.get("/searchCampus", controller.searchCampus);

//HOE plan
router.get("/getManagerTeams", controller.getManagerTeamsController);
router.post("/saveSeatingArrangement", controller.saveSeatingArrangement);
router.get("/seating-names", controller.getSeatingAllocationNames);
router.get(
  "/seating-arrangement/:name",
  controller.getSeatingArrangementByName
);
router.delete(
  "/seating-arrangement/:name",
  controller.deleteSeatingArrangement
);

//Seat Pool
router.get("/getFreeSeats", controller.getAvailableSeats);

router.post("/selectSeat", controller.selectSeat);

router.get(
  "/getFreeSeatsFromSelected",
  controller.getSeatsFromEmployeeSelected
);

router.get("/userBookedSeats", controller.getSeatsBookedByUser);

// GET all seats booked by an employee
router.get("/getSelectedSeats", controller.getSelectedSeats);

// DELETE (cancel) a booked seat by an employee
router.delete("/cancelSeat", controller.cancelSeat);

router.post("/markNoShow", controller.markNoShow);
router.post("/confirmOccupySeat", controller.confirmOccupySeat);

router.get("/getFilteredNoShows", controller.getFilteredNoShows);

module.exports = router;
