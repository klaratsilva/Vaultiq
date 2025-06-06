import { test, expect, APIRequestContext } from '@playwright/test';

import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./db.json');
const dbBackupPath = path.resolve('./db.backup.json');

test.beforeEach(() => {
  if (fs.existsSync(dbBackupPath)) {
    fs.copyFileSync(dbBackupPath, dbPath);
  }
});

// Helper to create test account
async function createTestAccount(request: APIRequestContext , balance = 1000) {
  const payload = {
    name: "Test Account",
    type: "personal",
    currency: "EUR",
    balance,
    ownerEmail: `test+${Math.random()}@example.com`,
    ownerName: "Test User",
  };
  const res = await request.post('http://localhost:3000/api/accounts', { data: payload });
  expect(res.status()).toBe(201);
  const json = await res.json();
  return json.id;
}

const validPayload = {
  amount: 100,
  description: 'Test transaction',
  currency: 'EUR',
  targetCurrency: 'USD',
  clientConvertedAmount: 85,
};

test.describe('POST /api/transactions', () => {


  test.afterAll(() => {
    fs.copyFileSync(dbBackupPath, dbPath);
  });


    test('returns 400 for missing required fields', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/transactions', {
      data: {}, 
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBeDefined();
  });


 test('returns 404 if account fetch fails', async ({ request }) => {
    const invalidPayload = {
      ...validPayload,
      fromAccountId: 'nonexistent-from',
      toAccountId: 'nonexistent-to',
    };

    const response = await request.post('http://localhost:3000/api/transactions', {
      data: invalidPayload,
    });

    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Failed to fetch one or both accounts');
  });

  test('returns 400 if insufficient funds', async ({ request }) => {
    const fromAccountId = await createTestAccount(request, 500);
    const toAccountId = await createTestAccount(request, 200);

    const insufficientFundsPayload = {
      ...validPayload,
      fromAccountId,
      toAccountId,
      amount: 999999,  // very large to simulate insufficient balance
    };

    const response = await request.post('http://localhost:3000/api/transactions', {
      data: insufficientFundsPayload,
    });

    expect(response.status()).toBe(400);
    const json = await response.json();
    expect(json.error).toBe("Insufficient funds in sender's account");
  });

  test('returns 201 for a successful transaction', async ({ request }) => {
    const fromAccountId = await createTestAccount(request, 5000);
    const toAccountId = await createTestAccount(request, 200);

    const response = await request.post('http://localhost:3000/api/transactions', {
      data: {
        ...validPayload,
        fromAccountId,
        toAccountId,
      },
    });
  if (response.status() !== 201) {
    console.error(await response.json()); // <- This will show you the Zod error(s)
  }

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(json).toMatchObject({
    fromAccountId: fromAccountId,
    toAccountId: toAccountId,
    amount: validPayload.amount,
    status: 'pending',
  });
  });
});
