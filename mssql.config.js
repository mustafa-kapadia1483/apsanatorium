import {
	SECRET_MSSQL_SERVER,
	SECRET_MSSQL_USERNAME,
	SECRET_MSSQL_PASSWORD,
	SECRET_MSSQL_DATABASE
} from '$env/static/private';

const config = {
	user: SECRET_MSSQL_USERNAME,
	password: SECRET_MSSQL_PASSWORD,
	server: SECRET_MSSQL_SERVER,
	database: SECRET_MSSQL_DATABASE,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000
	},
	options: {
		encrypt: true, // for azure
		trustServerCertificate: true // change to true for local dev / self-signed certs
	}
};

export default config;
