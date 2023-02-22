const dotenv = require("dotenv");

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  /**
   * App Configuration
   */
  app: {
    name: process.env.APP_NAME,
    port: parseInt(process.env.PORT, 10),
  },

	/**
	 * JSON WEB TOKEN Configurations
	 */
   jwt: {
		iss: process.env.DOMAIN,
		secret: process.env.JWT_SECRET,
		round: 10,
	},

  /**
   * Display Configuration
   */
   display: {
    limits: 10,
  },


  /**
   * Postgres Configuration
   */
   postgres: {
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      port: process.env.POSTGRES_PORT,
      host: process.env.POSTGRES_HOST,
      dialect: process.env.POSTGRES_DIALECT
  },

  /**
   * Used by winston logger
   */
   logs: {
    level: process.env.LOG_LEVEL || "silly",
  },

};
