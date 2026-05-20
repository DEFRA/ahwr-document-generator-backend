import moment from 'moment'
import { poulApplicationDetails } from './poul-application-details.js'
import { config } from '../../config.js'

jest.mock('../../config.js', () => ({
  config: {
    get: jest.fn()
  }
}))

const GUIDANCE_URL =
  'https://www.gov.uk/guidance/poultry-biosecurity-review-funding-guidance-for-poultry-keepers-and-vets'

const findArrayTextBlock = (result, partText) =>
  result.stack.find(
    (item) => Array.isArray(item.text) && item.text.some((part) => part.text === partText)
  )

const findLinkPart = (block, partText) => block.text.find((part) => part.text === partText)

describe('poulApplicationDetails', () => {
  const mockPoultryTermsUrl = 'https://example.com/poultry-terms'

  const data = {
    reference: 'POUL-QE9R-KDSP',
    name: 'John Doe',
    sbi: '123456789',
    startDate: '2024-01-01'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    config.get.mockImplementation((key) =>
      key === 'poultryTermsAndConditionsUrl' ? mockPoultryTermsUrl : undefined
    )
  })

  it('should return correct structure with provided data', () => {
    const result = poulApplicationDetails(data)

    expect(result).toHaveProperty('stack')
    expect(Array.isArray(result.stack)).toBe(true)

    const table = result.stack.find((item) => item.table)?.table
    expect(table).toBeDefined()

    const body = table.body

    expect(body[0][1].text).toBe('POUL-QE9R-KDSP')
    expect(body[1][1].text).toBe('John Doe - 123456789')
    expect(body[2][1].text).toBe(moment(data.startDate).format('D MMMM YYYY'))
  })

  it('should link the intro "Poultry Biosecurity Review" text to the guidance URL', () => {
    const result = poulApplicationDetails(data)

    const introBlock = findArrayTextBlock(result, 'Poultry Biosecurity Review')
    expect(introBlock.text[0]).toBe('You have applied for ')
    expect(introBlock.text[2]).toBe(' funding.')

    const link = findLinkPart(introBlock, 'Poultry Biosecurity Review')
    expect(link.link).toBe(GUIDANCE_URL)
  })

  it('should source the terms and conditions link from the poultry config', () => {
    const result = poulApplicationDetails(data)

    const termsBlock = findArrayTextBlock(result, 'terms and conditions.')
    const link = findLinkPart(termsBlock, 'terms and conditions.')

    expect(config.get).toHaveBeenCalledWith('poultryTermsAndConditionsUrl')
    expect(link.link).toBe(mockPoultryTermsUrl)
  })

  it('should contain the updated deadline rows', () => {
    const result = poulApplicationDetails(data)
    const table = result.stack.find((item) => item.table)?.table.body

    expect(table[3][0].text).toBe('Reviews deadline:')
    expect(table[3][1].text).toBe('All reviews must be complete by 31 December 2028')

    expect(table[4][0].text).toBe('Claims deadline:')
    expect(table[4][1].text).toBe('You must submit all claims by 31 March 2029')
  })

  it('should introduce the requirements list with a "the guidance" link', () => {
    const result = poulApplicationDetails(data)

    const leadInBlock = findArrayTextBlock(result, 'the guidance')
    expect(leadInBlock.text[0]).toBe('You must follow ')
    expect(leadInBlock.text[2]).toBe(' for:')

    const link = findLinkPart(leadInBlock, 'the guidance')
    expect(link.link).toBe(GUIDANCE_URL)
  })

  it('should render the requirements as plain text bullets without links', () => {
    const result = poulApplicationDetails(data)

    const list = result.stack.find((item) => item.ul)?.ul
    expect(list).toHaveLength(2)

    expect(list[0].text).toBe('the minimum number of poultry held on each site')
    expect(list[1].text).toBe('the timing of reviews')

    expect(list[0].link).toBeUndefined()
    expect(list[1].link).toBeUndefined()
  })

  it('should include the expected headings and omit the Guidance section', () => {
    const result = poulApplicationDetails(data)

    const texts = result.stack
      .filter((item) => typeof item.text === 'string')
      .map((item) => item.text)

    expect(texts).toContain('Agreement details')
    expect(texts).toContain('Important requirements')
    expect(texts).not.toContain('Guidance')
  })

  it('should apply correct horizontal line widths', () => {
    const result = poulApplicationDetails(data)

    const tableBlock = result.stack.find((item) => item.table)
    const { hLineWidth } = tableBlock.layout

    const mockNode = { table: { body: new Array(5) } }

    expect(hLineWidth(0, mockNode)).toBe(0)
    expect(hLineWidth(5, mockNode)).toBe(0)
    expect(hLineWidth(2, mockNode)).toBe(1)
  })
})
