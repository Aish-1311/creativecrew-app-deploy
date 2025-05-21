const pool = require("./db");

const insertUser = (
  firstName,
  lastName,
  email,
  password,
  role,
  bu,
  transport,
  callback
) => {
  const sql =
    "INSERT INTO users (first_name, last_name, email, password, bu, transport, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
  const values = [firstName, lastName, email, password, bu, transport, role];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows[0]);
  });
};

const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows[0]);
  });
};

const getBu = async () => {
  const query = "SELECT * FROM business_unit";
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getAllocatedSetsAdmin = async () => {
  const query = "SELECT * FROM seat_allocation ORDER by id";
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getSeatingCapacityAdmin = async () => {
  const query =
    "SELECT * FROM seating_capacity ORDER by country ASC, state ASC, city ASC, campus ASC, floor ASC";
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const createSeatingCapacityAdmin = async (body) => {
  const {
    country,
    state,
    city,
    floor,
    capacity,
    campus,
    isAddingNewCampus,
    isAddingNewCity,
    isAddingNewCountry,
    isAddingNewState,
  } = body;
  const countryId = country
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");
  const stateId = state
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");
  const cityId = city
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");
  const campusId = campus
    .split(" ")
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
    .join(" ");

  const values = [
    country,
    state,
    city,
    campus,
    parseInt(floor),
    parseInt(capacity),
  ];

  const query =
    "INSERT INTO seating_capacity (country,state,city,campus,floor,capacity) VALUES ($1, $2, $3,$4,$5,$6);";
  //  return values
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const updateSeatingCapacityAdmin = async (id, capacity) => {
  const query = `
  UPDATE seating_capacity
  SET capacity = $1
  WHERE id = $2;
`;
  const values = [parseInt(capacity), id];
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const deleteSeatingCapacityAdmin = async (id) => {
  const query = `
  DELETE FROM seating_capacity
  WHERE id = $1
`;
  const values = [id];

  try {
    const res = await pool.query(query, values);
    return res;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const createAllocatedSetsAdmin = async (body) => {
  const { country, state, city, campus, floor, bu, seats, total } = body;
  const values = [
    country,
    state,
    city,
    campus,
    parseInt(floor),
    bu,
    seats,
    total,
  ];
  const query =
    "INSERT INTO seat_allocation (country,state,city,campus,floor,bu_id,seats,total) VALUES ($1, $2, $3,$4,$5,$6,$7::int[],$8);";
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getSeatingCapacityAdminByFilter = async (values) => {
  const query = `SELECT SUM(capacity) FROM seating_capacity where country=$1 and state=$2 and city=$3 and floor=$4 and campus=$5`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getQuery = (type, whereClause) => {
  let query = "";
  if (type == "country") {
    query = ` SELECT country,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country`;
  } else if (type == "state") {
    query = ` SELECT country,state,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state`;
  } else if (type == "city") {
    query = ` SELECT country,state,city,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city`;
  } else if (type == "campus") {
    query = ` SELECT country,state,city,campus,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city,campus`;
  } else if (type == "floor") {
    query = ` SELECT country,state,city,campus,floor,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city,campus,floor`;
  }
  return query;
};
const getQueryCapacity = (type, whereClause) => {
  let query = "";
  if (type == "country") {
    query = ` SELECT country,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country`;
  } else if (type == "state") {
    query = ` SELECT country,state,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state`;
  } else if (type == "city") {
    query = ` SELECT country,state,city,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city`;
  } else if (type == "campus") {
    query = ` SELECT country,state,city,campus,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city,campus`;
  } else if (type == "floor") {
    query = ` SELECT country,state,city,campus,floor,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city,campus,floor`;
  }
  return query;
};
const getAllocatedCount = async (values, whereClause, type) => {
  const query = getQuery(type, whereClause);
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
const getCapacity = async (values, whereClause, type) => {
  const query = getQueryCapacity(type, whereClause);
  if (whereClause == "") {
    values = [];
  }
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
const mergeArrays = (array1, array2, key) => {
  let merged = {};
  // Merge array1 into merged object
  array1.forEach((item) => {
    merged[item[key]] = { ...merged[item[key]], ...item };
  });
  // Merge array2 into merged object
  array2.forEach((item) => {
    let obj = {
      ...item,
      unallocated: merged[item[key]].total - item.allocated,
    };
    merged[item[key]] = { ...merged[item[key]], ...obj };
  });
  // Convert merged object back to array
  let mergedArray = Object.values(merged);

  return mergedArray;
};

const getAllocationForAdminMatrix = async (req) => {
  const { country, state, city, floor, type, campus } = req.query;
  let values = [];
  let whereConditions = [];
  let index = 1;
  if (country) {
    values.push(country);
    whereConditions.push(`LOWER(country) = LOWER($${index})`);
    index++;
  }
  if (state) {
    values.push(state);
    whereConditions.push(`LOWER(state) = LOWER($${index})`);
    index++;
  }
  if (city) {
    values.push(city);
    whereConditions.push(`LOWER(city) = LOWER($${index})`);
    index++;
  }
  if (campus) {
    values.push(campus);
    whereConditions.push(`LOWER(campus) = LOWER($${index})`);
    index++;
  }
  if (floor) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`floor = $${index}`);
    index++;
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const allocatedCount = await getAllocatedCount(values, whereClause, type);
  const totalCapacity = await getCapacity(values, whereClause, type);
  let mergedArray = mergeArrays(totalCapacity, allocatedCount, type);
  return mergedArray;
};
// models.js

const getHOETotalAllocatedQuery = async () => {
  const sql = `select bu_id,SUM(total) as total from seat_allocation WHERE bu_id = $1 group by bu_id`;
  return sql;
};
const getHOETotalAllocatedCount = async (buId) => {
  let values = [buId];
  const query = await getHOETotalAllocatedQuery();
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
const getHOEManagerAllocatedQuery = async (whereClause, type) => {
  let sql = "";
  if (type == "manager") {
    sql = `select hoe_id as bu_id,business_unit,id as manager,first_name,last_name, SUM(array_length(seats_array, 1)) AS allocated  from manager_allocation ${whereClause} group by hoe_id,business_unit,id`;
  } else {
    sql = `select hoe_id as bu_id,business_unit, SUM(array_length(seats_array, 1)) AS allocated  from manager_allocation ${whereClause} group by hoe_id,business_unit`;
  }
  return sql;
};
const getHOEManagerAllocatedCount = async (whereClause, values, type) => {
  const query = await getHOEManagerAllocatedQuery(whereClause, type);
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getAllocationForHOEMatrix = async (req) => {
  const { manager_id, bu_id, type } = req.query;
  let values = [bu_id];
  let index = 1;
  let whereConditions = [`hoe_id = $${index}`];
  if (manager_id && type == "manager") {
    index++;
    values.push(manager_id);
    whereConditions.push(`id = $${index}`);
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const allocatedCount = await getHOETotalAllocatedCount(bu_id);
  const managersCount = await getHOEManagerAllocatedCount(
    whereClause,
    values,
    type
  );
  let mergedArray = mergeArrays(allocatedCount, managersCount, "bu_id");
  return mergedArray;
};

const getBUByFloor = async (req) => {
  const { country, state, city, floor, campus, bu } = req.query;
  let values = [];
  let whereConditions = [];
  let index = 1;
  if (country) {
    values.push(country);
    whereConditions.push(`LOWER(t2.country) = LOWER($${index})`);
    index++;
  }
  if (state) {
    values.push(state);
    whereConditions.push(`LOWER(t2.state) = LOWER($${index})`);
    index++;
  }
  if (city) {
    values.push(city);
    whereConditions.push(`LOWER(t2.city) = LOWER($${index})`);
    index++;
  }
  if (campus) {
    values.push(campus);
    whereConditions.push(`LOWER(t2.campus) = LOWER($${index})`);
    index++;
  }
  if (floor) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`t2.floor = $${index}`);
    index++;
  }
  if (bu) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`t2.bu_id = $${index}`);
    index++;
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const query = `SELECT t1.id as bu_id, t1.name, t1.manager
            FROM business_unit AS t1
            INNER JOIN seat_allocation AS t2
            ON t1.id = t2.bu_id ${whereClause} group by t1.id`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getSeatDataByUser = async (firstName, lastName, bu) => {
  try {
    const query = `
            SELECT ma.first_name, ma.last_name, ma.business_unit,ma.country,ma.state,ma.city, ma.campus,ma.floor, ea.seat_data
            FROM employee_allocation AS ea LEFT JOIN manager_allocation AS ma ON ea.manager_id = ma.id
            WHERE ea.first_name = $1 AND ea.last_name = $2 AND ea.business_unit = $3;
        `;
    const { rows } = await pool.query(query, [firstName, lastName, bu]);
    return rows; // Return seat data array
  } catch (error) {
    console.error("Error fetching seat data:", error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const getHoeIdFromTable = async (bu) => {
  const sql = `SELECT id FROM  business_unit WHERE name=$1`;
  const values = [bu];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getHOEFromTable = async (id) => {
  const sql = `SELECT t1.id, t1.name, t1.manager, t1.role, t2.country, t2.state, t2.city, t2.campus, t2.floor, t2.total, t2.seats
            FROM business_unit AS t1
            INNER JOIN seat_allocation AS t2
            ON t1.id = t2.bu_id
            WHERE t1.id = $1
            ORDER BY t2.id`;
  const values = [id];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getManagersByHOEIdFromTable = async (
  id,
  country,
  state,
  city,
  campus,
  floor
) => {
  const sql =
    "SELECT * FROM manager_allocation WHERE hoe_id = $1 AND country = $2 AND state = $3 AND city = $4 AND campus = $5 AND floor = $6 ORDER BY first_name ASC";
  const values = [id, country, state, city, campus, floor];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const updateManagerData = async (id, seats) => {
  const sql =
    "UPDATE manager_allocation SET seats_data = $1 WHERE id = $2 RETURNING *";
  const values = [seats, id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const addNewManager = async (
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
) => {
  const values1 = [firstName, lastName, businessUnit, team];
  const query1 = `INSERT INTO manager_teams(first_name, last_name, business_unit, team) 
                  VALUES ($1, $2, $3, $4) RETURNING *`;

  try {
    const { rows: resultRows } = await pool.query(query1, values1);
    const teamId = await resultRows[0].id;

    const sql = `INSERT INTO manager_allocation (first_name, last_name, business_unit, country, state, city, campus, floor, seats_data, hoe_id, team_id)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`;
    const values = [
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
      teamId,
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getManagerIdFromTable = async (bu, firstName, lastName) => {
  const sql = `SELECT id FROM  manager_allocation WHERE business_unit =$1 AND first_name = $2 AND last_name =$3`;
  const values = [bu, firstName, lastName];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getManagerFromTable = async (id) => {
  const placeholders = id
    .split(",")
    .map((num, i) => `$${i + 1}`)
    .join(",");

  const sql = `SELECT t1.id, t1.team_id, t1.first_name, t1.last_name, t1.business_unit, t1.campus, t1.floor, t1.seats_data, t1.hoe_id,
               t2.country, t2.state, t2.city, t2.total
               FROM  manager_allocation  AS t1
               INNER JOIN seat_allocation as t2
               on t1.hoe_id = t2.bu_id AND t1.campus = t2.campus AND t1.floor = t2.floor
               WHERE t1.id IN (${placeholders})`;

  const values = id.split(",").map(Number);

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getEmployeesByManagerIdFromTable = async (id) => {
  const placeholders = id
    .split(",")
    .map((num, i) => `$${i + 1}`)
    .join(",");

  const sql = `SELECT * FROM  employee_allocation  WHERE manager_id IN (${placeholders}) ORDER BY first_name`;

  const values = id.split(",").map(Number);

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const updateEmployeeSeatData = async (id, seatData) => {
  const sql =
    "UPDATE employee_allocation SET seat_data = $1 WHERE id = $2 RETURNING *";
  const values = [JSON.stringify(seatData), id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const addNewEmployee = async (
  firstName,
  lastName,
  businessUnit,
  seat_data,
  managerId,
  defaultId
) => {
  const sql = `INSERT INTO employee_allocation (first_name, last_name, business_unit, seat_data, manager_id, team_id)
                VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [
    firstName,
    lastName,
    businessUnit,
    JSON.stringify(seat_data),
    managerId,
    defaultId,
  ];

  try {
    const { rows } = await pool.query(sql, values);
    return rows[0];
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getBuQuery = (whereClause) => {
  let sql = `select sa.bu_id,bu.name as bu_name,sa.country,sa.state,sa.city,sa.campus,sa.floor,SUM(array_length(sa.seats, 1)) as total,SUM(array_length(ma.seats_array, 1)) as allocated,SUM(array_length(sa.seats, 1)) - SUM(array_length(ma.seats_array, 1)) AS unallocated from seat_allocation as sa INNER JOIN manager_allocation as ma ON(sa.bu_id=ma.hoe_id) INNER JOIN business_unit as bu ON(bu.id=ma.hoe_id) ${whereClause}
        group by sa.bu_id,sa.country,sa.state,sa.city,sa.campus,sa.floor,bu.id`;
  return sql;
};
const getAllocatedBuByFloorCount = async (values, whereClause) => {
  const query = getBuQuery(whereClause);
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getAllocationForBUwise = async (req) => {
  const { country, state, city, floor, type, campus, bu_id } = req.query;
  let values = [];
  let whereConditions = [];
  let index = 1;
  if (country) {
    values.push(country);
    whereConditions.push(`LOWER(sa.country) = LOWER($${index})`);
    index++;
  }
  if (state) {
    values.push(state);
    whereConditions.push(`LOWER(sa.state) = LOWER($${index})`);
    index++;
  }
  if (city) {
    values.push(city);
    whereConditions.push(`LOWER(sa.city) = LOWER($${index})`);
    index++;
  }
  if (campus) {
    values.push(campus);
    whereConditions.push(`LOWER(sa.campus) = LOWER($${index})`);
    index++;
  }
  if (floor) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`sa.floor = $${index}`);
    index++;
  }
  if (bu_id) {
    values.push(parseInt(bu_id, 10));
    whereConditions.push(`sa.bu_id = $${index}`);
    index++;
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const allocatedCount = await getAllocatedBuByFloorCount(values, whereClause);
  if (allocatedCount && allocatedCount.length > 0) {
    return allocatedCount;
  } else {
    return [];
  }
};

const getManagersByFloor = async (values) => {
  const query = `select ma.id as manager_id,ma.first_name,ma.last_name,bu.name as bu_name,sa.country,sa.state,sa.city,sa.campus,sa.floor,sa.bu_id,SUM(array_length(sa.seats, 1)) as total,SUM(array_length(ma.seats_array, 1)) as allocated from seat_allocation as sa INNER JOIN manager_allocation as ma ON(sa.bu_id=ma.hoe_id) INNER JOIN business_unit as bu ON(bu.id=ma.hoe_id) WHERE LOWER(sa.country) = LOWER($1) AND LOWER(sa.state) = LOWER($2) AND LOWER(sa.city) = LOWER($3) AND sa.floor = $4 AND LOWER(sa.campus) = LOWER($5) 
 AND sa.bu_id = $6  group by sa.bu_id,sa.country,sa.state,sa.city,sa.campus,sa.floor,bu.id,ma.id`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
const getManagerAllocatedQuery = (whereClause) => {
  let sql = `SELECT
    SUM((ea.seat_data ->> 'Monday')::INT) AS monday,
    SUM((ea.seat_data ->> 'Tuesday')::INT) AS tuesday,
    SUM((ea.seat_data ->> 'Wednesday')::INT) AS wednesday,
    SUM((ea.seat_data ->> 'Thursday')::INT) AS thursday,
    SUM((ea.seat_data ->> 'Friday')::INT) AS friday,
	ma.id,ma.hoe_id,SUM(array_length(seats_array, 1)) AS total,sa.country,sa.state,sa.city,sa.campus,sa.floor,sa.bu_id
FROM employee_allocation as ea INNER JOIN manager_allocation as ma ON(ma.id=ea.manager_id) 
	INNER JOIN seat_allocation as sa ON(sa.bu_id=ma.hoe_id) 
	 ${whereClause}
	group by ea.manager_id,ma.id,sa.bu_id,sa.country,sa.state,sa.city,sa.campus,sa.floor`;
  return sql;
};
const getAllocationByManagerCount = async (values, whereClause) => {
  const query = getManagerAllocatedQuery(whereClause);
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};
const formatDataByDayWise = async (data) => {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

  const result = days.map((day) => ({
    [day]: data[day],
    id: data.id,
    hoe_id: data.hoe_id,
    total: data.total,
    country: data.country,
    state: data.state,
    city: data.city,
    campus: data.campus,
    floor: data.floor,
    bu_id: data.bu_id,
    unallocated: data.total - data[day],
    allocated: data[day],
  }));

  return result;
};
const getAllocationForManagerMatrix = async (req) => {
  const { country, state, city, floor, campus, bu_id, manager_id } = req.query;
  let values = [];
  let whereConditions = [];
  let index = 1;
  if (country) {
    values.push(country);
    whereConditions.push(`LOWER(sa.country) = LOWER($${index})`);
    index++;
  }
  if (state) {
    values.push(state);
    whereConditions.push(`LOWER(sa.state) = LOWER($${index})`);
    index++;
  }
  if (city) {
    values.push(city);
    whereConditions.push(`LOWER(sa.city) = LOWER($${index})`);
    index++;
  }
  if (campus) {
    values.push(campus);
    whereConditions.push(`LOWER(sa.campus) = LOWER($${index})`);
    index++;
  }
  if (floor) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`sa.floor = $${index}`);
    index++;
  }
  if (bu_id) {
    values.push(parseInt(bu_id, 10));
    whereConditions.push(`sa.bu_id = $${index}`);
    index++;
  }
  if (manager_id) {
    values.push(parseInt(manager_id, 10));
    whereConditions.push(`ma.id = $${index}`);
    index++;
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const dayWiseData = await getAllocationByManagerCount(values, whereClause);
  if (dayWiseData && dayWiseData.length > 0) {
    const formattedData = formatDataByDayWise(dayWiseData[0]);
    return formattedData;
  } else {
    return [];
  }
};

const getTransportMetrix = async (req) => {
  const { country, city, state, floor, campus, bu_id, manager_id } = req.query;
  let values = [];
  let whereConditions = [];
  let index = 1;
  if (country) {
    values.push(country);
    whereConditions.push(`LOWER(sa.country) = LOWER($${index})`);
    index++;
  }
  if (state) {
    values.push(state);
    whereConditions.push(`LOWER(sa.state) = LOWER($${index})`);
    index++;
  }
  if (city) {
    values.push(city);
    whereConditions.push(`LOWER(sa.city) = LOWER($${index})`);
    index++;
  }
  if (campus) {
    values.push(campus);
    whereConditions.push(`LOWER(sa.campus) = LOWER($${index})`);
    index++;
  }
  if (floor) {
    values.push(parseInt(floor, 10));
    whereConditions.push(`sa.floor = $${index}`);
    index++;
  }
  if (bu_id) {
    values.push(parseInt(bu_id, 10));
    whereConditions.push(`sa.bu_id = $${index}`);
    index++;
  }
  if (manager_id) {
    values.push(parseInt(manager_id, 10));
    whereConditions.push(`ma.id = $${index}`);
    index++;
  }
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const query = `select  u.transport,
  COUNT(u.id) AS transport_count from users as u INNER JOIN employee_allocation as ea ON(ea.id=u.id) INNER JOIN manager_allocation as ma ON(ma.id=ea.manager_id) 
	INNER JOIN seat_allocation as sa ON(sa.bu_id=ma.hoe_id) 
	${whereClause}
	group by u.transport`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getFloorConfiguration = async (country, state, city, campus, floor) => {
  const sql =
    "SELECT * FROM seating_capacity WHERE country = $1 AND state = $2 AND city = $3 AND campus = $4 AND floor = $5";
  const values = [country, state, city, campus, floor];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getDetailsBeforeAllocation = async (
  country,
  state,
  city,
  campus,
  floor,
  businessId
) => {
  const sql =
    "SELECT * FROM seat_allocation WHERE country = $1 AND state = $2 AND city = $3 AND campus = $4 AND floor = $5 AND bu_id = $6";
  const values = [country, state, city, campus, floor, businessId];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const updateToSameRow = async (
  country,
  state,
  city,
  campus,
  floor,
  bu,
  seats
) => {
  const sql =
    "UPDATE seat_allocation SET seats = $7  WHERE country = $1 AND state = $2 AND city = $3 AND campus = $4 AND floor = $5 AND bu_id = $6";
  const values = [country, state, city, campus, floor, bu, seats];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const removeSeatsForHOE = async (
  country,
  state,
  city,
  campus,
  floor,
  businessId
) => {
  const sql = `UPDATE seat_allocation SET seats = '{}' WHERE country=$1 AND state=$2 AND city=$3 AND campus=$4 AND floor=$5 AND bu_id=$6`;
  const values = [country, state, city, campus, floor, businessId];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

//Graphs
const getManagerAllocationData = async (hoeId) => {
  try {
    const sql = `
WITH manager_seats AS (
    SELECT 
        ma.id,
        ma.first_name,
        ma.last_name,
        ma.business_unit,
        ma.country,
        ma.state,
        ma.city,
        ma.campus,
        ma.floor,
        ma.team_id,  -- Include team_id from manager_allocation
        mt.team,  -- Join to get team name from manager_teams
        ma.seats_data::jsonb AS seats_data,
        ma.hoe_id
    FROM 
        manager_allocation ma
    LEFT JOIN manager_teams mt ON ma.team_id = mt.id  -- Joining manager_teams based on team_id
    WHERE 
        ma.hoe_id = $1
    UNION ALL
    SELECT 
        NULL AS id,
        '' AS first_name,
        '' AS last_name,
        '' AS business_unit,
        country,
        state,
        city,
        campus,
        floor,
        NULL AS team_id,
        '' AS team,
        '{}'::jsonb AS seats_data,
        $1 AS hoe_id
    FROM
        seat_allocation
    WHERE NOT EXISTS (
        SELECT 1 
        FROM manager_allocation 
        WHERE 
            country = seat_allocation.country 
            AND state = seat_allocation.state
            AND city = seat_allocation.city 
            AND campus = seat_allocation.campus 
            AND floor = seat_allocation.floor
            AND hoe_id = $1
    )
)
SELECT 
    ms.id,
    ms.first_name,
    ms.last_name,
    ms.business_unit,
    ms.country,
    ms.state,
    ms.city,
    ms.campus,
    ms.floor,
    ms.team_id,  -- Team ID now included in result
    ms.team,  -- Team name now included in result
    COALESCE(ms.seats_data, '{}'::jsonb) AS seats_data,
    ms.hoe_id,
    COALESCE(array_agg(DISTINCT sa.seat), '{}') AS allocated_seats
FROM 
    manager_seats ms
LEFT JOIN (
    SELECT 
        country,
        state,
        city,
        campus,
        floor,
        bu_id,
        unnest(seats) AS seat
    FROM 
        seat_allocation
) sa
ON 
    ms.country = sa.country
    AND ms.state = sa.state
    AND ms.city = sa.city
    AND ms.campus = sa.campus
    AND ms.floor = sa.floor
    AND ms.hoe_id = sa.bu_id
WHERE 
    ms.hoe_id = $1
GROUP BY 
    ms.id,
    ms.first_name,
    ms.last_name,
    ms.business_unit,
    ms.country,
    ms.state,
    ms.city,
    ms.campus,
    ms.floor,
    ms.team_id,  -- Ensure correct grouping with team_id
    ms.team,  -- Ensure correct grouping with team name
    ms.seats_data,
    ms.hoe_id
ORDER BY
    ms.country ASC,
    ms.state ASC,
    ms.city ASC,
    ms.campus ASC,
    ms.floor ASC,
    ms.first_name;
    `;
    const values = [hoeId];
    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getSeatAllocationData = async () => {
  try {
    const query = `
SELECT
    sc.country,
    sc.state,
    sc.city,
    sc.campus,
    sc.floor,
    sc.capacity AS total,
    COALESCE(array_agg(sa.seat), '{}') AS allocated_seats
FROM
    seating_capacity sc
LEFT JOIN (
    SELECT
        country,
        state,
        city,
        campus,
        floor,
        total,
        unnest(seats) AS seat
    FROM
        seat_allocation
) sa ON sc.country = sa.country
   AND sc.state = sa.state
   AND sc.city = sa.city
   AND sc.campus = sa.campus
   AND sc.floor = sa.floor
GROUP BY
    sc.country,
    sc.state,
    sc.city,
    sc.campus,
    sc.floor,
    sc.capacity,
    sa.total
ORDER BY
    sc.country ASC,
    sc.state ASC,
    sc.city ASC,
    sc.campus ASC,
    sc.floor ASC;
    `;
    const { rows } = await pool.query(query);
    return rows; // Return rows with seat allocation data
  } catch (error) {
    console.error("Error fetching seat allocation data:", error);
    throw error; // Propagate the error
  }
};

const getSeatingCapacityData = async () => {
  try {
    const query = `SELECT * FROM seating_capacity`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error("Error fetching seating capacity data");
  }
};

const getManagerIdForGraph = async (bu, firstName, lastName) => {
  try {
    const sql = `
    SELECT
        ma.id,
        mt.team
    FROM
        manager_allocation ma
    LEFT JOIN manager_teams mt ON ma.team_id = mt.id
    WHERE ma.business_unit = $1 AND ma.first_name = $2 AND ma.last_name = $3
    `;
    const values = [bu, firstName, lastName];
    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const getGraphDetailsForManager = async (managerId) => {
  if (!Array.isArray(managerId) || managerId.length === 0) {
    throw new Error("managerId must be a non-empty array");
  }

  const placeholders = managerId.map((_, i) => `$${i + 1}`).join(",");
  const values = managerId.map(Number);

  try {
    const sql = `
WITH seat_data AS (
    SELECT
        manager_id,
        jsonb_each_text(seat_data::jsonb) AS seat_info
    FROM
        employee_allocation
    WHERE
        manager_id IN (${placeholders})
),
seats_per_day AS (
    SELECT
        manager_id,
        (seat_info).key AS day,
        (seat_info).value::INT AS seat
    FROM
        seat_data
    WHERE
        (seat_info).value != 'WFH'
),
all_days AS (
    SELECT unnest(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) AS day
),
manager_info AS (
    SELECT
        ma.id,
        ma.first_name,
        ma.last_name,
        ma.business_unit,
        ma.country,
        ma.state,
        ma.city,
        ma.campus,
        ma.floor,
        ma.seats_data::jsonb,
        ma.hoe_id,
        mt.team
    FROM
        manager_allocation ma
    LEFT JOIN manager_teams mt ON ma.team_id = mt.id
    WHERE
        ma.id IN (${placeholders})
)
SELECT
    ad.day,
    mi.id AS manager_id,
    mi.first_name AS manager_first_name,
    mi.last_name AS manager_last_name,
    mi.business_unit AS manager_business_unit,
    mi.country,
    mi.state,
    mi.city,
    mi.campus,
    mi.floor,
    mi.team AS manager_team,
    COALESCE(mi.seats_data, '{}') AS manager_seats,
    COALESCE(array_agg(DISTINCT spd.seat), '{}') AS occupied_seats
FROM
    manager_info mi
CROSS JOIN all_days ad
LEFT JOIN seats_per_day spd
ON
    mi.id = spd.manager_id
    AND ad.day = spd.day
GROUP BY
    ad.day,
    mi.id,
    mi.first_name,
    mi.last_name,
    mi.business_unit,
    mi.country,
    mi.state,
    mi.city,
    mi.campus,
    mi.floor,
    mi.team,
    mi.seats_data,
    mi.hoe_id
ORDER BY
    CASE ad.day
        WHEN 'Monday' THEN 1
        WHEN 'Tuesday' THEN 2
        WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4
        WHEN 'Friday' THEN 5
        ELSE 6
    END,
    mi.country ASC,
    mi.state ASC,
    mi.city ASC,
    mi.campus ASC,
    mi.floor ASC;
    `;

    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// Function to update user password using a callback
const updateUserPassword = (email, newPassword, callback) => {
  const sql = "UPDATE users SET password = $1 WHERE email = $2";
  const values = [newPassword, email];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

const countries = async () => {
  try {
    const query = `
            SELECT DISTINCT country FROM seating_capacity ORDER BY country ASC
        `;
    const { rows } = await pool.query(query);
    return rows; // Return seat data array
  } catch (error) {
    console.error("Error fetching seat data:", error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const states = async () => {
  try {
    const query = `
            SELECT DISTINCT state, country FROM seating_capacity ORDER BY state ASC
        `;
    const { rows } = await pool.query(query);
    return rows; // Return seat data array
  } catch (error) {
    console.error("Error fetching seat data:", error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const cities = async () => {
  try {
    const query = `
            SELECT DISTINCT city, state FROM seating_capacity ORDER BY city ASC
        `;
    const { rows } = await pool.query(query);
    return rows; // Return seat data array
  } catch (error) {
    console.error("Error fetching seat data:", error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const campuses = async () => {
  try {
    const query = `
            SELECT DISTINCT campus, city FROM seating_capacity ORDER BY campus ASC
        `;
    const { rows } = await pool.query(query);
    return rows; // Return seat data array
  } catch (error) {
    console.error("Error fetching seat data:", error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const searchCountry = async (country) => {
  const values = [country];
  const query = `SELECT * FROM seating_capacity where country=$1`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const searchState = async (state) => {
  const values = [state];
  const query = `SELECT * FROM seating_capacity where state=$1`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const searchCity = async (city) => {
  const values = [city];
  const query = `SELECT * FROM seating_capacity where city=$1`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const searchCampus = async (campus) => {
  const values = [campus];
  const query = `SELECT * FROM seating_capacity where campus=$1`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const getManagerTeamsFromTable = async (bu, firstName, lastName) => {
  const sql = `SELECT id, team FROM  manager_teams WHERE business_unit =$1 AND first_name = $2 AND last_name =$3 ORDER BY team ASC`;
  const values = [bu, firstName, lastName];

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const searchTeam = async (team, firstName, lastName, bu) => {
  const values = [team, firstName, lastName, bu];
  const query = `SELECT * FROM manager_teams where team=$1 AND first_name=$2 AND last_name=$3 AND business_unit=$4`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const addTeam = async (
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
) => {
  const values1 = [team, firstName, lastName, bu];
  const values2 = [firstName, lastName, bu];

  const query1 = `INSERT INTO manager_teams(first_name, last_name, business_unit, team) VALUES($2, $3, $4, $1) RETURNING *`;
  const query2 = `SELECT * FROM manager_teams WHERE first_name=$1 AND last_name=$2 AND business_unit=$3 ORDER BY team ASC`;

  try {
    const { rows: result } = await pool.query(query1, values1);

    const seats = {
      Friday: [],
      Monday: [],
      Tuesday: [],
      Thursday: [],
      Wednesday: [],
    };
    const values3 = [
      firstName,
      lastName,
      bu,
      country,
      state,
      city,
      campus,
      floor,
      seats,
      hoeId,
      result[0].id,
    ];
    const query3 = `INSERT INTO manager_allocation(first_name, last_name, business_unit, country, state, city, campus, floor, seats_data, hoe_id, team_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

    await pool.query(query3, values3);

    const { rows } = await pool.query(query2, values2);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const deleteTeam = async (id, defaultId, managerId) => {
  const query1 = `UPDATE employee_allocation SET team_id=$2, manager_id=$3, seat_data='{"Monday" : "WFH", "Tuesday" : "WFH", "Wednesday" : "WFH", "Thursday" : "WFH", "Friday" : "WFH"}' where team_id=$1`;
  const query2 = `DELETE FROM manager_allocation where team_id=$1`;
  const query3 = `DELETE FROM manager_teams WHERE id = $1`;

  const values1 = [id, defaultId, managerId];

  const values = [id];

  try {
    await pool.query(query1, values1);
    await pool.query(query2, values);
    await pool.query(query3, values);
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const editTeam = async (id, name, firstName, lastName, bu) => {
  const values1 = [id, name];
  const values2 = [firstName, lastName, bu];
  const query1 = `UPDATE manager_teams SET team=$2 WHERE id=$1`;
  const query2 = `SELECT * from manager_teams WHERE first_name=$1 AND last_name=$2 AND business_unit=$3 ORDER BY team ASC`;
  try {
    await pool.query(query1, values1);
    const { rows } = await pool.query(query2, values2);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const assignEmployeeToTeam = async (id, teamId, mngId, managerIds) => {
  const values = [mngId];
  const values2 = [id, teamId, mngId];
  const placeholders = managerIds.map((num, i) => `$${i + 1}`).join(",");
  const values1 = managerIds;
  const query2 = `UPDATE employee_allocation SET team_id=$2, manager_id=$3, seat_data='{"Monday" : "WFH", "Tuesday" : "WFH", "Wednesday" : "WFH", "Thursday" : "WFH", "Friday" : "WFH"}' WHERE id=$1`;
  const query1 = `SELECT * from employee_allocation WHERE manager_id IN (${placeholders}) ORDER BY first_name ASC`;
  try {
    await pool.query(query2, values2);
    const { rows } = await pool.query(query1, values1);
    return rows;
  } catch (err) {
    console.error("Error executing query", err);
    throw err;
  }
};

const deleteEmployeeFromTeam = async (id, managerId, defaultId, managerIds) => {
  const placeholders = managerIds.map((num, i) => `$${i + 1}`).join(",");

  const query = `UPDATE employee_allocation SET team_id=$2, manager_id=$3, seat_data='{"Monday" : "WFH", "Tuesday" : "WFH", "Wednesday" : "WFH", "Thursday" : "WFH", "Friday" : "WFH"}' where id=$1`;
  const query1 = `SELECT * FROM employee_allocation where manager_id IN (${placeholders}) ORDER BY first_name`;

  const values = [id, defaultId, managerId];
  const values1 = managerIds;

  try {
    await pool.query(query, values);
    const { rows } = await pool.query(query1, values1);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const getTeams = async (bu) => {
  const query =
    "SELECT * FROM manager_teams WHERE business_unit = $1 ORDER BY team ASC";
  const values = [bu];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

// ////////////////////////////////////////////////////////////////////////////////////////////////
const getManagerSeatAllocations = async () => {
  const query = `SELECT * FROM manager_seat_allocations`;
  const result = await pool.query(query);
  return result.rows;
};

const getManagerTeams = async () => {
  const result = await pool.query(`
    SELECT manager_allocation.first_name, COUNT(employee_allocation.id) AS team_size
    FROM manager_allocation
    JOIN employee_allocation ON manager_allocation.id = employee_allocation.manager_id
    GROUP BY manager_allocation.first_name;
  `);
  return result.rows;
};

const saveSeatingArrangement = async (allocations) => {
  const { allocationName, schedule, teams, daysRequired } = allocations;

  try {
    const client = await pool.connect();
    try {
      // ✅ Step 1: Check if allocation name already exists
      const checkRes = await client.query(
        "SELECT COUNT(*) FROM manager_seat_allocations WHERE seating_allocation_name = $1",
        [allocationName]
      );

      if (parseInt(checkRes.rows[0].count) > 0) {
        throw new Error("Seating arrangement name already exists.");
      }

      await client.query("BEGIN");

      let insertedRows = [];

      for (const teamName in schedule) {
        const allocatedDays = schedule[teamName];
        const teamSize = teams[teamName];

        const managerRes = await client.query(
          "SELECT id FROM manager_allocation WHERE first_name = $1",
          [teamName]
        );

        if (managerRes.rowCount === 0) {
          throw new Error(`No manager found for team ${teamName}`);
        }

        const managerId = managerRes.rows[0].id;

        const sql = `INSERT INTO manager_seat_allocations 
          (manager_id, team_name, team_size, required_days, seating_allocation_name, allocated_days)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

        const values = [
          managerId,
          teamName,
          teamSize,
          parseInt(daysRequired),
          allocationName,
          allocatedDays.join(","),
        ];

        const { rows } = await client.query(sql, values);
        insertedRows.push(rows[0]);
      }

      await client.query("COMMIT");
      return insertedRows;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Transaction error in saveSeatingArrangement:", err);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error acquiring client in saveSeatingArrangement:", err);
    throw err;
  }
};

const getSeatingAllocationNames = async () => {
  const query = `SELECT DISTINCT seating_allocation_name FROM manager_seat_allocations ORDER BY seating_allocation_name;`;
  const { rows } = await pool.query(query);
  return rows.map((row) => row.seating_allocation_name);
};

// 2. Get seating arrangement details by allocation name
const getSeatingArrangementByName = async (allocationName) => {
  const query = `
    SELECT 
      m.first_name,
      msa.team_name,
      msa.allocated_days
    FROM manager_seat_allocations msa
    JOIN manager_allocation m ON msa.manager_id = m.id
    WHERE msa.seating_allocation_name = $1;
  `;
  const { rows } = await pool.query(query, [allocationName]);
  return rows;
};

// 3. Delete all records for a given seating allocation name
const deleteSeatingArrangement = async (allocationName) => {
  const query = `DELETE FROM manager_seat_allocations WHERE seating_allocation_name = $1;`;
  const result = await pool.query(query, [allocationName]);
  return result.rowCount;
};

///////////////////////////////////////////////////////

/// FreeSeats (seat pool)

const getAvailableSeats = async (country, state, city, campus, floor, day) => {
  const query = `
      WITH total_seats AS (
          SELECT capacity 
          FROM seating_capacity 
          WHERE country = $1 
            AND state = $2 
            AND city = $3 
            AND campus = $4 
            AND floor = $5
      ),
      allocated_manager_seats AS (
          SELECT DISTINCT seat_number::int
          FROM manager_allocation,
              LATERAL jsonb_array_elements_text(seats_data::jsonb -> $6) AS seat_number
          WHERE country = $1 
            AND state = $2 
            AND city = $3 
            AND campus = $4 
            AND floor = $5
      ),
      allocated_employee_seats AS (
          SELECT DISTINCT 
              CASE 
                  WHEN ea.seat_data ->> $6 ~ '^[0-9]+$' 
                  THEN (ea.seat_data ->> $6)::int 
              END AS seat_number
          FROM employee_allocation ea
          JOIN manager_allocation ma ON ea.manager_id = ma.id  
          WHERE ma.country = $1 
            AND ma.state = $2 
            AND ma.city = $3 
            AND ma.campus = $4 
            AND ma.floor = $5
            AND (ea.seat_data ->> $6) IS NOT NULL
            AND (ea.seat_data ->> $6) != 'WFH' 
      ),
      all_allocated_seats AS (
          SELECT seat_number FROM allocated_manager_seats
          UNION 
          SELECT seat_number FROM allocated_employee_seats
      ),
      free_seats AS (
          SELECT seat_number 
          FROM generate_series(1, (SELECT capacity FROM total_seats)) AS seat_number
          WHERE seat_number NOT IN (SELECT seat_number FROM all_allocated_seats)
      )
      SELECT seat_number FROM free_seats ORDER BY seat_number;
  `;

  const values = [country, state, city, campus, floor, day];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error("Error fetching available seats:", err);
    throw err;
  }
};

const saveSelectedSeat = async ({
  first_name,
  last_name,
  seat_number,
  country,
  state,
  city,
  campus,
  floor,
  day,
}) => {
  // Step 1: Check if employee already booked a seat for the same day
  const checkQuery = `
    SELECT * FROM employee_selected_seats 
    WHERE first_name = $1 AND last_name = $2 AND day = $3
  `;
  const checkValues = [first_name, last_name, day];
  const existing = await pool.query(checkQuery, checkValues);

  if (existing.rows.length > 0) {
    const existingBooking = existing.rows[0];
    throw {
      code: "ALREADY_BOOKED",
      message: `You already booked a seat on ${existingBooking.campus}, floor ${existingBooking.floor} for ${day}.`,
    };
  }

  // Step 2: Proceed with insert
  const insertQuery = `
    INSERT INTO employee_selected_seats 
    (first_name, last_name, seat_number, country, state, city, campus, floor, day)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [
    first_name,
    last_name,
    seat_number,
    country,
    state,
    city,
    campus,
    floor,
    day,
  ];

  try {
    const { rows } = await pool.query(insertQuery, values);
    return rows[0];
  } catch (error) {
    throw error; // forward to controller
  }
};

const getSeatsFromEmployeeSelected = async (
  country,
  state,
  city,
  campus,
  floor,
  day
) => {
  const query = `
    SELECT DISTINCT seat_number 
    FROM employee_selected_seats 
    WHERE country = $1 AND state = $2 AND city = $3 
      AND campus = $4 AND floor = $5 AND day = $6
  `;
  const values = [country, state, city, campus, floor, day];

  try {
    const { rows } = await pool.query(query, values);
    return rows.map((row) => row.seat_number);
  } catch (error) {
    console.error("Error fetching seats from employee_selected_seats:", error);
    throw error;
  }
};

const getSeatsBookedByUser = async (
  first_name,
  last_name,
  country,
  state,
  city,
  campus,
  floor,
  day
) => {
  const query = `
    SELECT seat_number 
    FROM employee_selected_seats 
    WHERE first_name = $1 AND last_name = $2 
      AND country = $3 AND state = $4 AND city = $5 
      AND campus = $6 AND floor = $7 AND day = $8
  `;
  const values = [
    first_name,
    last_name,
    country,
    state,
    city,
    campus,
    floor,
    day,
  ];

  const { rows } = await pool.query(query, values);
  return rows.map((row) => row.seat_number);
};

const fetchSelectedSeatsByEmployee = async (firstName, lastName) => {
  const query = `
    SELECT * FROM employee_selected_seats
    WHERE first_name = $1 AND last_name = $2
  `;
  const result = await pool.query(query, [firstName, lastName]);
  return result.rows;
};

// Remove a selected seat by day
const removeSelectedSeat = async (firstName, lastName, day) => {
  const query = `
    DELETE FROM employee_selected_seats
    WHERE first_name = $1 AND last_name = $2 AND day = $3
  `;
  await pool.query(query, [firstName, lastName, day]);
};

const insertNoShow = async (
  firstName,
  lastName,
  seatNumber,
  country,
  state,
  city,
  campus,
  floor,
  day
) => {
  try {
    const query = `
      INSERT INTO no_show_seats (
        first_name, last_name, seat_number, country, state, city, campus, floor, day
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;
    await pool.query(query, [
      firstName,
      lastName,
      seatNumber,
      country,
      state,
      city,
      campus,
      floor,
      day,
    ]);
  } catch (error) {
    console.error("Error inserting No Show data:", error);
    throw error;
  }
};

const getFilteredNoShowSeats = async ({
  country,
  state,
  city,
  campus,
  floor,
  day,
}) => {
  const query = `
    SELECT * FROM no_show_seats 
    WHERE country = $1 AND state = $2 AND city = $3 
    AND campus = $4 AND floor = $5 AND day = $6
  `;

  const values = [country, state, city, campus, floor, day];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Error fetching filtered no-show seats:", err);
    throw err;
  }
};

const logSeatAction = async ({
  firstName,
  lastName,
  seatNumber,
  country,
  state,
  city,
  campus,
  floor,
  day,
  action,
}) => {
  const query = `
    INSERT INTO seat_actions
    (first_name, last_name, seat_number, country, state, city, campus, floor, day, action)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *;
  `;
  const values = [
    firstName,
    lastName,
    seatNumber,
    country,
    state,
    city,
    campus,
    floor,
    day,
    action,
  ];
  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  insertUser,
  findUserByEmail,
  getBu,
  getAllocatedSetsAdmin,
  getSeatingCapacityAdminByFilter,
  createAllocatedSetsAdmin,
  deleteSeatingCapacityAdmin,
  updateSeatingCapacityAdmin,
  createSeatingCapacityAdmin,
  getSeatingCapacityAdmin,
  getAllocationForHOEMatrix,
  getBUByFloor,
  getSeatDataByUser,
  getHoeIdFromTable,
  getHOEFromTable,
  getManagersByHOEIdFromTable,
  updateManagerData,
  addNewManager,
  getManagerIdFromTable,
  getManagerFromTable,
  getEmployeesByManagerIdFromTable,
  updateEmployeeSeatData,
  addNewEmployee,
  getAllocationForBUwise,
  getAllocationForAdminMatrix,
  getManagersByFloor,
  getAllocationForManagerMatrix,
  getTransportMetrix,
  getFloorConfiguration,
  getDetailsBeforeAllocation,
  updateToSameRow,
  removeSeatsForHOE,
  getManagerAllocationData,
  getSeatAllocationData,
  getSeatingCapacityData,
  getManagerIdForGraph,
  getGraphDetailsForManager,
  updateUserPassword,
  countries,
  states,
  cities,
  campuses,
  searchCountry,
  searchState,
  searchCity,
  searchCampus,
  getManagerTeamsFromTable,
  searchTeam,
  addTeam,
  deleteTeam,
  editTeam,
  assignEmployeeToTeam,
  deleteEmployeeFromTeam,
  getTeams,
  getManagerSeatAllocations,
  saveSeatingArrangement,
  getSeatingAllocationNames,
  getSeatingArrangementByName,
  deleteSeatingArrangement,
  getManagerTeams,
  getAvailableSeats,
  saveSelectedSeat,
  getSeatsFromEmployeeSelected,
  getSeatsBookedByUser,
  fetchSelectedSeatsByEmployee,
  removeSelectedSeat,
  insertNoShow,
  getFilteredNoShowSeats,
  logSeatAction,
};
