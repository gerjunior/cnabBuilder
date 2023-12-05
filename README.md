# Como funciona o CNAB

CNAB é um arquivo posicional, onde o cabeçalho equivale às duas primeiras linhas do arquivo e seu rodapé às duas ultimas.

O corpo do arquivo é composto por linhas de registros, que são divididos em segmentos: _P_, _Q_ e _R_.
O segmento pode ser encontrado no index 14 da linha de qualquer parte do corpo do arquivo.

```
0010001300002Q 012005437734000407NTT BRASIL COMERCIO E SERVICOS DE TECNOLAVENIDA DOUTOR CHUCRI ZAIDAN, 1240 ANDARVILA SAO FRANCI04711130SAO PAULO      SP0000000000000000                                        000
```

## Script

Necessário NodeJS 20+.

1. Caso utilize nvm, basta executar `nvm install v20` e `nvm use v20` para instalar e utilizar a versão mais recente.
2. Execute `yarn install` para instalar as dependências.
3. Execute os scripts de exemplo com:

```
yarn example:name_search
yarn example:index_search
example:generate_json
```
