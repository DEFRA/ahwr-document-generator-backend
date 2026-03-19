import { StatusCodes } from 'http-status-codes'
import Boom from '@hapi/boom'
import { getLogEntriesByAgreementRef } from '../../repositories/document-log-repository.js'
import { sqsClient } from 'ffc-ahwr-common-library'
import { config } from '../../config.js'
import { QueueDoesNotExist } from '@aws-sdk/client-sqs'

export const getDocumentLogsHandler = async (request, h) => {
  try {
    const {
      db,
      logger,
      query: { agreementReference }
    } = request
    logger.info(`Retrieving document logs with agreementReference: ${agreementReference}`)

    const documentLogs = await getLogEntriesByAgreementRef(db, agreementReference)

    return h.response({ data: documentLogs }).code(StatusCodes.OK)
  } catch (error) {
    request.logger.error({ error }, 'Failed to retrieve document logs')

    if (Boom.isBoom(error)) {
      throw error
    }

    throw Boom.internal(error)
  }
}

export const supportQueueMessagesHandler = async (request, h) => {
  const { queueUrl, limit } = request.query

  try {
    const region = config.get('aws.region')
    const endpointUrl = config.get('aws.endpointUrl')

    sqsClient.setupClient(region, endpointUrl, request.logger)

    const messages = await sqsClient.peekMessages(queueUrl, limit)

    return h.response(messages).code(StatusCodes.OK)
  } catch (error) {
    request.logger.error({ error }, 'Failed to get queue messages')

    if (error instanceof QueueDoesNotExist) {
      throw Boom.notFound(`Queue not found: ${queueUrl}`)
    }

    if (Boom.isBoom(error)) {
      throw error
    }

    throw Boom.internal(error)
  }
}
