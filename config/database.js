module.exports = {
	uri: 'mongodb://127.0.0.1:27017/upitter',
	options: {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	}
};
