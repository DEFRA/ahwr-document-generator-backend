import { config } from '../config.js'
import { SqsSubscriber } from 'ffc-ahwr-common-library'
import { processDocumentRequest } from './process-document-request.js'
import { createLogger } from '../common/helpers/logging/logger.js'

let documentRequestSubscriber

export async function configureAndStart(db) {
  documentRequestSubscriber = new SqsSubscriber({
    queueUrl: config.get('sqs.documentRequestQueueUrl'),
    logger: createLogger(),
    region: config.get('aws.region'),
    awsEndpointUrl: config.get('aws.endpointUrl'),
    async onMessage(message) {
      await processDocumentRequest(createLogger(), message, db)
    }
  })
  await documentRequestSubscriber.start()
}

export async function stopSubscriber() {
  if (documentRequestSubscriber) {
    await documentRequestSubscriber.stop()
  }
}
