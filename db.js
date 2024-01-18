const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('test', 'postgres', 'Napoleon1703', {
    host: 'db',
    dialect: 'postgres',
    port: 5432,
    logging: false,
    pool: {
      max: 10,    
      min: 0,     
      acquire: 30000, 
      idle: 10000 
    },
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = {
  sequelize,
  User,
};
