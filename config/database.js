module.exports = {
	devUri: 'mongodb://upitter:upitteruser@ds019633.mlab.com:19633/upitter',
	prodUri: 'mongodb://127.0.0.1:27017/upitter',
	options: {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	}
};
