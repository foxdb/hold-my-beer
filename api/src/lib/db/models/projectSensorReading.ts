import * as Sequelize from 'sequelize'
import { Model, BuildOptions } from 'sequelize'
import { Type } from './reading'

export interface ProjectSensorReadingModel extends Model {
  id: string
  projectId: string
  sensorId: string
  readingType: Type
}

type ProjectSensorReadingModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProjectSensorReadingModel
}

const ProjectSensorReadingFactory = (
  sequelize: Sequelize.Sequelize
): ProjectSensorReadingModelStatic => {
  const ProjectSensorReading = <ProjectSensorReadingModelStatic>(
    sequelize.define(
      'ProjectSensorReading',
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        readingType: {
          type: Sequelize.ENUM({
            values: [
              'TEMPERATURE',
              'SPECIFIC_GRAVITY',
              'BATTERY',
              'ANGLE',
              'RSSI',
              'RAW',
            ],
          }),
          allowNull: false,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        tableName: 'project_sensor_reading',
        timestamps: true,
        underscored: true,
      }
    )
  )

  return ProjectSensorReading
}

export default ProjectSensorReadingFactory
