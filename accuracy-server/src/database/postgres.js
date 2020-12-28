require('dotenv/config');

const conn = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_NAME,
  },
  migrations: {
    directory: `${__dirname}/src/database/migrations`,
  },
};

const knexPg = require('knex')(conn);

module.exports = knexPg;
