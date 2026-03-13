import { config } from '../../config.js'
import { millimetresToPoints } from '../conversion.js'
// import { AHWR_SCHEME } from 'ffc-ahwr-common-library' //note this should be updated to include extra scheme in library
import { AHWR_SCHEME, POULTRY_SCHEME } from '../../constants.js'

export const title = (scheme = 'default') => {
  return {
    stack: titleMap.get(scheme)()
  }
}

const generateDefaultTitle = () => {
  const applyServiceUri = config.get('applyServiceUri')
  const titleText = 'Agreement summary: get funding to improve animal health and welfare'

  return [
    {
      image: `src/document/images/logo.jpg`,
      fit: [millimetresToPoints(200), millimetresToPoints(25)],
      style: 'logo',
      link: applyServiceUri
    },
    { text: titleText, style: 'header', alignment: 'left' }
  ]
}

const generatePoultryTitle = () => {
  const applyServiceUri = config.get('applyServiceUri')
  const titleText = 'Agreement summary: poultry biosecurity checks'

  return [
    {
      image: `src/document/images/logo.jpg`,
      fit: [millimetresToPoints(200), millimetresToPoints(25)],
      style: 'logo',
      link: applyServiceUri
    },
    { text: titleText, style: 'header', alignment: 'left' }
  ]
}

const titleMap = new Map([
  ['default', generateDefaultTitle],
  [AHWR_SCHEME, generateDefaultTitle],
  [POULTRY_SCHEME, generatePoultryTitle]
])
