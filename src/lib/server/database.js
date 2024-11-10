import sql from 'mssql';
import config from '../../../mssql.config.js';

let pool;

export async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

// Helper function to execute queries
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
export async function executeStoredProcedure(procedureName, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();

    // Add any parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value.type || sql.VarChar, value.value);
    });

    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (err) {
    console.error('Database stored procedure error:', err);
    throw err;
  }
} 