import { createLogEntry, redactPII } from './document-log-repository.js'

describe('document log repository', () => {
  const mockDb = {
    collection: jest.fn().mockReturnThis(),
    insertOne: jest.fn(),
    updateOne: jest.fn()
  }
  test('it saves new data to the DB', async () => {
    const testData = {
      id: 'test-id-1',
      someOtherStuff: 'im-the-other-stuff',
      reference: 'reference1'
    }
    await createLogEntry(mockDb, testData, 'filename.pdf')
    expect(mockDb.insertOne).toHaveBeenCalledTimes(1)
    expect(mockDb.insertOne).toHaveBeenCalledWith({
      inputData: testData,
      fileName: 'filename.pdf',
      reference: 'reference1',
      status: 'document-generated',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  describe('redactPII', () => {
    const mockLogger = { info: jest.fn() }
    const mockDb = {
      collection: jest.fn().mockReturnThis(),
      updateOne: jest.fn()
    }

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    test('should call update with correct parameters', async () => {
      const agreementReference = 'AHWR-123'
      mockDb.updateOne.mockResolvedValueOnce({ modifiedCount: 1 })

      await redactPII(mockDb, agreementReference, mockLogger)

      expect(mockDb.updateOne).toHaveBeenCalledWith(
        { agreementReference: 'AHWR-123' },
        {
          $set: {
            'inputData.name': 'REDACTED_NAME',
            'inputData.email': 'redacted.email@example.com',
            'inputData.orgEmail': 'redacted.email@example.com',
            'inputData.farmerName': 'REDACTED_FARMER_NAME',
            updatedAt: expect.any(Date)
          }
        }
      )

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Total redacted message documents: 1 for agreementReference: AHWR-123'
      )
    })

    test('should log when no messages are updated', async () => {
      const agreementReference = 'AHWR-123'
      mockDb.updateOne.mockResolvedValueOnce({ modifiedCount: 0 })

      await redactPII(mockDb, agreementReference, mockLogger)

      expect(mockLogger.info).toHaveBeenCalledWith(
        `No message documents updated for agreementReference: ${agreementReference}`
      )
    })
  })
})
