<div align="center">
<h1> 🌈 NestJS Template </h1>

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fokonomiyakki%2Fnestjs-template&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://github.com/okonomiyakki/nestjs-template)

![GitHub License](https://img.shields.io/github/license/okonomiyakki/nestjs-template.svg)

![Node.js Badge](https://img.shields.io/badge/Node.js-20.18.0-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat)
![NestJS Badge](https://img.shields.io/badge/NestJS-10.0.0-E0234E?logo=nestjs&logoColor=E0234E&style=flat)
![MySQL Badge](https://img.shields.io/badge/MySQL-8.0.40-4479A1?logo=mysql&logoColor=4479A1&style=flat)
![TypeORM Badge](https://img.shields.io/badge/TypeORM-0.3.20-FE0803?logo=typeorm&logoColor=FE0803&style=flat)
![NGINX Badge](https://img.shields.io/badge/NGINX-latest-009639?logo=nginx&logoColor=009639&style=flat)
![Docker Badge](https://img.shields.io/badge/Docker-25.0.3-2496ED?logo=docker&logoColor=2496ED&style=flat)
![Swagger Badge](https://img.shields.io/badge/Swagger-8.0.1-85EA2D?logo=swagger&logoColor=85EA2D&style=flat)

<p>This template helps you quickly start a user service in Docker environments using NestJS</p>

[Getting Started](#getting-started)

[Clone the Repository](#clone-the-repository)

[Install Dependencies](#install-dependencies)

[Env Settings](#env-settings)

[Migration Scripts](#migration-scripts)

[Build the App](#build-the-app)

[Run the App](#run-the-app)

[Documentation](#documentation)

[Modules Graph](#modules-graph)

[API Lifecycle](#api-lifecycle)

[Project Structure](#project-structure)

[How refresh tokens work](#how-refresh-tokens-work)

[License](#license)

</div>

## Getting Started

Before starting, make sure you have those components on your workstation

- [Node.js](https://nodejs.org/) (>= 20.0.0, version used)
- [Docker](https://www.docker.com/get-started) and Docker Compose
- MySQL 8.0 (if not using Docker)

## Clone the Repository

```bash
git clone https://github.com/okonomiyakki/nestjs-template.git

cd nestjs-template
```

## Install Dependencies

```bash
npm install
```

## Env Settings

This template includes env files for each operating environment as follows.

- [Development mode](https://github.com/okonomiyakki/nestjs-template/blob/main/.env.dev)

- [Local mode](https://github.com/okonomiyakki/nestjs-template/blob/main/.env.local) with production settings

- [Production mode](https://github.com/okonomiyakki/nestjs-template/blob/main/.env.prod)

## Migration Scripts

- [TypeORM CLI](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L18-L18)

  ```bash
  # Run the TypeORM CLI using "ts-node"
  npm run typeorm
  ```

- Migration [configuration](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L19-L19)

  ```bash
  # Set migration configuration with development settings
  npm run typeorm:config
  ```

- [Migrations](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L20-L24)

  ```bash
  # Create a new migration file
  npm run migration:create

  # Generate a migration file based on changes in the entity
  npm run migration:generate

  # Show the list of generated migration files
  npm run migration:show

  # Apply the migration files
  npm run migration:run

  # Revert the last applied migration file
  npm run migration:revert
  ```

> ⚠ The migration file must be generated only in the development environment.

## Build the App

- [Development mode](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L12-L13)

  ```bash
  # Transpile TypeScript files using "tsc"
  npm run build

  # Generate migrations and build the application
  npm run build:dev
  ```

## Run the App

- [Development mode](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L14-L15)

  ```bash
  # Run the application in "watch" mode using "ts-node"
  npm run start

  # Apply migrations and run the application in "watch" mode using "ts-node"
  npm run start:dev
  ```

- [Local mode](https://github.com/okonomiyakki/nestjs-template/blob/9c6c53a0adfa7c866eac3f7e8679ceec971a87f9/package.json#L16-L17) with production settings

  ```bash
  # Start containers using "docker-compose.local.yml"
  npm run docker-compose:up

  # Stop containers using "docker-compose.local.yml"
  npm run docker-compose:down
  ```

  The containers are started based on the [local Docker Compose file](https://github.com/okonomiyakki/nestjs-template/blob/main/docker-compose.local.yml).

  [NestJS](https://github.com/okonomiyakki/nestjs-template/blob/main/Dockerfile.local) and [NGINX](https://github.com/okonomiyakki/nestjs-template/blob/main/nginx/Dockerfile.local) are dockerized through their respective Dockerfiles.

  For NestJS, migrations are applied using the provided [commands](https://github.com/okonomiyakki/nestjs-template/blob/main/scripts/start.sh), and then 'dist/main.js' is run.

## Documentation

Swagger is set up for API documentation.

Once the server is running, access the Swagger UI at:

- `http://localhost:`[ server-running-port ](https://github.com/okonomiyakki/nestjs-template/blob/4c1f8a1a6cdfdd9c2ffbd0f64bc36b011f919bdb/.env.dev#L6)`/api` ········ (development)

- http://localhost/api ······························································· (local)

- `http://`[ your-production-domain.com ](https://github.com/okonomiyakki/nestjs-template/blob/6a3650b5300461dbdbf455c026bd30dd640a424b/nginx/nginx.conf#L9)`/api` ········· (production)

## Modules Graph

![modules](https://github.com/user-attachments/assets/928ddb72-fcc3-4d0a-be1e-aadc2a93737d)

## API Lifecycle

- POST /api/users/v1/signup
  ![signup](https://github.com/user-attachments/assets/34720f2f-1948-4d1f-a298-27c0dd37d2ef)

- POST /api/auth/v1/signin
  ![signin](https://github.com/user-attachments/assets/d2b6fec6-1c99-4c7c-af52-9ef9896a3786)

- DELETE /api/auth/v1/signout
  ![signout](https://github.com/user-attachments/assets/9e460a2a-f5bd-4c06-a559-b5b9a890dc73)

- POST /api/auth/v1/refresh

  The role guard here is for testing purposes. So Remove [this code](https://github.com/okonomiyakki/nestjs-template/blob/629f59a923585f47dd40bbb6c07933608e1f7a1c/src/auth/controllers/auth.controller.ts#L80C36-L81C72) when using it.
  ![refresh](https://github.com/user-attachments/assets/cde0bd0d-c7d7-4873-ba03-f2e3d89bc79d)

## Project Structure

```
src/
├───auth
│   ├───controllers
│   ├───dtos
│   │   ├───requests
│   │   └───responses
│   ├───guards
│   ├───services
│   ├───strategies
│   └───token
│       ├───dtos
│       ├───interfaces
│       ├───jwt
│       │   └───factories
│       └───services
├───common
│   ├───constants
│   ├───decorators
│   ├───dtos
│   └───interfaces
├───core
│   ├───config
│   │   ├───constants
│   │   └───validations
│   └───type-orm
│       ├───constants
│       ├───decorators
│       ├───entities
│       ├───factories
│       └───repositories
└───users
    ├───constants
    ├───controllers
    ├───dtos
    │   ├───internals
    │   ├───requests
    │   └───responses
    ├───interfaces
    └───services
```

## How refresh tokens work

## License

This project is licensed under [MIT licensed](https://github.com/okonomiyakki/nestjs-template/blob/main/LICENSE).
