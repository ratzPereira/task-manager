const { TestScheduler } = require('jest')
const { fahrenheitToCelsius, celsiusToFahrenheit } = require('../math')


test('fran to celsius testing', () => {
    const temp = fahrenheitToCelsius(50)
    expect(temp).toBe(10)
})

test('celsius to fra', () => {
    const temp = celsiusToFahrenheit(10)
    expect(temp).toBe(50)
})