const { uuid } = require('uuidv4');
const logger = require("../loaders/logger");
const { query, body, validationResult } = require("express-validator");
const Leasing = require("../services/Leasing");
// const Redis = require("../services/Redis");

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

exports.patchDeposit = async (req, res) => { 
  await body('balance').not().isEmpty().withMessage("balance can not be empty!").isNumeric().withMessage('Incorrect balance format').run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try{
    const updated = await Leasing.patchDeposit(req.user, req.body?.balance);
    res.status(200).json(updated);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};

exports.patchWithdraw = async (req, res) => { 
  await body('balance').not().isEmpty().withMessage("balance can not be empty!").isNumeric().withMessage('Incorrect balance format').run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try{
    const updated = await Leasing.patchWithdraw(req.user, req.body?.balance);
    res.status(200).json(updated);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};

exports.postInvoice = async (req, res) => { 
	await body("accountId").not().isEmpty().trim().withMessage('accountId can not be empty!').isString().withMessage('Incorrect accountId format').run(req);
	await body("carId").not().isEmpty().trim().withMessage('carId can not be empty!').isString().withMessage('Incorrect carId format').run(req);
	await body("leasingId").not().isEmpty().trim().withMessage('leasingId can not be empty!').isString().withMessage('Incorrect leasingId format').run(req);
	await body("dp").not().isEmpty().trim().withMessage('dp can not be empty!').isNumeric().withMessage('Incorrect dp format').run(req);

  const errors = customValidationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  try{
    const updated = await Leasing.postInvoice(req.body);
    res.status(200).json(updated);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};

exports.getInvoice = async (req, res) => { 
  try{
    const getInvoice = await Leasing.getInvoice(req.params);
    res.status(200).json(getInvoice.data);
  }catch (err) {
    logger.error("🔥 error: %o", err);
    throw new Error(err);
  }
};
