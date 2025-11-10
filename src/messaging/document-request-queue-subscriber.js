import { config } from '../config.js'
import { SqsSubscriber } from 'ffc-ahwr-common-library'
import { processDocumentRequest } from './process-document-request.js'
import { getLogger } from '../common/helpers/logging/logger.js'

let documentRequestSubscriber

export async function configureAndStart(db) {
  documentRequestSubscriber = new SqsSubscriber({
    queueUrl: config.get('sqs.documentRequestQueueUrl'),
    logger: getLogger(),
    region: config.get('aws.region'),
    awsEndpointUrl: config.get('aws.endpointUrl'),
    async onMessage(message, attributes) {
      getLogger().info(attributes, 'Received incoming message')
      await processDocumentRequest(getLogger(), message, db)
    }
  })
  await documentRequestSubscriber.start()
}

export async function stopSubscriber() {
  if (documentRequestSubscriber) {
    await documentRequestSubscriber.stop()
  }
}
