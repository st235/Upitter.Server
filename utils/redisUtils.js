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
	
	_handleError() {
		throw 'INTERNAL_REDIS_ERROR';
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
		return this._client.dbsize().catch(this._handleError);
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
		return this._client.info().catch(this._handleError);
	}
	/**
	 *
	 * @param key
	 * @param timeout in milliseconds
	 */
	expire(key, timeout) {
		return this._client.pexpire(this._getKeyWithPrefix(key), timeout).catch(this._handleError);
	}

	/**
	 *
	 * @param key
	 * @param timestamp  UNIX timestamp in milliseconds
	 */
	expireAt(key, timestamp) {
		return this._client.pexpireat(this._getKeyWithPrefix(key), timestamp).catch(this._handleError);
	}

	flushDb() {
		return this._client.flushdb().catch(this._handleError);
	}

	closeConnection() {
		return this._client.quit().catch(this._handleError);
	}

	/* *************************************WORKING WITH SIMPLE KEY-VALUE PAIRS************************************** */

	get(key) {
		return this._client.get(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	set(key, value) {
		return this._client.set(this._getKeyWithPrefix(key), value).catch(this._handleError);
	}

	remove(key) {
		return this._client.del(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	exists(key) {
		return this._client.exists(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	/* *******************************************WORKING WITH HASH SETS********************************************* */

	hGet(key, ...fields) {
		const resultingKey = this._getKeyWithPrefix(key);

		if (!fields.length) return this._client.hgetall(resultingKey).catch(this._handleError);
		if (fields.length === 1) return this._client.hget(resultingKey, fields[0]).catch(this._handleError);
		return this._client.hmget(resultingKey, fields).catch(this._handleError);
	}

	/**
	 *
	 * @param key
	 * @param values
	 */
	hSet(key, values) {
		const resultingKey = this._getKeyWithPrefix(key);

		if (_.isArray(values)) return this._client.hmset(resultingKey, values).catch(this._handleError);
		if (_.isObject(values)) return this._client.hset(resultingKey, values.field, values.value).catch(this._handleError);
	}

	hGetFields(key) {
		return this._client.hgetall(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	hGetValues(key) {
		return this._client.hvals(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	hDel(key, values) {
		return this._client.hdel(this._getKeyWithPrefix(key), values).catch(this._handleError);
	}

	hLen(key) {
		return this._client.hlen(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	/**
	 * Get all fieldNames from hSet by key
	 * @param key
	 */
	hFields(key) {
		return this._client.hkeys(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	hExists(key, field) {
		return this._client.hexists(this._getKeyWithPrefix(key), field).catch(this._handleError);
	}

	/* **********************************************WORKING WITH LISTS********************************************** */

	/**
	 *
	 * @param key
	 * @param values
	 * @returns {int} the length of the resulting list
	 */
	lHeadPush(key, ...values) {
		return this._client.lpush(this._getKeyWithPrefix(key), values).catch(this._handleError);
	}

	lTailPush(key, ...values) {
		return this._client.rpush(this._getKeyWithPrefix(key), values).catch(this._handleError);
	}

	/**
	 *
	 * @param key
	 * @returns {int} the length of the resulting list
	 */
	lFirstPop(key) {
		return this._client.lpop(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	lLastPop(key) {
		return this._client.rpop(this._getKeyWithPrefix(key)).catch(this._handleError);
	}

	lSet(key, index, value) {
		return this._client.lset(this._getKeyWithPrefix(key), index, value).catch(this._handleError);
	}

	lGetAtIndex(key, index) {
		return this._client.lindex(this._getKeyWithPrefix(key), index).catch(this._handleError);
	}

	lInsert(key, toInsert, before) {
		return this._client.linsert(this._getKeyWithPrefix(key), before, toInsert).catch(this._handleError);
	}

	lGetRange(key, from, to) {
		return this._client.lrange(this._getKeyWithPrefix(key), from, to).catch(this._handleError);
	}

	/**
	 *
	 * @param key
	 * @param count how many occurances to remove. If negative - starts from end; Else - from start
	 * @param value
	 * @returns {*}
	 */
	lRem(key, count, value) {
		return this._client.lrem(this._getKeyWithPrefix(key), count, value).catch(this._handleError);
	}

	lLength(key) {
		return this._client.llen(this._getKeyWithPrefix(key)).catch(this._handleError);
	}
}

module.exports = RedisUtils;
