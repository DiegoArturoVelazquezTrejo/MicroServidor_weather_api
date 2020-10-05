const os = require('os');
// Contamos los CPUs de la máquina
const userCPUCount = os.cpus().length;

// Documento para los algoritmos auxiliares o frecuentemente utilizados

// Función para verificar que las claves de las ciudades tengan únicamente caracteres alfabéticos
const isAlpha = function(ch){
  return (ch.match(/[0-9]/) == null);
}

// Función para particionar los datos de acuerdo a la cantidad de CPUs (para los hilos)
const partition_data = function(data_to_be_resolved){
  // sub sub partición que la información que cada hilo va a procesar
  const segmentSize = Math.ceil(Object.keys(data_to_be_resolved).length)/userCPUCount;
  contador = 0;
  let data = {};
  const segments = [];
  // Hacemos un arreglo con particiones de datos para cada worker (hilo)
  for(var key in data_to_be_resolved){
    if(contador < segmentSize){
      data[key] = data_to_be_resolved[key];
      contador++;
    }else{
      segments.push(data);
      contador = 1;
      data = {};
      data[key] = data_to_be_resolved[key];
    }
  }
  if(Object.keys(data).length >0){
    segments.push(data);
  }
  return segments;
}

// Función para sleep en Javascript
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports.isAlpha = isAlpha;
module.exports.partition_data = partition_data;
module.exports.sleep = sleep;
