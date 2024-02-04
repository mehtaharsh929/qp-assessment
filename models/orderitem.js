// models/orderitem.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderItem.belongsTo(models.GroceryItem, { foreignKey: 'groceryItemId' });
    }
  }

  OrderItem.init(
    {
      orderId: DataTypes.INTEGER,
      groceryItemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
    }
  );

  return OrderItem;
};
