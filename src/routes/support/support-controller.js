import { StatusCodes } from 'http-status-codes'
import Boom from '@hapi/boom'
import { getLogEntriesByAgreementRef } from '../../repositories/document-log-repository.js'

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
