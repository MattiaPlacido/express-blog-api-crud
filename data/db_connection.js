const mysql = require("mysql2");

//IN CONTESTI PRATICI TUTTO DA SCRIVERE NEL FILE ENV
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "blog",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = connection;
