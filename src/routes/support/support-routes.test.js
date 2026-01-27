import { Server } from '@hapi/hapi'
import { supportRoutes } from './support-routes.js'
import { getDocumentLogsHandler } from './support-controller.js'
import { ObjectId } from 'mongodb'

jest.mock('./support-controller.js')

const documentLogs = [
  {
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
]

describe('support-routes', () => {
  let server

  beforeAll(async () => {
    server = new Server()
    server.route(supportRoutes)
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/support/document-logs', () => {
    it('should validate request and call correct handler when query has agreementReference', async () => {
      getDocumentLogsHandler.mockImplementation(async (_, h) => {
        return h.response(documentLogs).code(200)
      })

      const res = await server.inject({
        method: 'GET',
        url: '/api/support/document-logs?agreementReference=IAHW-ABC1-1061'
      })

      expect(res.statusCode).toBe(200)
      expect(res.result).toEqual(documentLogs)
      expect(getDocumentLogsHandler).toHaveBeenCalledTimes(1)
    })
  })

  it('should return 400 when query is missing required params', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/support/document-logs'
    })

    expect(res.statusCode).toBe(400)
    expect(res.result).toEqual({
      error: 'Bad Request',
      message: 'Invalid request query input',
      statusCode: 400
    })
    expect(getDocumentLogsHandler).not.toHaveBeenCalled()
  })
})
