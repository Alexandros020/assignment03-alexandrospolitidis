import { test, expect } from '@playwright/test';

test.describe('Front-end tests', () => {
  test('Test case 01 - Logga in', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();
  });
})

test('Test case 02 - Create a Bill', async ({ page }) => {

  await page.goto('http://localhost:3000');
  await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
  await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();

  await page.locator('#app > div > div > div:nth-child(3) > a').click();
  await page.locator('#app > div > h2 > a').click();

  await page.fill('input[type="number"]', '5000');

  await page.locator('a.btn.blue').click();

  await expect(page.locator('text=Bills')).toBeVisible();
});

test.describe('Backend tests', () => {
  test('Test case 01 - Logga in API', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/login', {
      data: {
        "username": process.env.TEST_USERNAME,
        "password": process.env.TEST_PASSWORD
      }
    });
    expect(response.ok()).toBeTruthy();
  });

  test('test case 02 - Create a Bill', async ({ request }) => {
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        "username": process.env.TEST_USERNAME,
        "password": process.env.TEST_PASSWORD
      }
    });
    const { token } = await loginResponse.json();

    const response = await request.post('http://localhost:3000/api/bill/new', {
      headers: {
        'Content-Type': 'application/json',
        'X-user-auth': JSON.stringify({ username: 'tester01', token }),
      },

      data: {
        value: '5000',
      }
    });

    expect(response.ok()).toBeTruthy();
  });
});