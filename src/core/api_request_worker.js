const {Worker, parentPort, workerData} = require('worker_threads');
const fetch = require('node-fetch');


// Obtenemos una partición de las peticiones
const requests = workerData;
// Obtenemos la función de isAlpha
const functions = require('./auxiliar_algorithms.js');
const isAlpha = functions.isAlpha;

const requestData = async function(request){
  var response;
  var url = '';
  var origin = '';
  var url_city, url_coord;
  const result = {};
  // Conectamos a la api, conseguimos las peticiones y esas peticiones se guardarán en result
  for(var key in request){
    // 1. Tenemos que ver si la clave cumple con isAlpha, si es así, hacemos la petición con ella
    try{
        if(isAlpha(key)){
          url_city = `http://api.openweathermap.org/data/2.5/weather?q=${key}&appid=3135e334d6fbed99649f285eb30e30aa`;
          // Respuestas de la API
          var respuesta = await fetch (url_city)
          response = await respuesta.json();
          // En caso en que la petición sea undefined porque no se logró con el nombre
          if(response === undefined){
            var longitude = parseFloat(request[key].longitude)/10;
            var latitude = parseFloat(request[key].latitude)/10;
            url_coord = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3135e334d6fbed99649f285eb30e30aa`;
            // Respuestas de la API
            respuesta = await fetch (url_coord);
            response = await respuesta.json();
          }
          // Si la respuesta es NULL, intentamos con las coordenadas
          result[key] = response.main; // Ya después especificamos que datos queremos de la respuesta de la api
        }else{
          var longitude = parseFloat(request[key].longitude)/10;
          var latitude = parseFloat(request[key].latitude)/10;
          url_coord = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3135e334d6fbed99649f285eb30e30aa`;
          // Respuestas de la API
          var respuesta = await fetch (url_coord);
          response = await respuesta.json();
          result[key] = response.main; // Ya después especificamos que datos queremos de la respuesta de la api
        }
      }catch(e){console.log("Error requesting data: "+key); }
  }
  // Regresamos el resultado
  parentPort.postMessage(result);
}

// Mandamos a llamar a la función
requestData(requests);
