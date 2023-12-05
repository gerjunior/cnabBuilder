import { readFile, writeFile } from 'node:fs/promises';

import yargs from 'yargs';

const optionsYargs = yargs(process.argv.slice(2))
  .usage('Uso: $0 [options]')
  .option('i', {
    alias: 'input',
    describe: 'localização do documento CNAB para leitura (input)',
    type: 'string',
    demandOption: true,
  })
  .option('o', {
    alias: 'output',
    describe: 'localização do documento CNAB para escrita (output)',
    type: 'string',
  })
  .example(
    '$0 -i cnabExample.rem',
    'busca o arquivo no caminho informado e gera um arquivo JSON com o mesmo prefixo',
  ).argv;

const { input, output } = optionsYargs;

const exec = async () => {
  console.log(`Lendo arquivo ${input}...`);
  const file = await readFile(input, 'utf8');
  console.log('Leitura concluída. Gerando JSON...');
  const lines = file.split('\n');
  const qSegments = lines.filter((line) => line[13] === 'Q');

  const json = qSegments.map((segment) => {
    const companyName = segment.slice(33, 73).trim();
    const street = segment.slice(73, 113).trim();
    const district = segment.slice(113, 128).trim();
    const zipCode = segment.slice(128, 136).trim();
    const state = segment.slice(136, 151).trim();
    const stateShort = segment.slice(151, 153).trim();
    return {
      companyName,
      street,
      district,
      zipCode,
      state,
      stateShort,
    };
  });

  console.log(`Gerando arquivo ${output}...`);
  await writeFile(output, JSON.stringify(json, null, 2), 'utf8');
  console.log('Arquivo gerado com sucesso!');
};

exec();
