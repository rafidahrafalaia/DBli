// GENERALS
const route = require("express").Router();
const leasing = require("../controllers/leasing.js");
const auth = require("../controllers/authenticate.js");

module.exports = (app) => {
	app.use("/", route);
  
	route.patch("/deposit", auth.isLogin, leasing.patchDeposit);
	route.patch("/withdraw", auth.isLogin, leasing.patchWithdraw);
	route.post("/invoice", auth.isLogin, leasing.postInvoice);
	route.get("/invoice/:id", auth.isLogin, leasing.getInvoice);
	// route.put("/", auth.isLogin, user.putUser);
	// route.delete("/", auth.isLogin, user.deleteUser);
	// route.get("/all", auth.isLogin, user.findAllUser);
};