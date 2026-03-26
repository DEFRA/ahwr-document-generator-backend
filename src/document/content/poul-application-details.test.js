import moment from 'moment'
import { poulApplicationDetails } from './poul-application-details.js'
import { config } from '../../config.js'

jest.mock('../../config.js', () => ({
  config: {
    get: jest.fn()
  }
}))

describe('poulApplicationDetails', () => {
  const mockTermsUrl = 'https://example.com/terms'

  beforeEach(() => {
    jest.clearAllMocks()
    config.get.mockReturnValue(mockTermsUrl)
  })

  it('should return correct structure with provided data', () => {
    const data = {
      reference: 'POUL-QE9R-KDSP',
      name: 'John Doe',
      sbi: '123456789',
      startDate: '2024-01-01'
    }

    const result = poulApplicationDetails(data)

    expect(result).toHaveProperty('stack')
    expect(Array.isArray(result.stack)).toBe(true)

    const table = result.stack.find((item) => item.table)?.table
    expect(table).toBeDefined()

    const body = table.body

    expect(body[0][1].text).toBe('POUL-QE9R-KDSP')
    expect(body[1][1].text).toBe('John Doe - 123456789')

    const expectedDate = moment(data.startDate).format('D MMMM YYYY')
    expect(body[2][1].text).toBe(expectedDate)
  })

  it('should include terms and conditions URL from config', () => {
    const data = {
      reference: 'POUL-QE9R-KDSP',
      name: 'Test User',
      sbi: '987654321',
      startDate: '2024-05-10'
    }

    const result = poulApplicationDetails(data)

    const termsTextBlock = result.stack.find(
      (item) =>
        Array.isArray(item.text) && item.text.some((part) => part.text === 'terms and conditions.')
    )

    const linkObject = termsTextBlock.text.find((part) => part.text === 'terms and conditions.')

    expect(linkObject.link).toBe(mockTermsUrl)
  })

  it('should contain static deadlines text', () => {
    const data = {
      reference: 'POUL-QE9R-KDSP',
      name: 'Jane Doe',
      sbi: '111222333',
      startDate: '2023-12-12'
    }

    const result = poulApplicationDetails(data)
    const table = result.stack.find((item) => item.table)?.table.body

    expect(table[3][1].text).toContain('31 March 2029')
    expect(table[4][1].text).toContain('31 March 2029')
  })

  it('should include expected headings', () => {
    const data = {
      reference: 'POUL-QE9R-KDSP',
      name: 'Sam Smith',
      sbi: '444555666',
      startDate: '2022-06-01'
    }

    const result = poulApplicationDetails(data)

    const texts = result.stack
      .filter((item) => item.text && typeof item.text === 'string')
      .map((item) => item.text)

    expect(texts).toContain('Agreement details')
    expect(texts).toContain('Important requirements')
    expect(texts).toContain('Guidance')
  })
})
