import { publishMessage, setupClient } from 'ffc-ahwr-common-library'
import { config } from '../config.js'
import { getLogger } from '../common/helpers/logging/logger.js'
import { metricsCounter } from '../common/helpers/metrics.js'

let clientConfigured
export async function publishDocumentCreatedEvent(logger, messageBody, fileName) {
  if (!clientConfigured) {
    setupClient(
      config.get('aws.region'),
      config.get('aws.endpointUrl'),
      getLogger(),
      config.get('sns.documentCreatedTopicArn')
    )
    clientConfigured = true
  }

  const { crn, reference, sbi, userType } = messageBody

  const documentCreatedEvent = {
    crn,
    sbi,
    userType,
    documentLocation: fileName,
    applicationReference: reference
  }

  const attributes = {
    eventType: 'uk.gov.ffc.ahwr.document.created'
  }

  await publishMessage(documentCreatedEvent, attributes)

  logger.info('Document created event published')
  await metricsCounter('outbound-document-created-event-published')
}
