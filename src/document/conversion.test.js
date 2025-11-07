import { millimetresToPoints } from './conversion.js'

describe('conversion test', () => {
  test('millimetresToPoints', () => {
    const result = millimetresToPoints(100)
    expect(result).toBe(283.5)
  })
})
