import { publishDocument } from './publish-document.js'
import { uploadBlob } from '../storage/s3-interactions.js'
import { createFileName } from './create-filename.js'
import { createLogEntry } from '../repositories/document-log-repository.js'
import { EventEmitter } from 'events'

// Mock the external dependencies
jest.mock('../storage/s3-interactions.js')
jest.mock('./create-filename.js')
jest.mock('../repositories/document-log-repository.js')

describe('publishDocument', () => {
  let logger, pdfDocGenerator, data, db

  beforeEach(() => {
    // Mock the logger
    logger = {
      info: jest.fn(),
      error: jest.fn()
    }

    pdfDocGenerator = new EventEmitter()
    pdfDocGenerator.end = jest.fn()

    // Example data object
    data = { id: 123, name: 'Test Document' }

    // Example database mock
    db = {}
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should generate a PDF document, upload it, and log success', async () => {
    const filename = 'test-document.pdf'
    const blobResult = { url: 'https://s3-bucket/test-document.pdf' }
    const buffer = Buffer.from('Test PDF content')

    // Mock dependencies
    createFileName.mockReturnValueOnce(filename)
    uploadBlob.mockResolvedValueOnce(blobResult)
    createLogEntry.mockResolvedValueOnce()

    const promise = publishDocument(logger, pdfDocGenerator, data, db)

    // Simulate 'data' and 'end' events
    pdfDocGenerator.emit('data', buffer) // Simulate writing data
    pdfDocGenerator.emit('end') // Simulate end of generation

    const result = await promise

    expect(logger.info).toHaveBeenCalledWith(`Document ${filename} generated`)
    expect(uploadBlob).toHaveBeenCalledWith(logger, filename, buffer)
    expect(createLogEntry).toHaveBeenCalledWith(db, data, filename)
    expect(result).toEqual({ filename, blob: blobResult })
    expect(pdfDocGenerator.end).toHaveBeenCalled()
  })

  it('should reject if pdfDocGenerator emits an error', async () => {
    const error = new Error('PDF generation failed')

    const promise = publishDocument(logger, pdfDocGenerator, data, db)

    // Simulate 'error' event
    pdfDocGenerator.emit('error', error)

    await expect(promise).rejects.toThrow('PDF generation failed')

    expect(logger.info).not.toHaveBeenCalled()
    expect(uploadBlob).not.toHaveBeenCalled()
    expect(createLogEntry).not.toHaveBeenCalled()
    expect(pdfDocGenerator.end).toHaveBeenCalled()
  })
})
