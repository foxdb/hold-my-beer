const { Sequelize } = require('sequelize')
import { database } from '../../config'
import Project from './models/project'
import Sensor from './models/sensor'
import Reading from './models/reading'
import ProjectSensorReading from './models/projectSensorReading'

// https://sequelize.org/master/manual/typescript.html

const sequelize = new Sequelize(
  database.database,
  database.username,
  database.password,
  {
    host: database.host,
    port: database.port,
    dialect: 'postgres',
  }
)

const models = {
  Project: Project(sequelize),
  Sensor: Sensor(sequelize),
  Reading: Reading(sequelize),
  ProjectSensorReading: ProjectSensorReading(sequelize),
}

models.Sensor.hasMany(models.Reading, {
  as: 'readings',
})

models.ProjectSensorReading.belongsTo(models.Project)
models.ProjectSensorReading.belongsTo(models.Sensor)

// Object.keys(models).forEach((modelName) => {
//   const model = models[modelName]
//   if ('associate' in model) {
//     model['associate'](models)
//   }
// })

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
