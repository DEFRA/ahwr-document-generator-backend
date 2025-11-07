import { generateDocument } from '../document/index.js'
import { validateDocumentRequest } from './document-request-schema.js'
import { publishDocumentCreatedEvent } from './publish-document-created.js'

export const processDocumentRequest = async (logger, message, db) => {
  if (validateDocumentRequest(logger, message)) {
    logger.setBindings({
      reference: message.reference,
      sbi: message.sbi,
      crn: message.crn,
      userType: message.userType
    })
    const { fileName } = await generateDocument(logger, message, db)
    // Send outbound SNS request
    await publishDocumentCreatedEvent(logger, message, fileName)
  } else {
    logger.error(
      `Unable to complete document generation request as the request is invalid: ${JSON.stringify(message)}`
    )
    throw new Error('Invalid document request')
  }
}
