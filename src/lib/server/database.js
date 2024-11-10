import sql from 'mssql';
import config from '../../../mssql.config.js';

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
 * @param {Object} [params={}] - Query parameters object where each key is the parameter name and value is an object with type and value properties
 * @returns {Promise<Array>} Array of records returned by the query
 * @throws {Error} If there is a database error executing the query
 * @example
 * const params = {
 *   roomId: { type: sql.Int, value: 123 },
 *   date: { type: sql.Date, value: new Date() }
 * };
 * const results = await executeQuery('SELECT * FROM Rooms WHERE RoomID = @roomId AND Date = @date', params);
 */
export async function executeQuery(query, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add any parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value.type || sql.VarChar, value.value);
    });

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
 * @param {Object} [params={}] - Input parameters object where each key is the parameter name and value is an object with type and value properties
 * @param {Object} [outputParams={}] - Output parameters object where each key is the parameter name and value is the SQL type
 * @returns {Promise<Object>} Result object containing recordset and output parameters
 * @throws {Error} If there is a database error executing the stored procedure
 * @example
 * const inputParams = {
 *   RoomTypeID: { type: sql.BigInt, value: 123 },
 *   FromDate: { type: sql.Date, value: new Date() }
 * };
 * const outputParams = {
 *   FRID: sql.BigInt
 * };
 * const result = await executeStoredProcedure('FindFreeRoom', inputParams, outputParams);
 */
export async function executeStoredProcedure(procedureName, params = {}, outputParams = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add input parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value.type || sql.VarChar, value.value);
    });

    // Add output parameters
    Object.entries(outputParams).forEach(([key, type]) => {
      request.output(key, type);
    });

    const result = await request.execute(procedureName);
    return result;
  } catch (err) {
    console.error('Database stored procedure error:', err);
    throw err;
  }
}