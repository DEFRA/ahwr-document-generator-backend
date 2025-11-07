// import path from 'path'
import { config } from '../../config.js'
import { millimetresToPoints } from '../conversion.js'
// import { getDirName } from '../../getDirName.js'
import { AHWR_SCHEME } from 'ffc-ahwr-common-library'

export const title = (scheme = 'default') => {
  return {
    stack: titleMap.get(scheme)()
  }
}

const generateDefaultTitle = () => {
  const applyServiceUri = config.get('applyServiceUri')
  // const imagePath = path.join(getDirName(), 'document', 'images')
  const titleText =
    'Agreement summary: get funding to improve animal health and welfare'

  return [
    {
      image: `document/images/logo.jpg`,
      fit: [millimetresToPoints(200), millimetresToPoints(25)],
      style: 'logo',
      link: applyServiceUri
    },
    { text: titleText, style: 'header', alignment: 'left' }
  ]
}

const titleMap = new Map([
  ['default', generateDefaultTitle],
  [AHWR_SCHEME, generateDefaultTitle]
])
