const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Address = db.define('Address', {
  street: {
    type: DataTypes.STRING,
    required: true
  },
  number: {
    type: DataTypes.STRING,
    required: true
  },
  city: {
    type: DataTypes.STRING,
    required: true
  }
})


// Dentro da tabela Address eu quero um campo chamado User que relacione o endereço a um usuário
Address.belongsTo(User)

module.exports = Address