import { getFile, lsDirectory } from '../lib/s3'
import { validatePathParam } from './helpers'

export const getProjects = async (event, context) => {
  try {
    const projects = await getProjectsList()
    return {
      statusCode: 200,
      body: JSON.stringify({
        projects
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getProject = async (event, context) => {
  try {
    const requestedProject = validatePathParam('projectName', event)
    const projectLogs = await getProjectLogs(requestedProject)

    return {
      statusCode: 200,
      body: JSON.stringify({
        project: {
          name: requestedProject,
          logs: projectLogs
        }
      }),
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getProjectLogs = async (name: string): Promise<string[]> => {
  const logsDirContent = await lsDirectory(
    process.env.logsBucketName as string,
    process.env.logsPath as string
  )

  // refactor, add s3 helper to do that
  return logsDirContent
    .filter(
      file =>
        file.path && file.path.includes(name) && !file.path.includes('.bak')
    )
    .map(file => file.path.replace(process.env.logsPath + '/', ''))
}

export const getProjectsList = async () => {
  const rawProjects = await getFile(
    process.env.logsBucketName as string,
    process.env.projectsFileName as string
  )

  return rawProjects.split('\n')
}
