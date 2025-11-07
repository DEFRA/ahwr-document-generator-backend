import { generateDocument } from '../document/index.js'
import { validateDocumentRequest } from './document-request-schema.js'
import { publishDocumentCreatedEvent } from './publish-document-created.js'
import { processDocumentRequest } from './process-document-request.js'

jest.mock('../document/index.js')
jest.mock('./document-request-schema.js')
jest.mock('./publish-document-created.js')

const mockSetBindings = jest.fn()
const mockLoggerError = jest.fn()
const mockLogger = {
  info: jest.fn(),
  error: mockLoggerError,
  setBindings: mockSetBindings
}

const mockDb = jest.fn()
describe('processDocumentRequest', () => {
  const body = {
    crn: '1234567890',
    reference: 'ABC123',
    sbi: 'sbi123',
    userType: 'farmer'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('invalid request message throws error', async () => {
    validateDocumentRequest.mockReturnValue(false)

    await expect(
      processDocumentRequest(
        mockLogger,
        {
          ...body
        },
        mockDb
      )
    ).rejects.toThrow('Invalid document request')

    expect(validateDocumentRequest).toHaveBeenCalledTimes(1)
    expect(generateDocument).toHaveBeenCalledTimes(0)
    expect(publishDocumentCreatedEvent).toHaveBeenCalledTimes(0)
    expect(mockSetBindings).toHaveBeenCalledTimes(0)
    expect(mockLoggerError).toHaveBeenCalledWith(
      `Unable to complete document generation request as the request is invalid: ${JSON.stringify(body)}`
    )
  })

  test('valid request calls through to process document and send out created event', async () => {
    validateDocumentRequest.mockReturnValue(true)
    generateDocument.mockReturnValueOnce({ fileName: 'sbi123/ABC123.pdf' })
    await processDocumentRequest(
      mockLogger,
      {
        ...body
      },
      mockDb
    )

    expect(validateDocumentRequest).toHaveBeenCalledWith(mockLogger, body)
    expect(generateDocument).toHaveBeenCalledWith(mockLogger, body, mockDb)
    expect(publishDocumentCreatedEvent).toHaveBeenCalledWith(
      mockLogger,
      body,
      'sbi123/ABC123.pdf'
    )
    expect(mockSetBindings).toHaveBeenCalledWith({
      reference: 'ABC123',
      sbi: 'sbi123',
      crn: '1234567890',
      userType: 'farmer'
    })
  })
})
