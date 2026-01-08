import joi from 'joi'
import { SUPPORTED_SCHEMES } from 'ffc-ahwr-common-library'

const eventSchema = joi.object({
  reference: joi.string().required(),
  sbi: joi.string().required(),
  crn: joi.string().optional(),
  startDate: joi.date().required(),
  userType: joi.string().optional(),
  email: joi.string().email({ tlds: false }).optional(),
  orgEmail: joi.string().email({ tlds: false }).optional(),
  name: joi.string().optional(),
  farmerName: joi.string().optional(),
  scheme: joi
    .string()
    .valid(...SUPPORTED_SCHEMES)
    .optional(),
  templateId: joi.string().optional()
})

export const validateDocumentRequest = (logger, event) => {
  const { error } = eventSchema.validate(event, {
    abortEarly: false
  })
  if (error) {
    logger.error(
      {
        error,
        event: {
          type: 'exception',
          category: 'fail-validation',
          kind: 'inbound-document-request-validation',
          reason: JSON.stringify(error.details)
        }
      },
      'Document request validation error'
    )
    return false
  }

  return true
}
