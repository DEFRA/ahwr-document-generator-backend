import { config } from '../../config.js'
import { millimetresToPoints } from '../conversion.js'
import { AHWR_SCHEME, POULTRY_SCHEME } from 'ffc-ahwr-common-library'

export const title = (scheme = 'default') => {
  return {
    stack: generateTitle(scheme)
  }
}

const defaultTitle = {
  text: 'Agreement summary: get funding to improve animal health and welfare',
  style: 'header',
  alignment: 'left'
}

const poultryTitle = {
  ...defaultTitle,
  text: 'Agreement summary: Poultry biosecurity review',
  fontSize: 22
}

const titleByScheme = new Map([
  ['default', defaultTitle],
  [AHWR_SCHEME, defaultTitle],
  [POULTRY_SCHEME, poultryTitle]
])

const generateTitle = (scheme) => {
  const applyServiceUri = config.get('applyServiceUri')
  const title = titleByScheme.get(scheme)

  return [
    {
      image: `src/document/images/logo.jpg`,
      fit: [millimetresToPoints(200), millimetresToPoints(25)],
      style: 'logo',
      link: applyServiceUri
    },
    title
  ]
}
