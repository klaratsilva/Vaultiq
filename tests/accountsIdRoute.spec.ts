import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./db.json');
const dbBackupPath = path.resolve('./db.backup.json');

const baseUrl = 'http://localhost:3000/api/accounts';

let existingAccountId1: string;
let existingAccountId2: string;

test.beforeEach(async ({ request }) => {
  if (fs.existsSync(dbBackupPath)) {
    fs.copyFileSync(dbBackupPath, dbPath);
  }
  const res1 = await request.post(baseUrl, {
    data: {
      name: 'Business Checking',
      type: 'business',
      currency: 'EUR',
      balance: 1000,
      ownerEmail: 'klara.tsilva@gmail.com',
      ownerName: 'Klara Silva',
      ownerId: '887c718d-d7c5-4a5e-8e3f-00e3b5f0e459',
    }
  });
  const json1 = await res1.json();
  existingAccountId1 = json1.id;

  const res2 = await request.post(baseUrl, {
    data: {
      name: 'Personal Savings',
      type: 'personal',
      currency: 'EUR',
      balance: 5000,
      ownerEmail: 'sim@gmail.com',
      ownerName: 'Simao Silva',
      ownerId: '8676bf3e-4114-4c07-850e-7fa2345f6a07',
    }
  });
  const json2 = await res2.json();
  existingAccountId2 = json2.id;
});

test.describe('Accounts [id] API', () => {
  test.afterAll(() => {
    if (fs.existsSync(dbBackupPath)) {
      fs.copyFileSync(dbBackupPath, dbPath);
    }
  });


  test('GET returns account for valid id', async ({ request }) => {
    const response = await request.get(`${baseUrl}/${existingAccountId1}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.id).toBe(existingAccountId1);
  });

  test('GET returns 404 for invalid id', async ({ request }) => {
    const response = await request.get(`${baseUrl}/nonexistent-id`);
    expect(response.status()).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Account not found');
  });

  test('PUT updates account successfully', async ({ request }) => {
    const updatePayload = {
      name: 'Personal Savings',
      type: 'personal',
      currency: 'EUR',
      balance: 5000,
      ownerEmail: 'sim@gmail.com',
      ownerName: 'Peter',
      ownerId: '8676bf3e-4114-4c07-850e-7fa2345f6a07',
    };
    const response = await request.put(`${baseUrl}/${existingAccountId1}`, { data: updatePayload });
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json).toMatchObject(updatePayload);
  });

  test('DELETE removes account successfully', async ({ request }) => {
    const response = await request.delete(`${baseUrl}/${existingAccountId2}`);
    expect(response.status()).toBe(200);
    const json = await response.json();
    expect(json.message).toBe('Account deleted');
  });
});
