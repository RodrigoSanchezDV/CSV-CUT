/* Setear con el numero de cuantas filas se quieren las partes del CSV */
const linesPerFile = 10;
/* Setear con el nombre del archivo csv que se desea cortar */
const sourceFilePath = 'oportunidades_fecha_inscrito.csv';

const outputDirectory = `${sourceFilePath.replace(/\.[^.]+$/, '')}_parts/`;

import fs from 'node:fs';
import readline from 'node:readline';

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}


const readStream = fs.createReadStream(sourceFilePath);


const rl = readline.createInterface({
  input: readStream,
});


let header = ''; 
let isFirstLine = true;
let lineCount = 0;
let currentFileIndex = 1;
let currentWriteStream = createWriteStream();


rl.on('line', (line) => {
  if (isFirstLine) {
    header = line;
    isFirstLine = false;
  }

  if (lineCount === 0) {
    currentWriteStream = createWriteStream();
    currentWriteStream.write(header + '\n');
  } else {
    currentWriteStream.write(line + '\n');
  }
  
  lineCount++
  if (lineCount >= linesPerFile) {
    currentWriteStream.end();
    lineCount = 0;
    currentFileIndex++;
  }

});

rl.on('close', () => {
  if (currentWriteStream) {
    currentWriteStream.end();
  }
  console.log('Corte de archivo completado.');
});

function createWriteStream() {
  const targetFilePath = `${outputDirectory}${sourceFilePath}(${currentFileIndex}).csv`;
  return fs.createWriteStream(targetFilePath);
}