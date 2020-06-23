import * as Sequelize from 'sequelize'
import { Model, BuildOptions } from 'sequelize'

interface ProjectModel extends Model {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

type ProjectModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProjectModel
}

const ProjectFactory = (sequelize: Sequelize.Sequelize): ProjectModelStatic => {
  const Project = <ProjectModelStatic>sequelize.define(
    'Project',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'project',
      timestamps: true,
      underscored: true,
    }
  )

  return Project
}

export default ProjectFactory
