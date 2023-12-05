import path from 'node:path';
import { readFile } from 'node:fs/promises';

import yargs from 'yargs';
import chalk from 'chalk';

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option('i', {
    alias: 'input',
    describe: 'localização do documento CNAB para leitura (input)',
    type: 'string',
    demandOption: true,
  })
  .option('f', {
    alias: 'from',
    describe: 'posição inicial de pesquisa da linha do CNAB',
    type: 'number',
  })
  .option('t', {
    alias: 'to',
    describe: 'posição final de pesquisa da linha do CNAB',
    type: 'number',
  })
  .option('s', {
    alias: 'segment',
    describe: 'tipo de segmento',
    choices: ['p', 'q', 'r'],
    type: 'string',
  })
  .option('n', {
    alias: 'name',
    describe:
      'busca empresa por nome (exact match). Não deve ser utilizado com -f, -t e -s.',
    type: 'string',
  })
  .check((argv) => {
    if (argv.from > argv.to) {
      throw new Error(
        'A posição inicial não deve ser maior que a posição final',
      );
    }

    if (argv.name && (argv.from || argv.to || argv.segment)) {
      throw new Error('O parâmetro -n não deve ser utilizado com -f, -t e -s.');
    }

    if (!argv.name && (!argv.from || !argv.to || !argv.segment)) {
      throw new Error(
        'Os parâmetros -f, -t e -s devem ser utilizados em conjunto.',
      );
    }

    return true;
  })
  .example(
    '$0 -f 21 -t 34 -s p',
    'destaca o segmento de acordo com os parâmetros informados',
  )
  .example(
    '$0 -n "NOME DA EMPRESA"',
    'busca a empresa pelo nome e destaca o segmento',
  ).argv;

const { from, to, segment, input, name } = optionsYargs;
const filePath = path.resolve(input);

const log = (segment, segmentType, from, to) => {
  const segmentSubstring = segment.substring(from, to);
  console.log(`
----- Cnab linha ${segmentType} -----

posição from: ${chalk.inverse.bgBlack(from)}

posição to: ${chalk.inverse.bgBlack(to)}

item isolado: ${chalk.inverse.bgBlack(segmentSubstring)}

item dentro da linha P: 
  ${segment.substring(0, from)}${chalk.inverse.bgBlack(
    segmentSubstring,
  )}${segment.substring(to)}

----- FIM ------
`);
};

console.time('leitura Async');

const exec = async () => {
  const file = await readFile(filePath, 'utf8');

  const lines = file.split('\n');
  // const header = lines.slice(0, 2);
  // const tail = lines.slice(-2);

  // ? Implementação original: busca somente nos 3 primeiros segmentos P, Q e R
  const [p, q, r] = lines.slice(2, -2);
  const segmentMap = {
    p,
    q,
    r,
  };

  if (!name) {
    log(segmentMap[segment], segment.toUpperCase(), from, to);
    process.exit(0);
  }

  for (const [key, value] of Object.entries(segmentMap)) {
    const companyName = value.substring(33, 73).trim();
    if (companyName === name) {
      log(value, key.toUpperCase(), 33, 73);
      process.exit(0);
    }
  }

  console.log('Empresa não encontrada');
  process.exit(1);
};

exec();

console.timeEnd('leitura Async');
