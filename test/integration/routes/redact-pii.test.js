import { startServer } from '../../../src/common/helpers/start-server.js'
import { redactPII } from '../../../src/repositories/document-log-repository.js'
import { StatusCodes } from 'http-status-codes'
import { deleteBlob } from '../../../src/storage/s3-interactions.js'

jest.mock('../../../src/repositories/document-log-repository.js')
jest.mock('../../../src/messaging/document-request-queue-subscriber.js')
jest.mock('../../../src/storage/s3-interactions.js')

const mockAgreementsToRedact = [
  { reference: 'FAKE-REF-1', sbi: 'FAKE-SBI-1' },
  { reference: 'FAKE-REF-2', sbi: 'FAKE-SBI-2' }
]

describe('redact-pii', () => {
  let server

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await startServer()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  describe('POST /api/redact/pii', () => {
    test('should return OK status when called with agreementsToRedact in payload', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/api/redact/pii',
        payload: { agreementsToRedact: mockAgreementsToRedact }
      })

      expect(redactPII).toHaveBeenCalledTimes(2)
      expect(redactPII).toHaveBeenCalledWith(expect.anything(), 'FAKE-REF-1', expect.any(Object))
      expect(redactPII).toHaveBeenCalledWith(expect.anything(), 'FAKE-REF-2', expect.any(Object))
      expect(deleteBlob).toHaveBeenCalledTimes(2)
      expect(deleteBlob).toHaveBeenCalledWith('FAKE-SBI-1/FAKE-REF-1.pdf', expect.any(Object))
      expect(deleteBlob).toHaveBeenCalledWith('FAKE-SBI-2/FAKE-REF-2.pdf', expect.any(Object))
      expect(res.statusCode).toBe(StatusCodes.OK)
    })
  })
})
