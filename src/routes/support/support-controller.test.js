import { getDocumentLogsHandler } from './support-controller.js'
import { getLogEntriesByAgreementRef } from '../../repositories/document-log-repository.js'
import { ObjectId } from 'mongodb'
import Boom from '@hapi/boom'

jest.mock('../../repositories/document-log-repository.js')

describe('getDocumentLogsHandler', () => {
  const mockH = {
    response: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis()
  }
  const mockDb = jest.fn()
  const mockLogger = {
    error: jest.fn(),
    info: jest.fn()
  }
  const request = {
    db: mockDb,
    logger: mockLogger,
    query: {}
  }
  const documentLogEntries = [
    {
      _id: new ObjectId('69736011fb17ee07df3147fc'),
      agreementReference: 'IAHW-ABC1-1061',
      claimReference: 'REPI-ABC1-XYZ1',
      messageType: 'claimCreated',
      data: {
        crn: '1060000000',
        sbi: '987654321',
        orgName: null,
        claimType: 'REVIEW',
        typeOfLivestock: 'pigs',
        email: null,
        orgEmail: null,
        herdName: 'piglets',
        claimAmount: '456'
      }
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should retrieve document logs for agreementReference', async () => {
    getLogEntriesByAgreementRef.mockResolvedValueOnce(documentLogEntries)

    const result = await getDocumentLogsHandler(
      { ...request, query: { agreementReference: 'IAHW-ABC1-1061' } },
      mockH
    )

    expect(getLogEntriesByAgreementRef).toHaveBeenCalledWith(mockDb, 'IAHW-ABC1-1061')
    expect(mockH.response).toHaveBeenCalledWith({ data: documentLogEntries })
    expect(mockH.code).toHaveBeenCalledWith(200)
    expect(result).toBe(mockH)
  })

  test('should return 500 error when repo throws error and retrieving by agreement reference', async () => {
    getLogEntriesByAgreementRef.mockRejectedValueOnce(
      new Error('Failed to retrieve document logs by agreement reference')
    )

    expect(
      getDocumentLogsHandler({ ...request, query: { agreementReference: 'IAHW-ABC1-1061' } }, mockH)
    ).rejects.toThrow('Failed to retrieve document logs by agreement reference')
  })

  test('should rethrow boom error when getLogEntriesByAgreementRef throws', async () => {
    getLogEntriesByAgreementRef.mockRejectedValueOnce(
      Boom.badRequest('Failed to retrieve document logs by agreement reference')
    )

    expect(
      getDocumentLogsHandler({ ...request, query: { agreementReference: 'IAHW-ABC1-1061' } }, mockH)
    ).rejects.toThrow('Failed to retrieve document logs by agreement reference')
  })

  test('should return empty array when document logs does not exist for agreement reference', async () => {
    getLogEntriesByAgreementRef.mockResolvedValueOnce([])

    const result = await getDocumentLogsHandler(
      { ...request, query: { agreementReference: 'IAHW-ABC1-1061' } },
      mockH
    )

    expect(getLogEntriesByAgreementRef).toHaveBeenCalledWith(mockDb, 'IAHW-ABC1-1061')
    expect(mockH.response).toHaveBeenCalledWith({ data: [] })
    expect(mockH.code).toHaveBeenCalledWith(200)
    expect(result).toBe(mockH)
  })
})
