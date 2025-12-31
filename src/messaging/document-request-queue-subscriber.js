import { config } from '../config.js'
import { SqsSubscriber } from 'ffc-ahwr-common-library'
import { processDocumentRequest } from './process-document-request.js'
import { getLogger } from '../common/helpers/logging/logger.js'

let documentRequestSubscriber

export async function configureAndStart(db) {
  const onMessage = async (message, attributes) => {
    const logger = getLogger().child({})
    logger.info(attributes, 'Received incoming message')
    await processDocumentRequest(logger, message, db)
  }
  documentRequestSubscriber = new SqsSubscriber({
    queueUrl: config.get('sqs.documentRequestQueueUrl'),
    logger: getLogger().child({}),
    region: config.get('aws.region'),
    awsEndpointUrl: config.get('aws.endpointUrl'),
    onMessage
  })
  await documentRequestSubscriber.start()
  return onMessage
}

export async function stopSubscriber() {
  if (documentRequestSubscriber) {
    await documentRequestSubscriber.stop()
  }
}
