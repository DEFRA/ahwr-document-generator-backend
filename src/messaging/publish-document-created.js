import { publishMessage, setupClient } from 'ffc-ahwr-common-library'
import { config } from '../config.js'
import { getLogger } from '../common/helpers/logging/logger.js'

let clientConfigured
export async function publishDocumentCreatedEvent(
  logger,
  messageBody,
  fileName
) {
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

  await publishMessage(documentCreatedEvent)

  logger.info('Document created event published')
}
