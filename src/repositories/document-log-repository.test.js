import {
  createLogEntry,
  redactPII,
  getLogEntriesByAgreementRef,
  createDocumentLogIndexes
} from './document-log-repository.js'
import { ObjectId } from 'mongodb'

describe('document log repository', () => {
  const mockToArray = jest.fn()
  const mockDb = {
    collection: jest.fn().mockReturnThis(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    find: jest.fn(() => ({
      toArray: mockToArray
    }))
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
        { reference: 'AHWR-123' },
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

  describe('getLogEntriesByAgreementRef', () => {
    const logEntry = {
      _id: new ObjectId('69779c620fd96e6088b56a5b'),
      reference: 'IAHW-QE9R-KDSP',
      createdAt: new Date('2026-01-26T16:54:58.765Z'),
      updatedAt: new Date('2026-01-26T16:54:58.765Z'),
      fileName: '106639701/IAHW-QE9R-KDSP.pdf',
      status: 'document-generated',
      inputData: {
        crn: '1101663919',
        reference: 'IAHW-QE9R-KDSP',
        sbi: '106639701',
        startDate: '2025-07-16T14:27:19.841Z',
        userType: 'newUser',
        email: 'peterevansu@snavereteps.com.test',
        farmerName: 'Peter Evans',
        name: 'Oaklands Farm',
        orgEmail: 'oaklandsfarmm@mrafsdnalkaok.com.test'
      }
    }

    test('should return log entries when the agreement reference matches', async () => {
      mockToArray.mockResolvedValueOnce([logEntry])

      const result = await getLogEntriesByAgreementRef(mockDb, 'IAHW-ABC1-1060')

      expect(mockDb.find).toHaveBeenCalledWith({
        reference: 'IAHW-ABC1-1060'
      })
      expect(result).toEqual([logEntry])
    })

    test('should return emptry array if no result is found', async () => {
      mockToArray.mockResolvedValueOnce([])

      const result = await getLogEntriesByAgreementRef(mockDb, 'IAHW-ABC1-1060')

      expect(result).toEqual([])
    })
  })

  describe('createDocumentLogIndexes', () => {
    const mockCollection = {
      createIndex: jest.fn()
    }
    const mockDb = {
      collection: jest.fn(() => mockCollection)
    }

    it('should create indexes', async () => {
      await createDocumentLogIndexes(mockDb)

      expect(mockDb.collection).toHaveBeenCalledWith('documentlog')
      expect(mockCollection.createIndex).toHaveBeenCalledWith({ reference: 1 })
    })
  })
})
