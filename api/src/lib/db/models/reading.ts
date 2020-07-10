import * as Sequelize from 'sequelize'
import { Model, BuildOptions } from 'sequelize'

type Type = 'TEMPERATURE' | 'SPECIFIC_GRAVITY' | 'BATTERY' | 'ANGLE' | 'RSSI'

export interface ReadingModel extends Model {
  id: string
  type: Type
  value: number
  unit: string
  raw: object
  createdAt: Date
  updatedAt: Date
}

type ReadingModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ReadingModel
}

const ReadingFactory = (sequelize: Sequelize.Sequelize): ReadingModelStatic => {
  const Reading = <ReadingModelStatic>sequelize.define(
    'Reading',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
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
      value: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      raw: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'reading',
      timestamps: true,
      underscored: true,
    }
  )

  return Reading
}

export default ReadingFactory
