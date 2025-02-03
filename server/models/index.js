const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  zone: DataTypes.STRING,
  role: DataTypes.ENUM('admin', 'officer')
});

const Submission = sequelize.define('Submission', {
  date: DataTypes.DATE,
  zone: DataTypes.STRING,
  crime_no: DataTypes.STRING,
  seizure_type: DataTypes.ENUM('Fresh', 'Follow up'),
  joint_seizure: DataTypes.BOOLEAN,
  joint_agency: DataTypes.STRING,
  place: DataTypes.STRING,
  remarks: DataTypes.TEXT
});

const Drug = sequelize.define('Drug', {
  name: DataTypes.STRING,
  quantity: DataTypes.FLOAT,
  unit: DataTypes.ENUM('KG', 'Blot', 'Ampoule', 'Litre', 'Bottle')
});

const Arrest = sequelize.define('Arrest', {
  name: DataTypes.STRING,
  nationality: DataTypes.STRING,
  type: DataTypes.ENUM('Fresh', 'Follow up')
});

// Associations
User.hasMany(Submission);
Submission.hasMany(Drug);
Submission.hasMany(Arrest);

module.exports = { User, Submission, Drug, Arrest };