import sql from 'mssql';
import config from '../../../mssql.config.js';

/** @type {sql.ConnectionPool} SQL connection pool instance */
let pool;

/**
 * Gets or creates a connection pool to the SQL database
 * @returns {Promise<sql.ConnectionPool>} SQL connection pool instance
 * @throws {Error} If there is an error connecting to the database
 */
export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// Helper function to execute queries
/**
 * Executes a SQL query with optional parameters
 * @param {string} query - SQL query to execute
 * @param {Object} [params={}] - Query parameters object where each key is the parameter name and value is an object with {type: string|sql type, value: any}
 * @returns {Promise<Array>} Array of records (recordset) returned by the query
 * @throws {Error} If there is a database error executing the query or connection fails
 * @example
 * const params = {
 *   currentDate: { type: "DateTime", value: new Date() },
 *   bookingId: { type: "VarChar", value: "123" }
 * };
 * const results = await executeQuery('SELECT * FROM Booking WHERE BookingID = @bookingId AND Date < @currentDate', params);
 */
export async function executeQuery(query, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add any parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, sql[value.type], value.value);
    });

    // Log query with replaced parameters [DEBUG]
    // let debugQuery = query;
    // Object.entries(params).forEach(([key, value]) => {
    //   const paramValue = typeof value.value === 'string' ? `'${value.value}'` : value.value;
    //   debugQuery = debugQuery.replace(new RegExp(`@${key}\\b`, 'g'), paramValue);
    // });
    // console.log('Executing query:', debugQuery);

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

// Helper function to execute stored procedures
/**
 * Executes a SQL Server stored procedure
 * @param {string} procedureName - Name of the stored procedure to execute
 * @param {Object} [params={}] - Input parameters object where each key is the parameter name and value is an object with {type: string|sql type, value: any}
 * @param {Object} [outputParams={}] - Output parameters object where each key is the parameter name and value is an object with {type: string|sql type}
 * @returns {Promise<{recordset?: Array, output?: Object}>} Result object containing optional recordset array and output parameters object
 * @throws {Error} If there is a database error executing the stored procedure or connection fails
 * @example
 * const inputParams = {
 *   RoomTypeID: { type: "BigInt", value: 123 },
 *   FromDate: { type: "Date", value: new Date() }
 * };
 * const outputParams = {
 *   FRID: { type: "BigInt" }
 * };
 * const result = await executeStoredProcedure('FindFreeRoom', inputParams, outputParams);
 * // result = { recordset: [...], output: { FRID: 456 } }
 */
export async function executeStoredProcedure(procedureName, params = {}, outputParams = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add input parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, sql[value.type], value.value);
    });

    // Add output parameters
    Object.entries(outputParams).forEach(([key, type]) => {
      request.output(key, sql[type]);
    });

    const result = await request.execute(procedureName);
    return result;
  } catch (err) {
    console.error('Database stored procedure error:', err);
    throw err;
  }
}