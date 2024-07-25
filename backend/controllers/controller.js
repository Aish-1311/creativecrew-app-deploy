const jwt = require("jsonwebtoken");
const models = require("../models/models");
const { getSecret } = require("../secretManager");

let JWT_SECRET;

(async () => {
  try {
    JWT_SECRET = await getSecret("JWT_SECRET"); // Ensure this matches your secret name in GCP
  } catch (error) {
    console.error(
      "Failed to load JWT_SECRET from Secret Manager:",
      error.message
    );
    process.exit(1); // Exit if secret cannot be loaded
  }
})();

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, role, bu, transport } =
    req.body;

  try {
    const token = jwt.sign({ email }, JWT_SECRET);
    await models.insertUser(
      firstName,
      lastName,
      email,
      password,
      role,
      bu,
      transport
    );
    res.status(201).json({ message: "Data inserted successfully", token });
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).json({ error: "Error inserting data into the database" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const rows = await models.findUserByEmailAndPassword(email, password);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const newToken = jwt.sign({ email: user.email }, JWT_SECRET);
    res
      .status(200)
      .json({ message: "Login successful", token: newToken, role: user.role });
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    res.status(500).json({ error: "Error fetching user data" });
  }
};

// The rest of the controller methods remain unchanged

exports.getBu = async (req, res) => {
  try {
    const Bu = await models.getBu();
    if (Bu.length === 0) {
      return res.status(404).json({ message: "Bu not found" });
    }
    res.status(200).json(Bu);
    console.log(Bu);
  } catch (err) {
    console.error("Error fetching Bunames:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllocatedSetsAdmin = async (req, res) => {
  try {
    const allocatedSeats = await models.getAllocatedSetsAdmin();
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "Allocated seats not found" });
    }
    res.status(200).json(allocatedSeats);
    console.log(allocatedSeats);
  } catch (err) {
    console.error("Error fetching allocated seats:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdmin = async (req, res) => {
  try {
    const getCapacity = await models.getSeatingCapacityAdmin();
    if (getCapacity.length === 0) {
      return res.status(404).json({ message: "Seating capacity not found" });
    }
    res.status(200).json(getCapacity);
    console.log(getCapacity);
  } catch (err) {
    console.error("Error fetching seating capacity:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.postSeatingCapacityAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    await models.createSeatingCapacityAdmin(requestBody);
    res.status(200).json({ msg: "Created successfully" });
    console.log("Created seating capacity:", requestBody);
  } catch (err) {
    console.error("Error creating seating capacity:", err.message);
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
    await models.updateSeatingCapacityAdmin(id, capacity);
    res.status(200).json({ msg: "Updated successfully" });
    console.log("Updated seating capacity:", { id, capacity });
  } catch (err) {
    console.error("Error updating seating capacity:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteSeatingCapacityAdmin = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ error: "Missing id" });
    }
    await models.deleteSeatingCapacityAdmin(id);
    res.status(200).json({ msg: "Deleted successfully" });
    console.log("Deleted seating capacity:", { id });
  } catch (err) {
    console.error("Error deleting seating capacity:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAllocatedSetsAdmin = async (req, res) => {
  const requestBody = req.body;
  try {
    await models.createAllocatedSetsAdmin(requestBody);
    res.status(200).json({ msg: "Created successfully" });
    console.log("Created allocated sets:", requestBody);
  } catch (err) {
    console.error("Error creating allocated sets:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSeatingCapacityAdminByFilter = async (req, res) => {
  try {
    const { country, city, state, floor } = req.query;
    const values = [country, state, city, parseInt(floor)];
    const allocatedSeats = await models.getSeatingCapacityAdminByFilter(values);
    if (allocatedSeats.length === 0) {
      return res.status(404).json({ message: "Seating capacity not found" });
    }
    res.status(200).json(allocatedSeats);
    console.log(allocatedSeats);
  } catch (err) {
    console.error("Error fetching seating capacity by filter:", err.message);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error fetching HOE:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getManagersByHOEIdFromTable = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { campus, floor } = req.query;
  try {
    const result = await models.getManagersByHOEIdFromTable(id, campus, floor);
    if (result.length === 0) {
      return res.status(404).json({ message: "Managers not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching managers:", err.message);
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
    console.error("Error updating manager data:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
