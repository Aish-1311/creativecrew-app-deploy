const pool = require('./db');

const insertUser = (firstName, lastName, email, password, role, bu, transport, callback) => {
  const sql = "INSERT INTO users (first_name, last_name, email, password, bu, transport, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
  const values = [firstName, lastName, email, password, bu, transport, role];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows[0]);
  });
};

const findUserByEmailAndPassword = (email, password, callback) => {
  const sql = 'SELECT * FROM users WHERE email = $1 AND password = $2';
  const values = [email, password];
  pool.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.rows);
  });
};

const getBu = async () => {
  const query = 'SELECT * FROM business_unit';
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

const getAllocatedSetsAdmin = async () => {
  const query = 'SELECT * FROM seat_allocation';
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

const getSeatingCapacityAdmin = async () => {
  const query = 'SELECT * FROM seating_capacity';
  const values = [];

  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

const createSeatingCapacityAdmin = async (body) => {
  const { country, state, city, floor, capacity, campus } = body
  const values = [country, state, city, campus, parseInt(floor), parseInt(capacity)]
  const query = 'INSERT INTO seating_capacity (country,state,city,campus,floor,capacity) VALUES ($1, $2, $3,$4,$5,$6);';
  //  return values
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

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
    console.error('Error executing query', err);
    throw err;
  }
}

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
    console.error('Error executing query:', error);
    throw error;
  }
}

const createAllocatedSetsAdmin = async (body) => {
  const { country, state, city, campus, floor, bu, seats } = body
  const values = [country, state, city, campus, parseInt(floor), bu, seats, seats.length > 0 ? seats.length : 0]
  const query = 'INSERT INTO seat_allocation (country,state,city,campus,floor,bu_id,seats,total) VALUES ($1, $2, $3,$4,$5,$6,$7::int[],$8);';
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

const getSeatingCapacityAdminByFilter = async (values) => {
  const query = `SELECT SUM(capacity) FROM seating_capacity where country=$1 and state=$2 and city=$3 and floor=$4`;
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

const getQuery = (type, whereClause) => {
  let query = ""
  if (type == "country") {
    query = ` SELECT country,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country`
  } else if (type == "state") {
    query = ` SELECT country,state,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state`
  } else if (type == "city") {
    query = ` SELECT country,state,city,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city`;
  }else if (type == "campus") {
    query = ` SELECT country,state,city,campus,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city,campus`;
  } else if (type == "floor") {
    query = ` SELECT country,state,city,campus,floor,SUM(total) as allocated FROM seat_allocation ${whereClause}  GROUP BY country, state,city,campus,floor`;
  }
  return query;
}
const getQueryCapacity = (type, whereClause) => {
  let query = ""
  if (type == "country") {
    query = ` SELECT country,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country`;
  } else if (type == "state") {
    query = ` SELECT country,state,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state`;

  } else if (type == "city") {
    query = ` SELECT country,state,city,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city`;

  }else if (type == "campus") {
    query = ` SELECT country,state,city,campus,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city,campus`;

  } else if (type == "floor") {
    query = ` SELECT country,state,city,campus,floor,SUM(capacity) as total FROM seating_capacity ${whereClause}  GROUP BY country, state,city,campus,floor`;

  }
  return query;
}
const getAllocatedCount = async (values, whereClause, type) => {
  const query = getQuery(type, whereClause)
  try {
    const { rows } = await pool.query(query, values);
    console.log(rows)
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}
const getCapacity = async (values, whereClause, type) => {
  const query = getQueryCapacity(type, whereClause);
  if (whereClause == "") {
    values = []
  }
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}
const mergeArrays = (array1, array2, key) => {
  let merged = {};
  // Merge array1 into merged object
  array1.forEach(item => {
    merged[item[key]] = { ...merged[item[key]], ...item };
  });
  // Merge array2 into merged object
  array2.forEach(item => {
    let obj = { ...item, unallocated: merged[item[key]].total - item.allocated }
    merged[item[key]] = { ...merged[item[key]], ...obj };
  });
  // Convert merged object back to array
  let mergedArray = Object.values(merged);

  return mergedArray;
}

const getAllocationForAdminMatrix=async(req)=>{ 
    const { country, state, city, floor,type,campus} = req.query;
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
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      const allocatedCount = await getAllocatedCount(values,whereClause,type);
      const totalCapacity = await getCapacity(values,whereClause,type);
      let mergedArray = mergeArrays(totalCapacity, allocatedCount, type);
      return mergedArray;  
    }
// models.js




const getHOETotalAllocatedQuery = async () => {
  const sql = `select bu_id,SUM(total) as total from seat_allocation WHERE bu_id = $1 group by bu_id`;
  return sql;
}
const getHOETotalAllocatedCount = async (buId) => {
  let values = [buId];
  const query = await getHOETotalAllocatedQuery()
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}
const getHOEManagerAllocatedQuery = async (whereClause, type) => {
  let sql = ''
  if (type == "manager") {
    sql = `select hoe_id as bu_id,business_unit,id as manager,first_name,last_name, SUM(array_length(seats_array, 1)) AS allocated  from manager_allocation ${whereClause} group by hoe_id,business_unit,id`;
  } else {
    sql = `select hoe_id as bu_id,business_unit, SUM(array_length(seats_array, 1)) AS allocated  from manager_allocation ${whereClause} group by hoe_id,business_unit`;

  }
  return sql;
}
const getHOEManagerAllocatedCount = async (whereClause, values, type) => {
  const query = await getHOEManagerAllocatedQuery(whereClause, type);
  console.log(query, "query", values)
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
}

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
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  const allocatedCount = await getHOETotalAllocatedCount(bu_id);
  const managersCount = await getHOEManagerAllocatedCount(whereClause, values, type);
    let mergedArray = mergeArrays(allocatedCount, managersCount, "bu_id");
    return mergedArray;
}

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
    console.error('Error executing query', err);
    throw err;
  }
}


const getSeatDataByUser = async (firstName, lastName) => {
  try {
    const query = `
            SELECT seat_data, manager_name, floor, bu, campus
            FROM employee_details
            WHERE first_name = $1 AND last_name = $2;
        `;
    const { rows } = await pool.query(query, [firstName, lastName]);
    return rows; // Return seat data array
  } catch (error) {
    console.error('Error fetching seat data:', error);
    throw error; // Propagate the error to be handled in the controller
  }
};

const getHOEFromTable = async (id) => {
  const sql = `SELECT t1.id, t1.name, t1.manager, t1.role, t2.country, t2.state, t2.city, t2.campus, t2.floor, t2.total, t2.seats
            FROM business_unit AS t1
            INNER JOIN seat_allocation AS t2
            ON t1.id = t2.bu_id
            WHERE t1.id = $1`;
  const values = [id];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const getManagersByHOEIdFromTable = async (id, country, state, city, campus, floor) => {
  const sql = 'SELECT * FROM manager_allocation WHERE hoe_id = $1 AND country = $2 AND state = $3 AND city = $4 AND campus = $5 AND floor = $6 ORDER BY seats_array[1]';
  const values = [id, country, state, city, campus, floor];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log(rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const updateManagerData = async (id, seats) => {
  const sql = 'UPDATE manager_allocation SET seats_array = $1 WHERE id = $2';
  const values = [seats, id];

  try {
    const result = await pool.query(sql, values);
    return result;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const getManagerFromTable = async (id) => {
  const sql = `SELECT t1.first_name, t1.last_name, t1.business_unit, t1.campus, t1.floor, t1.seats_array, t1.hoe_id,
               t2.country, t2.state, t2.city, t2.total
               FROM  manager_allocation  AS t1
               INNER JOIN seat_allocation as t2
               on t1.hoe_id = t2.bu_id AND t1.campus = t2.campus AND t1.floor = t2.floor
               WHERE t1.id =$1`;
  const values = [id];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log("this is from getEmployess",rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

const getEmployeesByManagerIdFromTable = async (id) => {
  const sql = 'SELECT * FROM  employee_allocation  WHERE manager_id =$1 ORDER BY id';
  const values = [id];

  try {
    const { rows } = await pool.query(sql, values);
    //console.log("getEmployess",rows);
    return rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};


const updateEmployeeSeatData = async (id, seatData) => {
  const sql = 'UPDATE employee_allocation SET seat_data = $1 WHERE id = $2'
  const values = [JSON.stringify(seatData), id];
  // console.log("seatData", seatData);
  // console.log("id", id);

  try {
    const result = await pool.query(sql, values);
    return result;

  } catch (err) {
    console.error('Error executing query', err);
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
    const allocatedCount = await getAllocatedBuByFloorCount(
      values,
      whereClause
    );
    if(allocatedCount && allocatedCount.length>0){
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
const formatDataByDayWise=async(data)=>{
const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const result = days.map(day => ( {
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
    unallocated:data.total-data[day],
    allocated:data[day]
}));

return result
}
const getAllocationForManagerMatrix = async (req) => {
  const { country, state, city, floor, campus, bu_id,manager_id } = req.query;
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
    const dayWiseData = await getAllocationByManagerCount(
      values,
      whereClause
    );
    if(dayWiseData && dayWiseData.length>0){
      const formattedData=formatDataByDayWise(dayWiseData[0]);
      return formattedData; 
    }else{
      return []
    }
    
};

const getTransportMetrix = async (req) => {
  const { country, city, state, floor, campus,bu_id,manager_id } = req.query
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

module.exports = {
  insertUser,
  findUserByEmailAndPassword,
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
  getHOEFromTable,
  getManagersByHOEIdFromTable,
  updateManagerData,
  getManagerFromTable,
  getEmployeesByManagerIdFromTable,
  updateEmployeeSeatData,
  getAllocationForBUwise,
  getAllocationForAdminMatrix,
  getManagersByFloor,
  getAllocationForManagerMatrix,
  getTransportMetrix
};
