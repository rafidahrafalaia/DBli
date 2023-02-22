const models = require("../models");
const Sequelize = models.Sequelize;
const sequelize = models.sequelize;
const Op = Sequelize.Op;
const logger = require("../loaders/logger");
const { body, validationResult } = require("express-validator");
const User = require("../services/Leasing");
// SERVICE
const Authenticate = require("../services/Authenticate");

const customValidationResult = validationResult.withDefaults({
	formatter: (error) => {
	  return {
		param: error.param,
		value: error.value,
		location: error.location,
		message: error.msg,
	  };
	},
  });

exports.validateLogin = async (req, res) => {
	await body('email')
		.not()
		.isEmpty()
		.trim()
		.withMessage('Must provide an email')
		.isEmail()
		.withMessage('Incorrect email format')
		.run(req);

	await body('password')
		.not()
		.isEmpty()
		.trim()
		.withMessage('Must provide a Password')
		.isLength({ min: 4 })
		.withMessage('Password must be more than 3 characters')
		.run(req);

    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
			
	try {
		const result = await Authenticate.GenerateToken(req.body, req, true);
		// Unauthorized domain access error
		if (result === 404) {
			return res.status(404).json({ errors: [{ message: "user not found" }] });
		}
		if (result === 401) {
			return res.status(401).json({ errors: [{ message: "password is incorrect" }] });
		}
				
		const { access_token, user } = result;
		// await models.user_active_sessions.upsert({
		// 	user_id: user.id,
		// 	access_token
		// });
	
		res.status(200).json({
			user,
			access_jwt: access_token,
		});
		} catch (err) {
			logger.error('🔥 error: %o', err);
			return err;
		}
	// });
};

 // Create and Save a new User
 exports.postUser = async (req, res) => {
	await body("name").not().isEmpty().withMessage("name can not be empty!").isString().withMessage('Incorrect username format').run(req);
	await body("email").not().isEmpty().trim().withMessage('email can not be empty!').isEmail().withMessage('Incorrect email format').run(req);
	await body("phone").not().isEmpty().trim().withMessage('phone can not be empty!').isString().withMessage('Incorrect phone format').run(req);
	await body("carId").not().isEmpty().trim().withMessage('carId can not be empty!').isString().withMessage('Incorrect carId format').run(req);
	await body("leasingId").not().isEmpty().trim().withMessage('leasingId can not be empty!').isString().withMessage('Incorrect leasingId format').run(req);
  
	const errors = customValidationResult(req);
	if (!errors.isEmpty()) {
	  return res.status(400).json({ errors: errors.array() });
	}
	try{
	  // Create a User
	  const created = await Authenticate.register(req.body);
	  // await
	  res.status(created.status).json(created.data);
	}catch (err) {
	  logger.error("🔥 error: %o", err);
	  throw new Error(err);
	}
  };

exports.isLogin = async (req, res, next) => {
	let token = req.headers.authorization.split(' ')[1];
	const validate = await Authenticate.validSession(token);
	if (!validate) {
		return res.status(403).json({ error: 'Access Forbidden' });
	}
	console.log(validate,"AKLAKL")
	req.user = validate;
	next();
};