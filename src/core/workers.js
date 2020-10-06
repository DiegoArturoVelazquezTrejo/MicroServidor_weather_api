const path = require('path');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const workerPath = path.resolve('core/api_request_worker.js');

// Archivo en donde está la función que trabaja con los hilos
// Regresa una promesa
// Vamos a trabajar con los workers (hilos)
const worker = async function(segments){
  var promises = segments.map(
    segment =>
      new Promise((resolve, reject) => {
        const worker = new Worker(workerPath, {
          workerData: segment,
        });
        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', code => {
          if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
        });
      })
  );

  // Vamos a obtener los resultados de las promesas de los hilos
  return  Promise.all(promises).then(results => {
    // Aquí tendríamos las respuestas de los climas para cada segmento de la partición 1
    // Necesitamos juntar cuatro jsons en uno solo (results es un arreglo de jsons)
    data = {};
    // Agregamos todas las respuestas de los hilos a un solo json
    for(var i = 0; i < results.length; i++){
      for(var key in results[i]){
        data[key] = results[i][key];
      }
    }
    return data;
  });
};

module.exports.worker = worker; 
