require('dotenv/config');

const conn = {
  client: 'oracledb',
  connection: {
    host: process.env.ORACLE_HOST,
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASS,
    database: process.env.ORACLE_DATABASE,
  },
};

const knexOra = require('knex')(conn);

module.exports = knexOra;
