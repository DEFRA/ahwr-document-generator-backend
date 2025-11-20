// import { REDACT_PII_VALUES } from 'ffc-ahwr-common-library'

import { REDACT_PII_VALUES } from 'ffc-ahwr-common-library'

const COLLECTION = 'documentlog'

export const createLogEntry = async (db, data, fileName) => {
  const { reference } = data
  return db.collection(COLLECTION).insertOne({
    reference,
    createdAt: new Date(),
    updatedAt: new Date(),
    fileName,
    status: 'document-generated',
    inputData: data
  })
}

export const redactPII = async (db, agreementReference, logger) => {
  const result = await db.collection(COLLECTION).updateOne(
    { reference: agreementReference },
    {
      $set: {
        'inputData.name': REDACT_PII_VALUES.REDACTED_NAME,
        'inputData.email': REDACT_PII_VALUES.REDACTED_EMAIL,
        'inputData.orgEmail': REDACT_PII_VALUES.REDACTED_EMAIL,
        'inputData.farmerName': REDACT_PII_VALUES.REDACTED_FARMER_NAME,
        updatedAt: new Date()
      }
    }
  )

  const totalUpdates = result.modifiedCount

  if (totalUpdates > 0) {
    logger.info(
      `Total redacted message documents: ${totalUpdates} for agreementReference: ${agreementReference}`
    )
  } else {
    logger.info(`No message documents updated for agreementReference: ${agreementReference}`)
  }
}
