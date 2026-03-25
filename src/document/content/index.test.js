import { createContent } from './index.js'
import { poulApplicationDetails } from './poul-application-details.js'
import { ahwrApplicationDetails } from './ahwr-application-details.js'
import { title } from './title.js'

jest.mock('./poul-application-details.js')
jest.mock('./ahwr-application-details.js')
jest.mock('./title.js')

describe('content/index', () => {
  describe('createContent', () => {
    test('should create content with poultry application details when scheme is poultry', () => {
      const poultryTitle = 'Poultry title'
      const details = { field1: 'value1' }
      const data = { scheme: 'poul' }
      title.mockReturnValue(poultryTitle)
      poulApplicationDetails.mockReturnValue(details)

      const content = createContent(data)

      expect(content).toEqual([poultryTitle, details])
      expect(title).toHaveBeenCalledWith('poul')
      expect(poulApplicationDetails).toHaveBeenCalledWith(data)
    })

    test('should create content with ahwr application details when scheme is ahwr', () => {
      const ahwrTitle = 'AHWR title'
      const details = { field1: 'value1' }
      const data = { scheme: 'ahwr' }
      title.mockReturnValue(ahwrTitle)
      ahwrApplicationDetails.mockReturnValue(details)

      const content = createContent(data)

      expect(content).toEqual([ahwrTitle, details])
      expect(title).toHaveBeenCalledWith('ahwr')
      expect(ahwrApplicationDetails).toHaveBeenCalledWith(data)
    })
  })
})
