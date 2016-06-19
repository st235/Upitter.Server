'use strict';

const redis = require('thunk-redis');
const _ = require('underscore');
const { mixedLogger } = require('./loggerUtils');

class RedisUtils {
	constructor(dbName, credentials, options) {
		this._credentials = credentials;
		this._options = options;
		this._client = redis.createClient(credentials, options);
		this.name = dbName;
	}

	_getKeyWithPrefix(key) {
		return `${this.name}_${key}`;
	}

	getDbName() {
		return this.name;
	}

	getDbNumber() {
		return this._options.database;
	}

	getDbSize() {
		return this._client.dbsize();
	}

	setConnectionHandler(handler) {
		this._client.on('connect', () => {
			const initialMessage = `Redis client: ${this.getDbName()}. DB number ${this.getDbNumber()} started on:\n`;

			const message = this._credentials.reduce((prevValue, newValue) => `${prevValue}${newValue.host}:${newValue.port}\n`, initialMessage);
			mixedLogger.info(message);
			if (handler) handler();
		});
	}

	setErrorHandler(handler) {
		this._client.on('error', err => {
			mixedLogger.error(`Redis client: ${this.getDbName()}. DB number ${this.getDbNumber()} got an error:\n`);
			if (handler) handler(err);
		});
	}

	setEndHandler(handler) {
		this._client.on('end', () => {
			mixedLogger.warn(`Redis client: ${this.getDbName()}. DB number ${this.getDbNumber()} lost connection or exited:\n`);
			if (handler) handler();
		});
	}

	/* ***********************************************GENERAL COMMANDS*********************************************** */

	getServerInfo() {
		return this._client.info();
	}
	/**
	 *
	 * @param key
	 * @param timeout in milliseconds
	 */
	expire(key, timeout) {
		return this._client.pexpire(this._getKeyWithPrefix(key), timeout);
	}

	/**
	 *
	 * @param key
	 * @param timestamp  UNIX timestamp in milliseconds
	 */
	expireAt(key, timestamp) {
		return this._client.pexpireat(this._getKeyWithPrefix(key), timestamp);
	}

	flushDb() {
		return this._client.flushdb();
	}

	closeConnection() {
		return this._client.quit();
	}

	/* *************************************WORKING WITH SIMPLE KEY-VALUE PAIRS************************************** */

	get(key) {
		return this._client.get(this._getKeyWithPrefix(key));
	}

	set(key, value) {
		return this._client.set(this._getKeyWithPrefix(key), value);
	}

	remove(key) {
		return this._client.del(this._getKeyWithPrefix(key));
	}

	exists(key) {
		return this._client.exists(this._getKeyWithPrefix(key));
	}

	/* *******************************************WORKING WITH HASH SETS********************************************* */

	hGet(key, ...fields) {
		const resultingKey = this._getKeyWithPrefix(key);

		if (!fields.length) return this._client.hgetall(resultingKey);
		if (fields.length === 1) return this._client.hget(resultingKey, fields[0]);
		return this._client.hmget(resultingKey, fields);
	}

	/**
	 *
	 * @param key
	 * @param values
	 */
	hSet(key, values) {
		const resultingKey = this._getKeyWithPrefix(key);

		if (_.isArray(values)) return this._client.hmset(resultingKey, values);
		if (_.isObject(values)) return this._client.hset(resultingKey, values.field, values.value);
	}

	hGetFields(key) {
		return this._client.hgetall(this._getKeyWithPrefix(key));
	}

	hGetValues(key) {
		return this._client.hvals(this._getKeyWithPrefix(key));
	}

	hDel(key, values) {
		return this._client.hdel(this._getKeyWithPrefix(key), values);
	}

	hLen(key) {
		return this._client.hlen(this._getKeyWithPrefix(key));
	}

	/**
	 * Get all fieldNames from hSet by key
	 * @param key
	 */
	hFields(key) {
		return this._client.hkeys(this._getKeyWithPrefix(key));
	}

	hExists(key, field) {
		return this._client.hexists(this._getKeyWithPrefix(key), field);
	}

	/* **********************************************WORKING WITH LISTS********************************************** */

	/**
	 *
	 * @param key
	 * @param values
	 * @returns {int} the length of the resulting list
	 */
	lHeadPush(key, ...values) {
		return this._client.lpush(this._getKeyWithPrefix(key), values);
	}

	lTailPush(key, ...values) {
		return this._client.rpush(this._getKeyWithPrefix(key), values);
	}

	/**
	 *
	 * @param key
	 * @returns {int} the length of the resulting list
	 */
	lFirstPop(key) {
		return this._client.lpop(this._getKeyWithPrefix(key));
	}

	lLastPop(key) {
		return this._client.rpop(this._getKeyWithPrefix(key));
	}

	lSet(key, index, value) {
		return this._client.lset(this._getKeyWithPrefix(key), index, value);
	}

	lGetAtIndex(key, index) {
		return this._client.lindex(this._getKeyWithPrefix(key), index);
	}

	lInsert(key, toInsert, before) {
		return this._client.linsert(this._getKeyWithPrefix(key), before, toInsert);
	}

	lGetRange(key, from, to) {
		return this._client.lrange(this._getKeyWithPrefix(key), from, to);
	}

	/**
	 *
	 * @param key
	 * @param count how many occurances to remove. If negative - starts from end; Else - from start
	 * @param value
	 * @returns {*}
	 */
	lRem(key, count, value) {
		return this._client.lrem(this._getKeyWithPrefix(key), count, value);
	}

	lLength(key) {
		return this._client.llen(this._getKeyWithPrefix(key));
	}
}

module.exports = RedisUtils;
