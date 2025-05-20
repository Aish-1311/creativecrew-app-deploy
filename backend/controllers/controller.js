const jwt = require("jsonwebtoken");
const models = require("../models/models");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const JWT_SECRET = "2343434asaflajsdfkljalsibkei"; // Hardcoded JWT secret

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role, bu, transport } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const token = jwt.sign({ email }, JWT_SECRET);
    models.insertUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      bu,
      transport,
      (err, result) => {
        if (err) {
          console.error("Error inserting user:", err.message);
          return res
            .status(500)
            .json({ error: "Error inserting data into the database" });
        }
        res.status(201).json({ message: "Data inserted successfully", token });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  models.findUserByEmail(email, async (err, user) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    try {
      // Compare entered password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const newToken = jwt.sign(
        {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          bu: user.bu,
        },
        JWT_SECRET
      );

      res.status(200).json({
        message: "Login successful",
        token: newToken,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  });
};

exports.getSeatData = async (req, res) => {
  const { firstName, lastName, bu } = req.query;

  try {
    // Call the model function to get seat data
    const seatData = await models.getSeatDataByUser(firstName, lastName, bu);

    if (seatData.length === 0) {
      return res.status(404).json({ message: "No seat data found" });
    }

    // Respond with the fetched seat data
    res.status(200).json(seatData);
  } catch (error) {
    console.error("Error fetching seat data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBu = async (req, res) => {
  try {
    const Bu = await models.getBu();
    if (Bu.length === 0) {
      return res.status(404).json({ message: "Bu not found" });
    }
    res.status(200).json(Bu);
  } catch (err) {
    console.error("Error fetching Bunames:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocatedSetsAdmin = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocatedSetsAdmin();
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdmin = async (req, res) => {
  try {
    const getCapacity = await models.getSeatingCapacityAdmin();
    if (getCapacity.length === 0) {
      return res.status(404).json({ message: "getCapacity not found" });
    }
    res.status(200).json(getCapacity);
  } catch (err) {
    console.error("Error fetching getCapacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postSeatingCapacityAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    const createCapacityMsg = await models.createSeatingCapacityAdmin(
      requestBody
    );
    res.status(200).json({ msg: "created succesfully" });
  } catch (err) {
    console.error("Error fetching createCapacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSeatingCapacityAdmin = async (req, res) => {
  const id = req.params.id;
  const { capacity } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const updateCapacityMsg = await models.updateSeatingCapacityAdmin(
      id,
      capacity
    );
    res.status(200).json({ msg: "updated succesfully" });
  } catch (err) {
    console.error("Error fetching update Capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSeatingCapacityAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const deleteCapacityMsg = await models.deleteSeatingCapacityAdmin(id);
    res.status(200).json({ msg: "deleted succesfully" });
  } catch (err) {
    console.error("Error fetching delete Capacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAllocatedSetsAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    const createCapacityMsg = await models.createAllocatedSetsAdmin(
      requestBody
    );
    res.status(200).json({ msg: "created succesfully" });
  } catch (err) {
    console.error("Error fetching createCapacity:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdminByFilter = async (req, res) => {
  try {
    const { country, city, state, floor, campus } = req.query;
    const values = [country, state, city, parseInt(floor), campus];
    const allocatedSeats = await models.getSeatingCapacityAdminByFilter(values);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocationForAdminMatrix = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocationForAdminMatrix(req);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocationForHOEMatrix = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocationForHOEMatrix(req);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBUByFloor = async (req, res) => {
  try {
    const bus = await models.getBUByFloor(req);
    if (bus.length === 0) {
      return res.status(404).json({ message: "BU not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    console.error("Error fetching BU:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocationForBUwise = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocationForBUwise(req);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getHoeIdFromTable = async (req, res) => {
  const { bu } = req.query;
  try {
    const result = await models.getHoeIdFromTable(bu);
    if (result.length === 0) {
      return res.status(404).json({ message: "Hoe not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getHOEFromTable = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const result = await models.getHOEFromTable(id);
    if (result.length === 0) {
      return res.status(404).json({ message: "HOE not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching HOE:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagersByHOEIdFromTable = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { country, state, city, campus, floor } = req.query;

  try {
    const result = await models.getManagersByHOEIdFromTable(
      id,
      country,
      state,
      city,
      campus,
      floor
    );
    res.status(200).json(result.length ? result : []);
  } catch (err) {
    console.error("Error fetching Managers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateManagerData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { seats } = req.body;

  try {
    const result = await models.updateManagerData(id, seats);
    res
      .status(200)
      .json({ message: "Manager data updated successfully", result });
  } catch (err) {
    console.error("Error updating manager data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addNewManager = async (req, res) => {
  const {
    firstName,
    lastName,
    businessUnit,
    country,
    state,
    city,
    campus,
    floor,
    seats_array,
    hoe_id,
    team,
  } = req.body;

  try {
    const result = await models.addNewManager(
      firstName,
      lastName,
      businessUnit,
      country,
      state,
      city,
      campus,
      floor,
      seats_array,
      hoe_id,
      team
    );
    res.status(200).json({ message: "New Manager added successfully", result });
  } catch (err) {
    console.error("Error adding manager data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagerIdFromTable = async (req, res) => {
  const { bu, firstName, lastName } = req.query;
  try {
    const result = await models.getManagerIdFromTable(bu, firstName, lastName);
    if (result.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getManagerFromTable = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await models.getManagerFromTable(id);
    if (result.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getEmployeesByManagerIdFromTable = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await models.getEmployeesByManagerIdFromTable(id);
    res.status(200).json(result.length ? result : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateEmployeeSeatData = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { seats } = req.body;
  try {
    const result = await models.updateEmployeeSeatData(id, seats);
    res.json({ result, message: "Seat data updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addNewEmployee = async (req, res) => {
  const { firstName, lastName, businessUnit, seat_data, managerId, defaultId } =
    req.body;

  try {
    const result = await models.addNewEmployee(
      firstName,
      lastName,
      businessUnit,
      seat_data,
      managerId,
      defaultId
    );
    res.status(200).json({ message: "New Manager added successfully", result });
  } catch (err) {
    console.error("Error adding manager data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagersByFloor = async (req, res) => {
  try {
    const { country, city, state, floor, campus, bu_id } = req.query;
    const values = [country, state, city, parseInt(floor), campus, bu_id];
    const managers = await models.getManagersByFloor(values);
    if (managers.length === 0) {
      return res.status(404).json({ message: "Managers not found" });
    }
    res.status(200).json(managers);
  } catch (err) {
    console.error("Error fetching Managers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocationForManagerMatrix = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocationForManagerMatrix(req);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "allocatedSeats not found" });
    }
    res.status(200).json(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocatedSeats:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTransportMetrix = async (req, res) => {
  try {
    const data = await models.getTransportMetrix(req);
    if (data.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFloorConfiguration = async (req, res) => {
  const { country, state, city, campus, floor } = req.query;

  try {
    const result = await models.getFloorConfiguration(
      country,
      state,
      city,
      campus,
      floor
    );
    res.status(200).json({
      result: result.length ? result : [],
      msg: "Already floor plan created with this data.Please change data and try again.",
    });
  } catch (err) {
    console.error("Error fetching floor configuration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getDetailsBeforeAllocation = async (req, res) => {
  const { country, state, city, campus, floor, businessId } = req.query;

  try {
    const result = await models.getDetailsBeforeAllocation(
      country,
      state,
      city,
      campus,
      floor,
      businessId
    );
    res.status(200).json(result.length ? result : []);
  } catch (err) {
    console.error("Error fetching details before allocation:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateToSameRow = async (req, res) => {
  const { country, state, city, campus, floor, bu, seats } = req.body;

  try {
    const result = await models.updateToSameRow(
      country,
      state,
      city,
      campus,
      floor,
      bu,
      seats
    );
    res.json({ message: "Allocated successfully" });
  } catch (err) {
    console.error("Error updating seats column in seat_allocation:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeSeatsForHOE = async (req, res) => {
  const { country, state, city, campus, floor, businessId } = req.body;

  try {
    const result = await models.removeSeatsForHOE(
      country,
      state,
      city,
      campus,
      floor,
      businessId
    );
    res.status(200).json({ message: "Seats Removed Successfully", result });
  } catch (err) {
    console.error("Error removing seats for HOE:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Graphs
exports.getManagerAllocationData = async (req, res) => {
  const { hoeId } = req.query;

  try {
    const data = await models.getManagerAllocationData(hoeId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching manager allocation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.getSeatAllocationData = async (req, res) => {
  try {
    const seatData = await models.getSeatAllocationData();

    if (seatData.length === 0) {
      return res.status(404).json({ message: "No seat data found" });
    }

    // Respond with the seat data
    res.status(200).json(seatData);
  } catch (error) {
    console.error("Error fetching seat data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityData = async (req, res) => {
  try {
    const seatingData = await models.getSeatingCapacityData();

    if (seatingData.length === 0) {
      return res
        .status(404)
        .json({ message: "No seating capacity data found" });
    }

    res.status(200).json(seatingData);
  } catch (error) {
    console.error("Error fetching seating capacity data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagerIdForGraph = async (req, res) => {
  const { bu, firstName, lastName } = req.query;

  try {
    const data = await models.getManagerIdForGraph(bu, firstName, lastName);
    res.json(data);
  } catch (error) {
    console.error("Error fetching manager allocation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.getGraphDetailsForManager = async (req, res) => {
  const { managerId } = req.query;

  try {
    const data = await models.getGraphDetailsForManager(managerId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching manager allocation data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.changePassword = (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Find user by email using callback
  models.findUserByEmail(email, (err, user) => {
    if (err) {
      console.error("Error fetching user data:", err.message);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare entered old password with the stored hashed password
    bcrypt.compare(oldPassword, user.password, async (err, isPasswordValid) => {
      if (err) {
        console.error("Error comparing passwords:", err.message);
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid old password" });
      }

      // Hash the new password
      bcrypt.hash(newPassword, 10, (err, hashedNewPassword) => {
        if (err) {
          console.error("Error hashing new password:", err.message);
          return res.status(500).json({ error: "Error hashing new password" });
        }

        // Update user's password using callback
        models.updateUserPassword(email, hashedNewPassword, (err, result) => {
          if (err) {
            console.error("Error updating user password:", err.message);
            return res
              .status(500)
              .json({ error: "Error updating user password" });
          }

          // Respond with success message
          res.status(200).json({
            message: "Password changed successfully",
          });
        });
      });
    });
  });
};

exports.countries = async (req, res) => {
  try {
    const data = await models.countries();
    res.json(data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.states = async (req, res) => {
  try {
    const data = await models.states();
    res.json(data);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.cities = async (req, res) => {
  try {
    const data = await models.cities();
    res.json(data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.campuses = async (req, res) => {
  try {
    const data = await models.campuses();
    res.json(data);
  } catch (error) {
    console.error("Error fetching campuses:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

exports.searchCountry = async (req, res) => {
  const { country } = req.query;
  try {
    const result = await models.searchCountry(country);
    if (result.length > 0)
      res.status(200).json({
        data: result,
        msg: "Country already present. Please give new country or select from dropdown",
      });
    else res.status(200).send();
  } catch (err) {
    console.error("Error searching country:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchState = async (req, res) => {
  const { state } = req.query;
  try {
    const result = await models.searchState(state);
    if (result.length > 0)
      res.status(200).json({
        data: result,
        msg: "State already present. Please give new state or select from dropdown",
      });
    else res.status(200).send();
  } catch (err) {
    console.error("Error searching state:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchCity = async (req, res) => {
  const { city } = req.query;
  try {
    const result = await models.searchCity(city);
    if (result.length > 0)
      res.status(200).json({
        data: result,
        msg: "City already present. Please give new city or select from dropdown",
      });
    else res.status(200).send();
  } catch (err) {
    console.error("Error searching city:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchCampus = async (req, res) => {
  const { campus } = req.query;
  try {
    const result = await models.searchCampus(campus);
    if (result.length > 0)
      res.status(200).json({
        data: result,
        msg: "Campus already present. Please give new campus or select from dropdown",
      });
    else res.status(200).send();
  } catch (err) {
    console.error("Error searching campus:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagerTeamsFromTable = async (req, res) => {
  const { bu, firstName, lastName } = req.query;
  try {
    const result = await models.getManagerTeamsFromTable(
      bu,
      firstName,
      lastName
    );
    res.status(200).json(result.length ? result : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.searchTeam = async (req, res) => {
  const { team, firstName, lastName, bu } = req.query;
  try {
    const result = await models.searchTeam(team, firstName, lastName, bu);
    if (result.length > 0)
      res.status(200).json({
        data: result,
        msg: [
          "error",
          "Team already present. Please give new Team or select from dropdown",
        ],
      });
    else res.status(200).send();
  } catch (err) {
    console.error("Error searching team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addTeam = async (req, res) => {
  const {
    team,
    firstName,
    lastName,
    bu,
    country,
    state,
    city,
    campus,
    floor,
    hoeId,
  } = req.body;
  try {
    const result = await models.addTeam(
      team,
      firstName,
      lastName,
      bu,
      country,
      state,
      city,
      campus,
      floor,
      hoeId
    );
    res
      .status(200)
      .json({ data: result, msg: ["success", "Team Added Successfully"] });
  } catch (err) {
    console.error("Error adding team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTeam = async (req, res) => {
  const { id, defaultId, managerId } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    await models.deleteTeam(id, defaultId, managerId);
    res.status(200).json({ msg: ["success", "Team Deleted Successfully"] });
  } catch (err) {
    console.error("Error  deleteing Team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editTeam = async (req, res) => {
  const { id, name, firstName, lastName, bu } = req.body;
  try {
    const result = await models.editTeam(id, name, firstName, lastName, bu);
    res.status(200).json({
      data: result,
      msg: ["success", "Team Name Changed Successfully"],
    });
  } catch (err) {
    console.error("Error editing team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.assignEmployeeToTeam = async (req, res) => {
  const { id, teamId, mngId, managerIds } = req.body;
  try {
    const result = await models.assignEmployeeToTeam(
      id,
      teamId,
      mngId,
      managerIds
    );
    res.status(200).json({
      data: result,
      msg: ["success", "Employee Added to Team Successfully"],
    });
  } catch (err) {
    console.error("Error adding employee to team:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEmployeeFromTeam = async (req, res) => {
  const { id, managerId, defaultId, managerIds } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    const result = await models.deleteEmployeeFromTeam(
      id,
      managerId,
      defaultId,
      managerIds
    );
    res.status(200).json({
      data: result,
      msg: ["success", "Employee Removed from Team Successfully"],
    });
  } catch (err) {
    console.error("Error removing employee:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTeams = async (req, res) => {
  const { bu } = req.query;

  try {
    if (!bu) {
      return res.status(400).json({ error: "Missing bu" });
    }
    const result = await models.getTeams(bu);
    res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error fetching manager teams:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/////////////////////////////////////////////////////////////////////////////////////

exports.getManagerSeatAllocations = async (req, res) => {
  try {
    const data = await models.getManagerSeatAllocations();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting manager seat allocations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getManagerTeamsController = async (req, res) => {
  try {
    const teams = await models.getManagerTeams();
    res.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.saveSeatingArrangement = async (req, res) => {
  try {
    const allocations = req.body;
    const result = await models.saveSeatingArrangement(allocations);
    res
      .status(200)
      .json({ message: "Seating arrangement saved successfully", result });
  } catch (error) {
    console.error("Error saving seating arrangement:", error);

    if (error.message === "Seating arrangement name already exists.") {
      res.status(400).json({
        error:
          "Seating arrangement name already exists. Please choose a different name.",
      });
    } else {
      res.status(500).json({
        error: "Failed to save seating arrangement. Please try again.",
      });
    }
  }
};

exports.getSeatingAllocationNames = async (req, res) => {
  try {
    const names = await models.getSeatingAllocationNames();
    res.json(names);
  } catch (err) {
    console.error("Error fetching names:", err);
    res.status(500).json({ error: "Failed to fetch seating allocation names" });
  }
};
exports.getSeatingArrangementByName = async (req, res) => {
  try {
    const { name } = req.params;
    const arrangement = await models.getSeatingArrangementByName(name);
    res.json(arrangement);
  } catch (err) {
    console.error("Error fetching arrangement:", err);
    res.status(500).json({ error: "Failed to fetch seating arrangement" });
  }
};

exports.deleteSeatingArrangement = async (req, res) => {
  try {
    const { name } = req.params;
    const count = await models.deleteSeatingArrangement(name);
    res.json({ deleted: count });
  } catch (err) {
    console.error("Error deleting arrangement:", err);
    res.status(500).json({ error: "Failed to delete arrangement" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////Seat Pool/////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getAvailableSeats = async (req, res) => {
  const { country, state, city, campus, floor, day } = req.query;

  if (!country || !state || !city || !campus || !floor || !day) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const availableSeats = await models.getAvailableSeats(
      country,
      state,
      city,
      campus,
      floor,
      day
    );
    res.status(200).json({ seats: availableSeats });
  } catch (error) {
    console.error("Error fetching available seats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.selectSeat = async (req, res) => {
  const {
    first_name,
    last_name,
    seat_number,
    country,
    state,
    city,
    campus,
    floor,
    day,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !seat_number ||
    !country ||
    !state ||
    !city ||
    !campus ||
    !floor ||
    !day
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const savedSeat = await models.saveSelectedSeat({
      first_name,
      last_name,
      seat_number,
      country,
      state,
      city,
      campus,
      floor,
      day,
    });
    res.status(201).json(savedSeat);
  } catch (error) {
    if (error.code === "23505") {
      // Duplicate seat booking (seat already taken)
      res.status(409).json({
        message: "Seat already booked for selected day and location.",
      });
    } else if (error.code === "ALREADY_BOOKED") {
      // Employee has already booked a seat for this day
      res.status(409).json({ message: error.message });
    } else {
      console.error("Error saving selected seat:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

// const getSeatsFromEmployeeSelected = async (country, state, city, campus, floor, day) => {
//   const query = `
//     SELECT DISTINCT seat_number
//     FROM employee_selected_seats
//     WHERE country = $1 AND state = $2 AND city = $3
//       AND campus = $4 AND floor = $5 AND day = $6
//   `;
//   const values = [country, state, city, campus, floor, day];

//   try {
//     const { rows } = await pool.query(query, values);
//     return rows.map(row => row.seat_number);
//   } catch (error) {
//     console.error('Error fetching seats from employee_selected_seats:', error);
//     throw error;
//   }
// };

//........................

exports.getSeatsFromEmployeeSelected = async (req, res) => {
  const { country, state, city, campus, floor, day } = req.query;

  if (!country || !state || !city || !campus || !floor || !day) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const occupiedSeats = await models.getSeatsFromEmployeeSelected(
      country,
      state,
      city,
      campus,
      floor,
      day
    );
    res.status(200).json({ occupiedSeats });
  } catch (error) {
    console.error("Error fetching selected seats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSeatsBookedByUser = async (req, res) => {
  const { first_name, last_name, country, state, city, campus, floor, day } =
    req.query;

  if (
    !first_name ||
    !last_name ||
    !country ||
    !state ||
    !city ||
    !campus ||
    !floor ||
    !day
  ) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const seats = await models.getSeatsBookedByUser(
      first_name,
      last_name,
      country,
      state,
      city,
      campus,
      floor,
      day
    );
    res.status(200).json({ seats });
  } catch (error) {
    console.error("Error fetching user’s booked seats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSelectedSeats = async (req, res) => {
  const { firstName, lastName } = req.query;

  try {
    const seats = await models.fetchSelectedSeatsByEmployee(
      firstName,
      lastName
    );
    res.status(200).json(seats);
  } catch (error) {
    console.error("Error fetching selected seats:", error);
    res.status(500).json({ error: "Failed to fetch selected seats" });
  }
};

// DELETE controller
exports.cancelSeat = async (req, res) => {
  const { first_name, last_name, day } = req.body;

  try {
    await models.removeSelectedSeat(first_name, last_name, day);
    res.status(200).json({ message: "Seat cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling seat:", error);
    res.status(500).json({ error: "Failed to cancel seat" });
  }
};

exports.markNoShow = async (req, res) => {
  const {
    firstName,
    lastName,
    seatNumber,
    country,
    state,
    city,
    campus,
    floor,
    day,
  } = req.body;

  try {
    await models.insertNoShow(
      firstName,
      lastName,
      seatNumber,
      country,
      state,
      city,
      campus,
      floor,
      day
    );
    res.status(200).json({ message: "No Show marked successfully" });
  } catch (error) {
    console.error("Error marking No Show:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFilteredNoShows = async (req, res) => {
  try {
    const { country, state, city, campus, floor, day } = req.query;

    const noShowData = await models.getFilteredNoShowSeats({
      country,
      state,
      city,
      campus,
      floor,
      day,
    });

    res.status(200).json(noShowData);
  } catch (error) {
    console.error("Error fetching No Show data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
