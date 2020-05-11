class DbService {
  constructor(dbAdapter) {
    this.dbAdapter = dbAdapter
  }

  async connect(config) {
    return await this.dbAdapter.connect(config)
  }

  registerCollections(collections) {
    return this.dbAdapter.registerCollections(collections)
  }
}

module.exports = DbService
