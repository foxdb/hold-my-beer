import * as AWSMock from 'aws-sdk-mock'
import * as AWS from 'aws-sdk'
import { setS3 } from '../../src/lib/s3'

interface S3MockData {
  listObjects: any
  getObject: any
}

let s3: AWS.S3

export const mockS3 = (mockData: S3MockData) => {
  AWSMock.setSDKInstance(AWS)
  AWSMock.mock('S3', 'listObjects', (params, callback) => {
    return callback(null, mockData.listObjects)
  })
  AWSMock.mock('S3', 'getObject', (params, callback) => {
    return callback(null, mockData.getObject)
  })
  s3 = new AWS.S3()
  setS3(s3)
  return s3
}

export const clearMocks = () => {
  AWSMock.restore()
  setS3(undefined)
}
