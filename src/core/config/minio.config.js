const minioConfig = {
  dbUri: process.env.DB_URI,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  dbHost: process.env.DBHOST,
  dbName: process.env.DBNAME,
  dbUser: process.env.DBUSER,
  dbPass: process.env.DBPASS,
  dbPort: process.env.DBPORT,
  dbEngine: process.env.DBENGINE,
  authDb: process.env.DBAUTH,
  modelDir: process.env.MODELDIR,
  isHttps: process.env.IS_HTTPS === 'true' || process.env.IS_HTTPS === 'True',
  sslKey: process.env.SSL_KEY,
  sslCert: process.env.SSL_CERT 
}

module.exports = minioConfig
