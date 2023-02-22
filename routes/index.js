const { Router } = require("express");

// ROUTES
const authenticate = require("./authenticate");
const leasing = require("./leasing");

module.exports = () => {
  const app = Router();

  authenticate(app);
  leasing(app);

  return app;
};