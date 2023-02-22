const config = require('../config');
const models = require("../models");
const sequelize = models.sequelize;
const logger = require('../loaders/logger');

module.exports = class Leasing {
	static async patchDeposit(user, balance) {
		let values, transaction, clauses;
	
		transaction = await sequelize.transaction();
		clauses = { ...clauses, where: { email: user.email }, transaction };
	
		try {
			const findUser = await models.Accounts.findOne({
				where: { email: user.email},
				attributes: [
					'id',
					'name',
					'email',
					'phone',
					'balance',
				],
			});
			
			if (!findUser) {
				return false;
			}

			values = { ...values, balance: balance + findUser.balance };

			await models.Accounts.update(values, clauses);
	
			await transaction.commit();
			const result = {
				name: findUser.name,
				email: findUser.email,
				phone: findUser.phone,
				balance: findUser.balance + balance
			}
			return result;
		} catch (err) {
			logger.error(err);
			await transaction.rollback();
			throw new Error(
				'Failed to deposit, check submited value [DB Error]',
			);
		}
	}

	static async patchWithdraw(user, balance) {
		let values, transaction, clauses;
	
		transaction = await sequelize.transaction();
		clauses = { ...clauses, where: { email: user.email }, transaction };
		
		try {
			const findUser = await models.Accounts.findOne({
				where: { email: user.email},
				attributes: [
					'id',
					'name',
					'email',
					'phone',
					'balance',
				],
			});
			
			if (!findUser || findUser.balance < balance) {
				return false;
			}

			values = { ...values, balance: findUser.balance - balance };

			await models.Accounts.update(values, clauses);
	
			await transaction.commit();
			const result = {
				name: findUser.name,
				email: findUser.email,
				phone: findUser.phone,
				balance: findUser.balance - balance
			}
			return result;
		} catch (err) {
			logger.error(err);
			await transaction.rollback();
			throw new Error(
				'Failed to withdraw, check submited value [DB Error]',
			);
		}
	}

	static async postInvoice(values) {
		try {
			const findCar = await models.Cars.findOne({
				where: { id: values.carId },
			});
			const findLeasing = await models.Leasing.findOne({
				where: { id: values.leasingId },
			});

			const now = new Date();
			await models.Invoice.create({ 
				accountId: values.accountId,
				carId: values.carId,
				leasingId: values.leasingId,
				loanPrinciple: findCar.price - dp, 
				term: findCar.term,
				nextPayment: new Date(now.getFullYear(), now.getMonth()+1, 1)
			});
			const data = {
				accountId: values.accountId,
				Car: findCar,
				Leasing: findLeasing,
				loanPrinciple: findCar.price - dp,
				term: findCar.term,
				nextPayment: new Date(now.getFullYear(), now.getMonth()+1, 1)
			};
			return { status: 200, data }; 
		} catch (err) {
			logger.error(err);
			throw new Error(
				'Failed to create invoice, check submited value [DB Error]',
			);
		}
	}

	static async getInvoice(values) {
		try {
			const invoice = await models.Invoice.findOne({
				where: { id: values.id },
			});
			
			const data = {
				...invoice,
			};
			return { status: 200, data }; 
		} catch (err) {
			logger.error(err);
			throw new Error(
				'Failed to get invoice, check submited value [DB Error]',
			);
		}
	}
};
