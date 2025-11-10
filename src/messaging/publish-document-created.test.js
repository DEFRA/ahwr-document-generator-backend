import { publishDocumentCreatedEvent } from './publish-document-created.js'
import { publishMessage, setupClient } from 'ffc-ahwr-common-library'

jest.mock('ffc-ahwr-common-library')
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  setBindings: jest.fn()
}
describe('publishDocumentCreated', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test('sets up client and then publishes event on first call', async () => {
    await publishDocumentCreatedEvent(
      mockLogger,
      {
        crn: '1234567890',
        reference: 'ABC123',
        sbi: 'sbi123',
        userType: 'farmer'
      },
      'sbi123/ABC123.pdf'
    )

    expect(setupClient).toHaveBeenCalledTimes(1)
    expect(publishMessage).toHaveBeenCalledWith(
      {
        applicationReference: 'ABC123',
        crn: '1234567890',
        documentLocation: 'sbi123/ABC123.pdf',
        sbi: 'sbi123',
        userType: 'farmer'
      },
      { eventType: 'uk.gov.ffc.ahwr.document.created' }
    )
  })
  test('skips setting up client and then publishes event on subsequent call', async () => {
    await publishDocumentCreatedEvent(
      mockLogger,
      {
        crn: '1234567890',
        reference: 'ABC123',
        sbi: 'sbi123',
        userType: 'farmer'
      },
      'sbi123/ABC123.pdf'
    )

    expect(setupClient).toHaveBeenCalledTimes(0)
    expect(publishMessage).toHaveBeenCalledWith(
      {
        applicationReference: 'ABC123',
        crn: '1234567890',
        documentLocation: 'sbi123/ABC123.pdf',
        sbi: 'sbi123',
        userType: 'farmer'
      },
      { eventType: 'uk.gov.ffc.ahwr.document.created' }
    )
  })
})
