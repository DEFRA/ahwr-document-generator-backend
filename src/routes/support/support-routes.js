import Joi from 'joi'
import { getDocumentLogsHandler, supportQueueMessagesHandler } from './support-controller.js'

export const supportRoutes = [
  {
    method: 'GET',
    path: '/api/support/document-logs',
    options: {
      description: 'Get document logs',
      validate: {
        query: Joi.object({
          agreementReference: Joi.string().required()
        })
      },
      handler: getDocumentLogsHandler
    }
  },
  {
    method: 'GET',
    path: '/api/support/queue-messages',
    options: {
      description: 'Get queue messages by url',
      validate: {
        query: Joi.object({
          queueUrl: Joi.string().required(),
          limit: Joi.string().required()
        })
      },
      handler: supportQueueMessagesHandler
    }
  }
]
