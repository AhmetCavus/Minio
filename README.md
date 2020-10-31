# Minio

Minio is an easy to use minimalistic sandbox project providing

- auth
- token
- model
- security

services with support for customize the special requirements. It's not just another CMS system. It's only a minimalistic bootstrapper providng possibility for customizations.

## Getting Started

### Installation

git clone https://github.com/AhmetCavus/Minio.git

cd minio
npm i

### env file

You have to provide an env file '.env' in your project root folder.
This file should contain following keys:

HOSTNAME=127.0.0.1
PORT=80
DBHOST=Address of your db engine
DBNAME=name of your db
DBUSER=admin
DBPASS=**\***
DBPORT=80
BAUTH=admin
DBENGINE=MongoDb
MODELDIR=The directory of your model schema
CREDENTIALS_COLLECTION=The collection holding the credentials
JWT_SECRET=The secret key of jwt
ROOT_CLIENT=The super user
ROOT_SECRET=Secret of the super user
ROOT_EMAIL=Mail of the super user
ENABLE_WEBSOCKET=true

Be aware of commiting this file in your repo!!!

### Usage

const Minio = require("../src/core/minio.app")

const minio = new Minio.App()

minio.start().then(() => {
console.log("Minio is up and running")
})

minio.setting((app, express) => {
app.get("/", (req, res) => {
res.sendFile(\_\_dirname + "/public/index.html")
})
app.use("/todo", require("./routes/todo.route"))
})

```
    For more information check the unit test project folder.
```

### Tests

## Requirements

**Node:**

- NodeJS >= 10.16 <=14
- NPM >= 6.x

**Database:**

- MongoDB >= 3.6
- ...

**We recommend always using the latest version of minio to start your new projects**.

## Features

- **Auth service:**
- **Token service:**
- **Auto db connection:**
- **Model service:**
- **Web socket support:**

## Roadmap

## License

See the [LICENSE](./LICENSE) file for licensing information.
