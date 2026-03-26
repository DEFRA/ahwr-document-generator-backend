import moment from 'moment'
import { config } from '../../config.js'

const TEXT_MARGIN = [0, 10, 0, 10]
const LIST_ITEM_MARGIN = [15, 0, 0, 5]

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
      {
        text: 'Review deadline:',
        margin: TEXT_MARGIN
      },
      {
        text: '31 March 2029. You must do all your reviews by this date.',
        margin: TEXT_MARGIN
      }
    ],
    [
      { text: 'Claims deadline:', margin: TEXT_MARGIN },
      {
        text: '31 March 2029. You must submit all your claims by this date.',
        margin: TEXT_MARGIN
      }
    ]
  ]
})

export const poulApplicationDetails = (data) => {
  const termsAndConditionsUrl = config.get('termsAndConditionsUrl')

  return {
    stack: [
      { text: 'You have applied for funding for:', margin: [0, 10, 0, 6] },
      {
        ul: [
          {
            text: 'Poultry biosecurity review',
            link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#animal-health-and-welfare-review',
            decoration: 'underline',
            color: '#1D70B8',
            margin: [15, 0, 0, 5]
          }
        ]
      },
      {
        text: [
          'By applying for this funding, you have entered into an agreement with the Rural Payments Agency. The agreement will be governed by the ',
          {
            text: 'terms and conditions.',
            link: termsAndConditionsUrl,
            decoration: 'underline',
            color: '#1D70B8'
          }
        ],
        margin: [0, 20, 0, 10]
      },
      { text: 'Agreement details', style: 'subheader', margin: [0, 20, 0, 7] },
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
        margin: [0, 20, 0, 7]
      },
      { text: 'You must:', margin: [0, 0, 0, 6] },
      {
        ul: [
          {
            text: [
              'have the ',
              {
                text: 'minimum number of poultry per unit',
                link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#who-can-get-funding',
                decoration: 'underline',
                color: '#1D70B8'
              },
              ' each time you do a review'
            ],
            margin: LIST_ITEM_MARGIN
          },
          {
            text: [
              'follow the rules for ',
              {
                text: 'timing of reviews',
                link: 'https://www.gov.uk/guidance/farmers-how-to-apply-for-funding-to-improve-animal-health-and-welfare#timing-of-reviews-and-follow-ups',
                decoration: 'underline',
                color: '#1D70B8'
              }
            ],
            margin: LIST_ITEM_MARGIN
          }
        ]
      },
      { text: 'Guidance', style: 'subheader', margin: [0, 20, 0, 7] },
      {
        ul: [
          {
            text: 'Poultry biosecurity review',
            link: 'https://www.gov.uk/government/collections/funding-to-improve-animal-health-and-welfare-guidance-for-farmers-and-vets',
            decoration: 'underline',
            color: '#1D70B8',
            margin: LIST_ITEM_MARGIN
          }
        ]
      }
    ]
  }
}
