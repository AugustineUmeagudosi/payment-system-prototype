import { Client } from 'pg';
import 'dotenv/config';

const { NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME, TEST_DB_NAME } = process.env;
const database = NODE_ENV == 'test' ? TEST_DB_NAME : DB_NAME;

const connectionString = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${database}`;
const client = new Client({ connectionString });

client.connect()
  .then(() => console.log(`connected to ${NODE_ENV} database`))
  .catch(err => console.log(`could not connect to the db: ${err.message}`));
