//DICHIARAZIONE VARIABILI / REQUIREMENTS / OGGETTI / FUNZIONI
//importazione moduli
const express = require("express");
const postsRouter = require("./router/posts");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

//dichiaro una variabile come express e la porta su cui ascolto
const server = express();
const port = 3000;

//body parser per far si che riesca ad interpretare il body
server.use(express.json());

//associo questo file al file di routing
server.use("/", postsRouter);

//registrazione del resto dei middleware sotto le route
server.use(notFound);
server.use(errorHandler);

//ELABORAZIONE DATI

//rendo visibili i contenuti statici nella cartella public
server.use(express.static("public"));

//ascolto per eventuali richieste
server.listen(port, () => {
  console.log("Il server sta ascoltando sulla porta " + port);
});
