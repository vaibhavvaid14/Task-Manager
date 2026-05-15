const { Sequelize } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/taskmanager';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL is missing from environment variables!');
    }
    await sequelize.authenticate();
    console.log('PostgreSQL Connected Successfully');
  } catch (error) {
    console.error('DATABASE CONNECTION ERROR:');
    console.error('Message:', error.message);
    if (error.original) console.error('Original Error:', error.original.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
