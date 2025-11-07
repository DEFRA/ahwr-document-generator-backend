import { generateDocument } from '../document/index.js'
import { validateDocumentRequest } from './document-request-schema.js'
import { publishDocumentCreatedEvent } from './publish-document-created.js'

export const processDocumentRequest = async (logger, message, db) => {
  try {
    const messageBody = message.body
    if (validateDocumentRequest(logger, messageBody)) {
      logger.setBindings({
        reference: messageBody.reference,
        sbi: messageBody.sbi,
        crn: messageBody.crn,
        userType: messageBody.userType
      })
      const { blob } = await generateDocument(logger, messageBody, db)
      // Save to S3, then send outbound SNS request
      await publishDocumentCreatedEvent(logger, messageBody, blob)
    }
  } catch (err) {
    logger.error(`Unable to complete document generation request: ${err}`)
  }
}
