const { Client } = require('pg');

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres'
});

pgclient.connect();

const db = 'CREATE DATABASE armory-test;'

pgclient.query(db, (err, res) => {
    if (err) {
      console.log(err);
      throw err;
    }
});

pgclient.end();
