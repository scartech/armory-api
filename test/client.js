const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

console.log('process.env.POSTGRES_HOST = ' + process.env.POSTGRES_HOST);
console.log('process.env.POSTGRES_PORT = ' + process.env.POSTGRES_PORT);

pgclient.connect();

const db = 'CREATE DATABASE armory-test;'

pgclient.query(db, (err, res) => {
    if (err) {
      console.log(err);
      throw err;
    }
});

pgclient.end();
