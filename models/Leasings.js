"use strict";
module.exports = (sequelize, Sequelize) => {
  const Leasings = sequelize.define(
    "Leasings",
    {
      id: {
        type: Sequelize.STRING(255),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rates: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      terms: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
      modelName: "Leasings",
    }
  );

  Leasings.associate = function (models) {
    Leasings.hasMany(models.Accounts, {as: 'Accounts'})
   };
  return Leasings;
};
