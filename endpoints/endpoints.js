const fs = require('fs');

// Vamos a requerir la función que trabaja con los workers
const Workers = require('../core/workers.js');
// Vamos a requerir la función para particionar los datos
const functions = require('../core/auxiliar_algorithms.js');
const partition_data= functions.partition_data;
const sleep = functions.sleep;

// Este el el archivo que contiene los endpoints
const weatherEndpoint = async(req, res)=>{

  // Verificar que los parámetros sean los que necesitamos
  if(!req.body.data){
    res.status(404).send("Bad Request");
    return;
  }

  const info_tickets = req.body.data;

  const partitions_array = [];
  if(Object.keys(info_tickets).length < 55){
    partitions_array.push(info_tickets)
  }else{

    var object = {};
    var limit = 55;
    let counter = 0;
    for(var key in info_tickets){
      if(counter < limit){
        object[key] = info_tickets[key];
        counter++;
      }else{
        partitions_array.push(object);
        object={};
        counter = 1;
        object[key] = info_tickets[key];
      }
    }
    if(Object.keys(object).length > 0){
      partitions_array.push(object);
    }
  }

  // Vamos a trabajar con nuestra partición ...
  var beginig, end, difference;
  var segments = [];
  // Arreglo de promesas que contenga todos los resultados de todos los hilos de todas las peticiones de todas las particiones
  var result_promises = [];
  for(var i = 0; i < partitions_array.length; i++){
    // sub sub partición que la información que cada hilo va a procesar
    segments = partition_data(partitions_array[i]);

    beginig = Date.now();
    // Vamos a trabajar con los workers (hilos)
    partition_results = Workers.worker(segments);
    end = Date.now();
    difference = (end - beginig);
    // Esperamos el tiempo restante para juntar 1 minuto de peticiones a la API
    if(partitions_array.length>1 && i < partitions_array.length-1)
      await sleep(65000 - difference);  // HACER LA PREGUNTA DE QUE SI ESE SLEEP ES PARA TODO EL PROGRAMA O PARA EL HILO EN EL QUE SE ESTÁ TRABAJANDO

    // Agregamos el resultado a la lista de promesas
    result_promises.push(partition_results)
  }

  // Nos falta unirlas con las respuestas de los dos microservidores

  return Promise.all(result_promises).then(results => {
    // Concatenar todos los resultados de todas las promesas
    console.log("-----------------------------------------------------------");
    res.status(201).send(results);
  });
  return;
};



// Exportar la función
module.exports.weatherEndpoint = weatherEndpoint;
