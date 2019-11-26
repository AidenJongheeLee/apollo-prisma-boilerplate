# apollo-prisma-boilerplate

Apollo v2 integrated with prisma ORM

Installation
==========

* Install Prism cli
```
brew tap prisma/prisma
brew install prisma
```
* Install [Docker](https://docs.docker.com/docker-for-mac/install/).

Add Docker compose file. `touch prima/docker-compose.yml`

Update Docker Compose file based on your DB more detail [here](https://www.prisma.io/docs/1.34/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/).

Run docker-compose up -d Prisma is connected to DB and runs on `http://localhost:4466`.

Run `prisma init --endpoint http://localhost:4466`

Run `prisma deploy`

More detail check [Prisma official website](https://www.prisma.io/docs/1.34/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/)

Set Env
```
PRISMA_SECRET=<<PRISMA_SECRET>>
PRISMA_ENDPOINT=<<PRISMA_ENDPOINT>>
BCRYPT_SALT=<<BCRYPT_SALT>>
JWT_SECRET=<<JWT_SECRET>>
```
Start server 
Run `yarn dev` or `npm run dev`server runs in `http://localhost:4000/graphql`

Prisma server runs in `http://localhost:4466` and Apollo server runs in `http://localhost:4000/graphql` This project uses prisma 1 prisma client. This will update wne prisma 2 release [Photon](https://photonjs.prisma.io/).
