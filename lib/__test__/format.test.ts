import { formatDateTime, formatAccountOptions } from '../utils';
import { Account, Currency } from '../types';

describe('formatDateTime', () => {
  it('formats a Date object correctly', () => {
    const date = new Date('2025-06-05T14:30:00');
    const formatted = formatDateTime(date);
    expect(formatted).toMatch(/Thu.*Jun.*5.*2:30.*PM/);
  });

  it('formats a date string correctly', () => {
    const dateString = '2025-06-05T14:30:00';
    const formatted = formatDateTime(dateString);
    expect(formatted).toMatch(/Thu.*Jun.*5.*2:30.*PM/);
  });
});

describe('formatAccountOptions', () => {
  it('formats accounts correctly', () => {
    const accounts: Account[] = [
          {
            id: "1",
            name: "Business Checking",
            type: "business",
            currency: "USD" as Currency,
            balance: "12000.00",
            ownerEmail: "alice@example.com",
            ownerName: "Alice Johnson",
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            createdAt: "23-4-2034"
          },
           {
            id: "2",
            name: "Personal Savings",
            type: "personal",
            currency: "EUR" as Currency,
            balance: "4034.26",
            ownerEmail: "sim@gmail.com",
            ownerName: "Simao Silva",
            ownerId: "8676bf3e-4114-4c07-850e-7fa2345f6a07",
            createdAt: "23-4-2034"
          },
    ];

    const formatted = formatAccountOptions(accounts);
    expect(formatted).toEqual([
      { value: '1', label: 'Business Checking - USD - Alice Johnson' },
      { value: '2', label: 'Personal Savings - EUR - Simao Silva' },
    ]);
  });
});
