import * as Sequelize from 'sequelize'
import { Model, BuildOptions } from 'sequelize'
import { ReadingModel } from './reading'

export interface SensorModel extends Model {
  id: string
  externalId: string
  name: string
  type: string
  state: object
  Readings: ReadingModel
  createdAt: Date
  updatedAt: Date
}

type SensorModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): SensorModel
}

const SensorFactory = (sequelize: Sequelize.Sequelize): SensorModelStatic => {
  const Sensor = <SensorModelStatic>sequelize.define(
    'Sensor',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      externalId: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      state: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'sensor',
      timestamps: true,
      underscored: true,
    }
  )

  return Sensor
}

export default SensorFactory
