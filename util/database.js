const Sequelize = require('sequelize')

const sequelize = new Sequelize('nodeproject','root','SHa.arvind*99#',{dialect:'mysql',host:'localhost'})

module.exports = sequelize;