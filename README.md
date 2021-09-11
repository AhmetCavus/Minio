# Minio

![Build Status](https://dev.azure.com/cinary/Minio/_apis/build/status/AhmetCavus.Minio?branchName=develop)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/cinary/minio/8)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/cinary/minio/8)
![npm](https://img.shields.io/npm/v/minio-cms)

Minio is an easy to use minimalistic sandbox project providing

- auth
- token
- model
- security

services with support for customize the special requirements. It's not just another CMS system. It's only a minimalistic bootstrapper providng possibility for customizations.

The main purpose is to providing convenient services in order to
automate following features:

- auth management
- token management
- providing model mapping
- security management
- service connections

## Getting Started

### Installation

`git clone https://github.com/AhmetCavus/Minio.git`

or

`git clone git@github.com:AhmetCavus/Minio.git`

`cd .\Minio`

or

`cd Minio`

`npm i`

### Configuration

You have to provide an env file '.env' in your project root folder.
This file should contain following keys:

```
MONGO_URI=mongodb://user:pass@host:port/collection?authSource=admin
JWT_SECRET=do.not.read.it.is.jwt.secret
VERIFY_SIGNATURE=i.can.open.doors
CLIENT_ID=alone.i.am.useless
SECRET_ID=do.not.read.it.is.client.secret
```

Be aware of commiting this file in your repo!!!

### Usage

```nodejs
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

### Options

In order to configurate the server and ports, you can specify following values on startup:

```nodejs
minio.start(options)
```

| Key             | Description                                                                | Default                                    |
| -----------     | :------------------------------------------------------------------------- | :----------------------------------------- |
| port            | Specify the port                                                           | 8080                                       |
| modelPath       | The path of the models, that should be registered in the db                | models                                     |
| enableWebsocket | Whether to enable the websocket support or not                             | False                                      |

### Accessing to collections

In order to access the collection provided in the models, you can simply call the code below

```nodejs
const device = minio.collection("device")
// device.model is the mongoose schema
```
After that, minio provides you convenient methods to notify observers

| Function    | Description                                                                |
| ----------- | :------------------------------------------------------------------------- |
| sendBroadcast(message, channelName) | Send a broadcast to all oberservers registererd to the given channel name |
| notifyAddItemCollection(schema, item) | Notify all oberservers listening to changes for the given schema and provide the new created item |
| notifyRemoveItem(schema, item) | Notify all oberservers listening to changes for the given schema and provide the removed item |
| notifyUpdateCollection(schema, items) | Notify all oberservers listening to changes for the given schema and provide the items of the changed collection |
| notifyUpdateCollectionItem(schema, item) | Notify all oberservers listening to changes for the given schema and provide the updated item of the collection |

For every model schema in your models path, a collection will be created in the database. In addition, it will be supplied with bi-directional communication through sockets. You can get further detail in the API calls section.

### API calls

An OpenAPI Spec will be provided here. TBD

### Creating models

For instructions of creating models, you can check the docu of the classic KeystoneJS [How to create models](https://v4.keystonejs.com/api/field/options)

In order to create nested list, check following sample file: [TodoModel](./app/models/todo.js)

### Starting the application

npm start

### Playground

You can enter the playground by calling ```localhost``` in your browser.

### Tests

npm test

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
