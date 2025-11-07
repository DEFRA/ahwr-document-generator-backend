// import { REDACT_PII_VALUES } from 'ffc-ahwr-common-library'

export const createLogEntry = async (db, data, fileName) => {
  const { reference } = data
  return db.collection('documentlog').insertOne({
    reference,
    createdAt: new Date(),
    updatedAt: new Date(),
    fileName,
    status: 'document-generated',
    inputData: data
  })
}

export const redactPII = async (agreementReference, logger) => {
  // const redactedValueByField = {
  //   name: REDACT_PII_VALUES.REDACTED_NAME,
  //   email: REDACT_PII_VALUES.REDACTED_EMAIL,
  //   orgEmail: REDACT_PII_VALUES.REDACTED_ORG_EMAIL,
  //   farmerName: REDACT_PII_VALUES.REDACTED_FARMER_NAME
  // }

  const totalUpdates = 0

  // TODO: redact the fields in the JSON

  // for (const [field, redactedValue] of Object.entries(redactedValueByField)) {
  //   const [affectedCount] = await models.documentLog.update(
  //     {
  //       filename: REDACT_PII_VALUES.REDACTED_FILENAME,
  //       data: Sequelize.fn(
  //         'jsonb_set',
  //         Sequelize.col('data'),
  //         Sequelize.literal(`'{${field}}'`),
  //         Sequelize.literal(`'"${redactedValue}"'`)
  //       )
  //     },
  //     {
  //       where: {
  //         reference: agreementReference,
  //         [Op.and]: Sequelize.literal(`data->>'${field}' IS NOT NULL`)
  //       }
  //     }
  //   )
  //
  //   totalUpdates += affectedCount
  // }

  if (totalUpdates > 0) {
    logger.info(
      `Total redacted fields across messages: ${totalUpdates} for agreementReference: ${agreementReference}`
    )
  } else {
    logger.info(
      `No messages updated for agreementReference: ${agreementReference}`
    )
  }
}
