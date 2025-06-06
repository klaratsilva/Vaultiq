import { convertCurrency } from '../utils';

const exchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.75,
};

describe('convertCurrency', () => {
  it('converts USD to EUR correctly', () => {
    expect(convertCurrency(100, 'USD', 'EUR', exchangeRates)).toBeCloseTo(85);
  });

  it('converts EUR to USD correctly', () => {
    expect(convertCurrency(85, 'EUR', 'USD', exchangeRates)).toBeCloseTo(100);
  });

   it('throws error for unsupported currency', () => {
    expect(() => convertCurrency(100, 'USD', 'ABC', exchangeRates)).toThrow(/Unsupported currency/);
    expect(() => convertCurrency(100, 'XYZ', 'USD', exchangeRates)).toThrow('Unsupported currency');
  });

  it('rounds the converted amount to 2 decimals', () => {
    const result = convertCurrency(100, 'USD', 'GBP', exchangeRates);
    expect(result).toEqual(Number(result.toFixed(2)));
  });
});
