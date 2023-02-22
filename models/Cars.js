"use strict";
module.exports = (sequelize, Sequelize) => {
  const Cars = sequelize.define(
    "Cars",
    {
      id: {
        type: Sequelize.STRING(255),
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      brandName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groupModelName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      year: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
    },
    {
      underscored: true,
      timestamps: false,
      modelName: "Cars",
    }
  );

  Cars.associate = function (models) {
    Cars.hasMany(models.Accounts, {as: 'Accounts'})
   };
  return Cars;
};
