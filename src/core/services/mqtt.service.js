const mqtt = require('mqtt');
const mosca = require('mosca');
var f = require('util').format;
const SOCKET = require('./socketKey')();

class MqttService {

    get isInitialized() {
        return this._server !== undefined && this._server !== null && this._client !== undefined && this._client !== null && this._channel !== undefined && this._channel !== null;
    }

    constructor() {
        this._channel;
    }

    init(server) {

        var connectionString =
                f('mongodb://%s:%s@%s:%d/%s?authSource=admin',
                    process.env.DB_USER, process.env.DB_PASS, process.env.DB_HOST, process.env.DB_PORT, process.env.DB_PUBSUB);

        var pubsubsettings = {
            //using ascoltatore
            type: 'mongo',		
            url: connectionString,
            pubsubCollection: 'conversation',
            mongo: {}
            };

            var moscaSettings = {
                port: 1883			//mosca (mqtt) port
                // backend: pubsubsettings	//pubsubsettings is the object we created above 
            };
              
            this._server = new mosca.Server(moscaSettings);	//here we start mosca
            this._server.on('ready', () => {
				console.log("Mqtt Server is ready...");
				this._client = mqtt.connect
				(
					"mqtt://localhost:1883", 
					{
						clientId: 'collectIoServerId'
					}
				);
				console.log(this._client);
            });	//on init it fires up setup()
    }

    setListener(listener) {
        this._listener = listener;
    }

    createChannel(channelName) {
        this._channel = channelName;
    }

    notifyAddItemCollection(schema, item) {
        if (!this.isInitialized) return;
        this._client.publish(this._channel + '/' + SOCKET.EVENT_COLLECTION_ADD_ITEM, JSON.stringify({ schema: schema, item: item, createdAt: item.createdAt }));
    }
    
    notifyRemoveItem(schema, item) {
        if (!this.isInitialized) return;
        this._client.publish(this._channel + '/' + SOCKET.EVENT_COLLECTION_REMOVE_ITEM, JSON.stringify({ schema: schema, item: item }));
    }
	
	notifyUpdateCollection(schema, items) {
        if (!this.isInitialized) return;
        this._client.publish(this._channel + '/' + SOCKET.EVENT_UPDATE, JSON.stringify({ schema: schema, items: items }));

    }

    notifyUpdateCollectionItem(schema, item) {
        if (!this.isInitialized) return;
        this._client.publish(this._channel + '/' + SOCKET.EVENT_COLLECTION_UPDATE_ITEM, JSON.stringify({ schema: schema, item: item }));
    }

    sendBroadcast(message) {
        if (!this.isInitialized) return;
        this._client.publish(this._channel + '/' + SOCKET.EVENT_RECEIVE_BROADCAST, JSON.stringify(message));
    }

}

var mqttService;
module.exports = () => {
    if (!mqttService) mqttService = new MqttService();
    return mqttService;
}
