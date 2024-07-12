import { Client } from 'pg';
import 'dotenv/config';

let connectionString;
switch (process.env.NODE_ENV) {
  case 'development':
    connectionString = process.env.DEV_DB_URL;
    break;

  case 'production':
    connectionString = process.env.PROD_DB_URL;
    break;

  default:
    connectionString = process.env.TEST_DB_URL;
    break;
}

const client = new Client({ connectionString });
client.connect()
  .then(() => console.log('connected to database'))
  .catch(err => console.log(`could not connect to the db: ${err.message}`));
