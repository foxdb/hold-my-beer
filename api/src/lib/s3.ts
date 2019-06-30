import * as AWS from 'aws-sdk'

let s3

// for testing purposes only
export const setS3 = (s3instance: AWS.S3 | undefined) => {
  s3 = s3instance
}

export const getS3 = () => {
  if (s3) {
    return s3
  } else {
    s3 = new AWS.S3()
    return s3
  }
}

export const getFile = async (
  s3: AWS.S3,
  bucket: string,
  path: string
): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucket, //'raspi-chill',
        Key: path // 'logs/' + logFile
      },
      (err, data) => {
        if (err || !data || !data.Body) {
          console.log(err, err.stack)
          reject(err)
        } else {
          resolve(data.Body.toString())
        }
      }
    )
  })

interface BucketFile {
  path: string
  lastModified: any
}

export const lsDirectory = async (
  s3: AWS.S3,
  bucket: string,
  path: string
): Promise<BucketFile[]> =>
  new Promise<BucketFile[]>((resolve, reject) => {
    s3.listObjects({ Bucket: bucket, Prefix: path }, (err, data) => {
      if (err || !data || !data.Contents) {
        console.log(err, err.stack)
        reject(err)
      } else {
        if (!data.Contents || data.Contents.length === 0) {
          resolve([])
        } else {
          const files = data.Contents.filter(
            item => item && item.Key && item.LastModified
          ).map(item => {
            return {
              path: item.Key,
              lastModified: item.LastModified
            }
          })
          resolve(files as BucketFile[])
        }
      }
    })
  })
