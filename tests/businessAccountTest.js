"use strict";

const chai = require('chai');
const expect = chai.expect();
chai.should();

const ApplicationServer = require('../app/server');
const applicationServer = new ApplicationServer();

const httpConfig = require('../config/http');
const routesConfig = require('../config/routes');
const baseUrl = `localhost:${httpConfig.PORT}`;

applicationServer.start();

const request = require('supertest');
const redisService = require('../services/redisService');

before(done => {
	done();
});

after(done => {
	redisService.getClientByDbNumber(1).flushDb().then(result => {
		done();
	});
});

describe('Testing business account authorization', () => {
	describe('Set phone number', () => {
		it('should be okey', done => {
			request(baseUrl)
				.post(`/authorization/phone/set/9805117625/7`)
				// .expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					// console.log(res.body);
					done();
				});
		});
	});
	
	describe('Set phone number', () => {
		it('should be okey', () => {
			
		});
	});
});