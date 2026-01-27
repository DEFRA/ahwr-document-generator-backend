import Joi from 'joi'
import { getDocumentLogsHandler } from './support-controller.js'

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
  }
]
