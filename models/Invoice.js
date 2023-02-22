"use strict";
module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        references: {
          model: "Accounts",
          key: "id",
        },
      },
      carId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        references: {
          model: "Cars",
          key: "id",
        },
      },
      leasingId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        references: {
          model: "Leasings",
          key: "id",
        },
      },
      loanPrinciple: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      term: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amountLeft: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nextPayment: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      paymentsDue: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
    },
    {
      underscored: true,
      timestamps: false,
      modelName: "Invoice",
    }
  );

  Invoice.associate = function (models) {
    Invoice.belongsTo(models.Accounts, { as: "Accounts", constraints: false, foreignKey: "accountId", sourceKey: "id" });
    Invoice.belongsTo(models.Cars, { as: "Cars", constraints: false, foreignKey: "carId", sourceKey: "id" });
    Invoice.belongsTo(models.Leasings, { as: "Leasings", constraints: false, foreignKey: "leasingId", sourceKey: "id" });
   };
  return Invoice;
};
