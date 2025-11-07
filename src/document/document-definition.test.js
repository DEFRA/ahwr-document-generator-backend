import { styles } from './styles'
import { createDocumentDefinition } from './document-definition'
import { mockRequest } from '../../test/mocks/data'
import { pageSizes } from './page-sizes'
import moment from 'moment'

jest.mock('../getDirName', () => ({
  getDirName: () => 'dir/'
}))

const { A4 } = pageSizes

describe('get document definition', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  test('includes A4 paper size', () => {
    const result = createDocumentDefinition(mockRequest)
    expect(result.pageSize).toBe(A4)
  })

  test('includes all defined styles', () => {
    const result = createDocumentDefinition(mockRequest)
    expect(result.styles).toStrictEqual(styles)
  })

  test('included footer', () => {
    const result = createDocumentDefinition(mockRequest)
    expect(result.footer.stack[0].text).toBe(
      `Date Generated: ${moment(new Date()).format('DD/MM/YYYY')}    Application Reference: ${mockRequest.reference}    Application Status: Agreement Offered`
    )
    expect(result.footer.stack[0].style).toBe('footer')
  })

  test('sets default style as default style', () => {
    const result = createDocumentDefinition(mockRequest)
    expect(result.defaultStyle).toBe(styles.default)
  })
})
