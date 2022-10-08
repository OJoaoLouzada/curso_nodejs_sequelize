// Objeto do sequelize que dá acesso a todos os tipos de dados que existem no banco
const { DataTypes } = require('sequelize')

// Conexão com o banco
const db = require('../db/conn')

// Definindo as colunas e os tipos de dados da tabela. ID ele já cria automaticamente
const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  occupation: {
    type: DataTypes.STRING,
    required: true
  },
  newsletter: {
    type: DataTypes.BOOLEAN,
  },
})

module.exports = User