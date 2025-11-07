import { generateDocument } from '../document/index.js'
import { validateDocumentRequest } from './document-request-schema.js'
import { publishDocumentCreatedEvent } from './publish-document-created.js'

export const processDocumentRequest = async (logger, message, db) => {
  const messageBody = message.body
  if (validateDocumentRequest(logger, messageBody)) {
    logger.setBindings({
      reference: messageBody.reference,
      sbi: messageBody.sbi,
      crn: messageBody.crn,
      userType: messageBody.userType
    })
    const { fileName } = await generateDocument(logger, messageBody, db)
    // Send outbound SNS request
    await publishDocumentCreatedEvent(logger, messageBody, fileName)
  } else {
    logger.error(
      `Unable to complete document generation request as the request is invalid: ${JSON.stringify(messageBody)}`
    )
    throw new Error('Invalid document request')
  }
}
