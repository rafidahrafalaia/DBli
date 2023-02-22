let uuid = require('uuid');
uuid = uuid.v1;
const jwt = require('jsonwebtoken');
const models = require("../models");
const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;
var crypto = require('crypto');

// UTILS
const config = require('../config');
const logger = require('../loaders/logger');
const { mysqlDate } = require('../utils');

module.exports = class Authenticate {
	// GENERATE A TOKEN
	static async GenerateToken(client, req, generateSession) {
		generateSession =
			typeof generateSession != 'undefined' ? (generateSession != true ? false : true) : true;
		try {
			const user = await models.Accounts.findOne({
				where: { email: client.email },
				attributes: [
					'id',
					'name',
					'password',
					'phone',
					'email',
					'date_created',
				],
			});

			if(!user){
				return 404;
			}else if(crypto.createHash('sha256').update(client.password).digest('base64') !== user.password)
				return 401;

			const { id, name, email, phone } = user;

			const jwtclaims = {
				id,
				name,
				email,
				phone,
				token: 'access',
				expire: config.jwt.expire,
			};

			const access_token = jwt.sign(JSON.stringify(jwtclaims), config.jwt.secret);

			return { access_token, user };
		} catch (e) {
			logger.error('🔥 error: %o', e);
			return false;
		}
	}
	
	static async validSession(token){
		try{
			const decoded = jwt.verify(token, config.jwt.secret, (err, result) => { 
				if(err)
					return false; 
				return result;
			});
			return decoded;
		}catch(e){
			logger.error('🔥 error: %o', e);
			return false;
		}
	}

	static async register(values) {
		try {	
			await models.Accounts.create({ 
				phone: values.phone,
				name: values.name, 
				password: crypto.createHash('sha256').update(values.password).digest('base64'), 
				email: values.email,
			});
			const data = {
				message: 'User is created!'
			};
			return { status: 200, data }; 
		}catch (err) {
			logger.error(err);
			throw new Error(
				'Failed to register new user, check submited value [DB Error]',
			);
		}
	}
};
