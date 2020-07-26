'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Task);
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true,
      }
    },
    phone: DataTypes.STRING,
    country_code: DataTypes.STRING,
    password: { type: DataTypes.STRING, validate: { notEmpty: true, } },
    name: { type: DataTypes.STRING, validate: { notEmpty: true, } },
    active: DataTypes.BOOLEAN
  }, {
    //it is excludng my password even when i'm login
    // defaultScope: {
    //   attributes: { exclude: ['password'] },
    // },
    sequelize,
    modelName: 'User',
  });
  return User;
};