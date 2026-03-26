import { title } from './title.js'
import { ahwrApplicationDetails } from './ahwr-application-details.js'
import { poulApplicationDetails } from './poul-application-details.js'
import { AHWR_SCHEME, POULTRY_SCHEME } from 'ffc-ahwr-common-library'

export const createContent = (data) => {
  return [title(data.scheme), mainContentMap.get(data.scheme ?? 'default')(data)]
}

const generateDefaultContent = (data) => {
  return ahwrApplicationDetails(data)
}

const mainContentMap = new Map([
  ['default', generateDefaultContent],
  [AHWR_SCHEME, generateDefaultContent],
  [POULTRY_SCHEME, poulApplicationDetails]
])
