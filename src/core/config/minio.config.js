const minioConfig = {
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  dbName: process.env.DBNAME,
  dbUser: process.env.DBUSER,
  dbPass: process.env.DBPASS,
  dbPort: process.env.DBPORT,
  dbEngine: process.env.DBENGINE,
  authDb: process.env.DBAUTH,
  modelDir: process.env.MODELDIR,
}

module.exports = minioConfig
