// models/groceryitem.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroceryItem extends Model {
    // Define any associations or methods here
  }

  GroceryItem.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL(10, 2),
      inventory: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'GroceryItem',
    }
  );

  return GroceryItem;
};
