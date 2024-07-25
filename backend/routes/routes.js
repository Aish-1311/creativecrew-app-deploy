const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const { Model } = require('sequelize');

// Auth routes
router.post('/signup', controller.signup);
router.post('/', controller.login);

// Admin routes
router.get('/getBu', controller.getBu);
router.get('/getAllocatedSetsAdmin', controller.getAllocatedSetsAdmin);
router.get('/getSeatingCapacityAdmin', controller.getSeatingCapacityAdmin);
router.post('/createSeatingCapacityAdmin', controller.postSeatingCapacityAdmin);
router.put('/updateSeatingCapacityAdmin/:id', controller.updateSeatingCapacityAdmin);
router.delete('/deleteSeatingCapacityAdmin/:id', controller.deleteSeatingCapacityAdmin);
router.post('/createAllocatedSetsAdmin', controller.createAllocatedSetsAdmin);
router.get('/getSeatingCapacityAdminByFilter', controller.getSeatingCapacityAdminByFilter);

//HOE page routes
router.get('/getHOEFromTable/:id', controller.getHOEFromTable);
router.get('/getManagersByHOEIdFromTable/:id', controller.getManagersByHOEIdFromTable);
router.put('/updateManagerData/:id', controller.updateManagerData);
router.get('/getSeatData', controller.getSeatData);

// Manager page routes
router.get('/getManagerFromTable/:id', controller.getManagerFromTable);
router.get('/getEmployeesByManagerIdFromTable/:id', controller.getEmployeesByManagerIdFromTable);
router.put('/updateEmployeeSeatData/:id', controller.updateEmployeeSeatData);

//Matrix

router.get('/getAllocationForAdminMatrix', controller.getAllocationForAdminMatrix);
router.get('/getAllocationForHOEMatrix', controller.getAllocationForHOEMatrix);
router.get('/getAllocationForManagerMatrix',controller.getAllocationForManagerMatrix);
router.get('/getBUByFloor',controller.getBUByFloor);
router.get('/getAllocationForBUwise',controller.getAllocationForBUwise);
router.get('/getManagersByFloor',controller.getManagersByFloor);
router.get('/getTransportMetrix',controller.getTransportMetrix);

module.exports = router;
