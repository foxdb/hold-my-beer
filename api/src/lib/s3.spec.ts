import * as AWSMock from 'aws-sdk-mock'
import * as AWS from 'aws-sdk'
import { lsDirectory, getFile, getS3 } from './s3'
import { listObjectsMock } from '../../test/data/listObjects'
import { getObjectMock } from '../../test/data/getObject'

let s3

describe('s3', () => {
  describe('lsDirectory', () => {
    const targetBucket = 'mybucket'
    const targetPath = 'mypath'
    let directoryContents
    let calledWithParams

    beforeAll(async () => {
      AWSMock.setSDKInstance(AWS)
      AWSMock.mock('S3', 'listObjects', (params, callback) => {
        calledWithParams = params
        return callback(null, listObjectsMock)
      })
      s3 = new AWS.S3()
      directoryContents = await lsDirectory(s3, targetBucket, targetPath)
    })

    afterAll(() => {
      AWSMock.restore()
    })

    it('calls s3 with the correct params', () => {
      expect(calledWithParams).toEqual({
        Bucket: targetBucket,
        Prefix: targetPath
      })
    })

    it('returns an array of files with path and lastModified', async () => {
      expect(directoryContents.length).toEqual(30)

      expect(directoryContents[0].path).toEqual(
        'logs/20190413_15-53-51-raw-spindel.log'
      )

      expect(directoryContents[0].lastModified).toEqual(
        '2019-04-13T05:55:05.000Z'
      )
    })

    it('removes invalid s3 objects (no Key or no LastModified)', async () => {
      expect(
        directoryContents.find(
          item =>
            item.path === 'logs/20190413_15-53-51-internal-temperature.log'
        )
      ).toEqual(undefined)
    })
  })

  describe('getFile', () => {
    const targetBucket = 'mybucket'
    const targetPath = 'mypath'
    let calledWithParams

    beforeAll(async () => {
      AWSMock.setSDKInstance(AWS)
      AWSMock.mock('S3', 'getObject', (params, callback) => {
        calledWithParams = params
        return callback(null, getObjectMock)
      })
      s3 = new AWS.S3()
      await getFile(s3, targetBucket, targetPath)
    })

    afterAll(() => {
      AWSMock.restore()
    })

    it('calls s3 with the correct params', () => {
      expect(calledWithParams).toEqual({
        Bucket: targetBucket,
        Key: targetPath
      })
    })
  })

  describe('getS3', () => {
    it('gets an s3 client', () => {
      expect(getS3()).toHaveProperty('listObjects')
    })

    it('gets an s3 client for the second time', () => {
      expect(getS3()).toHaveProperty('listObjects')
    })
  })
})
