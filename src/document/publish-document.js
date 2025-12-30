import { createFileName } from './create-filename.js'
import { uploadBlob } from '../storage/s3-interactions.js'
import { createLogEntry } from '../repositories/document-log-repository.js'

export const publishDocument = (logger, pdfDocGenerator, data, db) => {
  const filename = createFileName(data)
  return new Promise((resolve, reject) => {
    const chunks = []

    pdfDocGenerator.on('data', (chunk) => chunks.push(chunk))

    pdfDocGenerator.on('end', async () => {
      logger.info(`Document ${filename} generated`)
      const blob = await uploadBlob(logger, filename, Buffer.concat(chunks))
      await createLogEntry(db, data, filename)
      logger.info({
        event: {
          type: 'document-generated',
          reference: `ref: ${data.reference}, sbi: ${data.sbi}`,
          kind: data.userType, // the userType is due to be retired, however capture for now
          category: data.scheme
        }
      })
      resolve({ filename, blob })
    })

    pdfDocGenerator.on('error', (err) => reject(err))

    pdfDocGenerator.end()
  })
}
