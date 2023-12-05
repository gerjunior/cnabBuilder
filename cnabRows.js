'use strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';

import yargs from 'yargs';
import chalk from 'chalk';

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option('f', {
    alias: 'from',
    describe: 'posição inicial de pesquisa da linha do CNAB',
    type: 'number',
    demandOption: true,
  })
  .option('t', {
    alias: 'to',
    describe: 'posição final de pesquisa da linha do CNAB',
    type: 'number',
    demandOption: true,
  })
  .option('s', {
    alias: 'segment',
    describe: 'tipo de segmento',
    choices: ['p', 'q', 'r'],
    type: 'string',
    demandOption: true,
  })
  .example(
    '$0 -f 21 -t 34 -s p',
    'destaca o segmento de acordo com os parâmetros informados',
  ).argv;

const { from, to, segment } = optionsYargs;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.resolve(`${__dirname}/cnabExample.rem`);

const messageLog = (segmento, segmentoType, from, to) => `
----- Cnab linha ${segmentoType} -----

posição from: ${chalk.inverse.bgBlack(from)}

posição to: ${chalk.inverse.bgBlack(to)}

item isolado: ${chalk.inverse.bgBlack(segmento.substring(from - 1, to))}

item dentro da linha P: 
  ${segmento.substring(0, from)}${chalk.inverse.bgBlack(
    segmento.substring(from - 1, to),
  )}${segmento.substring(to)}

----- FIM ------
`;

console.time('leitura Async');

readFile(file, 'utf8')
  .then((file) => {
    const lines = file.split('\n');
    const header = lines.slice(0, 2);

    const [p, q, r] = lines.slice(2, -2);
    const tail = lines.slice(-2);

    if (segment === 'p') {
      console.log(messageLog(p, 'P', from, to));
      return;
    }

    if (segment === 'q') {
      console.log(messageLog(q, 'Q', from, to));
      return;
    }

    if (segment === 'r') {
      console.log(messageLog(r, 'R', from, to));
      return;
    }
  })
  .catch((error) => {
    console.error(error);
  });
console.timeEnd('leitura Async');
