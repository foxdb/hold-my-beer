const { Sequelize } = require('sequelize')
import { database } from '../../config'
import Project from './models/project'

// https://sequelize.org/master/manual/typescript.html

const sequelize = new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    dialect: 'postgres',
  }
)

const models = {
  Project: Project(sequelize),
}

Object.keys(models).forEach((modelName) => {
  const model = models[modelName]
  if ('associate' in model) {
    model['associate'](models)
  }
})

const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

const syncSchemas = async () => {
  await sequelize.sync()
}

export { sequelize, models, testConnection, syncSchemas }
