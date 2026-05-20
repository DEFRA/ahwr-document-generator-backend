import moment from 'moment'
import { config } from '../../config.js'

const TEXT_MARGIN = [0, 10, 0, 10] // NOSONAR
const LIST_ITEM_MARGIN = [15, 0, 0, 5] // NOSONAR
const LINK_COLOR = '#1D70B8'
const LINK_DECORATION = 'underline'
const GUIDANCE_URL =
  'https://www.gov.uk/guidance/poultry-biosecurity-review-funding-guidance-for-poultry-keepers-and-vets'

const createTable = (data) => ({
  body: [
    [
      { text: 'Agreement number:', margin: TEXT_MARGIN },
      { text: `${data.reference}`, margin: TEXT_MARGIN }
    ],
    [
      { text: 'Agreement holder:', margin: TEXT_MARGIN },
      { text: `${data.name} - ${data.sbi}`, margin: TEXT_MARGIN }
    ],
    [
      { text: 'Agreement start date:', margin: TEXT_MARGIN },
      {
        text: `${moment(data.startDate).format('D MMMM YYYY')}`,
        margin: TEXT_MARGIN
      }
    ],
    [
      { text: 'Reviews deadline:', margin: TEXT_MARGIN },
      {
        text: 'All reviews must be complete by 31 December 2028',
        margin: TEXT_MARGIN
      }
    ],
    [
      { text: 'Claims deadline:', margin: TEXT_MARGIN },
      {
        text: 'You must submit all claims by 31 March 2029',
        margin: TEXT_MARGIN
      }
    ]
  ]
})

const requirementsList = {
  ul: [
    {
      text: 'the minimum number of poultry held on each site',
      margin: LIST_ITEM_MARGIN
    },
    {
      text: 'the timing of reviews',
      margin: LIST_ITEM_MARGIN
    }
  ]
}

export const poulApplicationDetails = (data) => {
  const termsAndConditionsUrl = config.get('poultryTermsAndConditionsUrl')

  return {
    stack: [
      {
        text: [
          'You have applied for ',
          {
            text: 'Poultry Biosecurity Review',
            link: GUIDANCE_URL,
            decoration: LINK_DECORATION,
            color: LINK_COLOR
          },
          ' funding.'
        ],
        margin: [0, 10, 0, 6] // NOSONAR
      },
      {
        text: [
          'By applying for this funding, you have entered into an agreement with the Rural Payments Agency. The agreement will be governed by the ',
          {
            text: 'terms and conditions.',
            link: termsAndConditionsUrl,
            decoration: LINK_DECORATION,
            color: LINK_COLOR
          }
        ],
        margin: [0, 20, 0, 10] // NOSONAR
      },
      { text: 'Agreement details', style: 'subheader', margin: [0, 20, 0, 7] }, // NOSONAR
      {
        table: createTable(data),
        layout: {
          hLineWidth: function (i, node) {
            return i === 0 || i === node.table.body.length ? 0 : 1
          },
          vLineWidth: function (_i, _node) {
            return 0
          }
        }
      },
      {
        text: 'Important requirements',
        style: 'subheader',
        margin: [0, 20, 0, 7] // NOSONAR
      },
      {
        text: [
          'You must follow ',
          {
            text: 'the guidance',
            link: GUIDANCE_URL,
            decoration: LINK_DECORATION,
            color: LINK_COLOR
          },
          ' for:'
        ],
        margin: [0, 0, 0, 6] // NOSONAR
      },
      requirementsList
    ]
  }
}
