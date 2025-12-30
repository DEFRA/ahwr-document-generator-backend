import { generateDocument } from '../document/index.js'
import { validateDocumentRequest } from './document-request-schema.js'
import { publishDocumentCreatedEvent } from './publish-document-created.js'
import { metricsCounter } from '../common/helpers/metrics.js'

export const processDocumentRequest = async (logger, message, db) => {
  await metricsCounter('inbound-process-document-request-received')
  if (validateDocumentRequest(logger, message)) {
    await metricsCounter('inbound-process-document-request-valid')
    logger.setBindings({
      reference: message.reference,
      sbi: message.sbi,
      crn: message.crn,
      userType: message.userType
    })
    const { filename } = await generateDocument(logger, message, db)
    // Send outbound SNS request
    await publishDocumentCreatedEvent(logger, message, filename)
  } else {
    logger.error(
      `Unable to complete document generation request as the request is invalid: ${JSON.stringify(message)}`
    )
    throw new Error('Invalid document request')
  }
}
