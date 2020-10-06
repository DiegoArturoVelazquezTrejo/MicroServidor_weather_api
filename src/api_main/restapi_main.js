var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var app = express();

const bodyParser = require("body-parser");

// Importar el archivo con los endpoints
const Endpoints = require('../endpoints/endpoints');

// MICROSERVIDOR: relizará una partición de los datos de ciudades

// express configuration here
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('dotenv').config();

// Puerto en el que el servidor trabajará
const REST_API_PORT = process.env.PORT || 8080;

// Endpoint de subir csv
app.post("/enviarInformacion", Endpoints.weatherEndpoint);
app.get("/", inicio());

// Función para indicar que se ha accedido al servidor
const inicio = async(req, res)=>{
  res.status(201).send("Microservidor A"); 
}

// Aquí estamos creando al servidor
var httpServer = http.createServer(app);
httpServer.listen(REST_API_PORT);

// Verificar el puerto en el que el servidor está trabajando
console.log("rest api serving on http://localhost:"+  REST_API_PORT);
