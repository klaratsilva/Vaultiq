import { test, expect, APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./db.json');
const dbBackupPath = path.resolve('./db.backup.json');


const validPayload = {
  ownerEmail: 'user@example.com',
  ownerName: 'klara Silva',
  name: 'Business Checking',
  type: 'business',
  currency: 'USD',
  balance: 1000,
};


test.describe('POST /api/accounts', () => {
  test.beforeAll(() => {
    fs.copyFileSync(dbBackupPath, dbPath);
  });

   test.afterAll(() => {
      if (fs.existsSync(dbBackupPath)) {
        fs.copyFileSync(dbBackupPath, dbPath);
      }
    });
  

  test('returns 400 for invalid payload', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/accounts', {
      data: {}, 
    });
    expect(response.status()).toBe(400);
    const errors = await response.json();
    expect(Array.isArray(errors)).toBe(true);
  });

  test('returns 400 if ownerEmail or ownerName missing', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/accounts', {
      data: {
        ...validPayload,
        ownerEmail: '', 
      },
    });
     expect(response.status()).toBe(400);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.some((err: { path: string | string[]; }) => err.path.includes('ownerEmail'))).toBe(true);
  });

  test('creates new user and account if user does not exist', async ({ request }) => {
    const newUserPayload = { ...validPayload, ownerEmail: 'newuser@example.com' };

    const response = await request.post('http://localhost:3000/api/accounts', {
      data: newUserPayload,
    });
    expect(response.status()).toBe(201);
    const createdAccount = await response.json();
    expect(createdAccount).toHaveProperty('id');
    expect(createdAccount.ownerEmail).toBe(newUserPayload.ownerEmail);
  });

  test('creates account for existing user', async ({ request }) => {
    const existingUserPayload = { ...validPayload, ownerEmail: 'klara.tsilva@gmail.com' };

    const response = await request.post('http://localhost:3000/api/accounts', {
      data: existingUserPayload,
    });
    expect(response.status()).toBe(201);
    const createdAccount = await response.json();
    expect(createdAccount.ownerEmail).toBe(existingUserPayload.ownerEmail);
  });
});

test.describe('GET /api/accounts', () => {
  test('returns 200 and a list of accounts', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/accounts');
    
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(Array.isArray(json)).toBe(true);

    if (json.length > 0) {
      expect(json[0]).toHaveProperty('id');
      expect(json[0]).toHaveProperty('name');
      expect(json[0]).toHaveProperty('balance');
    }
  });
});