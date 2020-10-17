# Teste técnico - Groove Tech

Seguindo o escopo proposto pelo documento do teste foi desenvolvido uma API RESTful que empenha os três papéis: Cadastrar um novo cliente, listar um cliente existente pelo seu ID e atualizar um cliente existente.

## Ferramentas utilizadas

* Docker
* Redis
* NestJS

## Usage
Para instalar as dependências:
``` bash
$ npm install
$ yarn add
```

Preparar o ambiente do Redis no Docker:
``` bash
$ docker run --name redis -p 6369:6379 -d -t redis:alpine
```
Para rodar a aplicação:
``` bash
yarn start:dev
```
Para testar a aplicação:
``` bash
yarn test
yarn test:cov
```