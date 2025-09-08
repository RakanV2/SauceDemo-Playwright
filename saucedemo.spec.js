const { test, expect } = require('@playwright/test');

// ✨ Capture screenshot on failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: `screenshots/${testInfo.title.replace(/ /g, '_')}.png`,
      fullPage: true
    });
  }
});

test.describe('SauceDemo Comprehensive Tests', () => {

  // ✅ Test 1: Successful login
  test('Successful login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('button[id^="add-to-cart-"]')).toHaveCount(6);
  });

  // ❌ Test 2: Failed login
  test('Failed login with wrong password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toHaveText(/Username and password do not match/i);
  });

  // 🛒 Test 3: Add products to cart
  test('Add products to cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Add first two products to cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('#add-to-cart-sauce-labs-bike-light');

    // Verify cart count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  // 💳 Test 4: Complete checkout
  test('Complete checkout', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Add one product to cart
    await page.click('#add-to-cart-sauce-labs-backpack');
    await page.click('.shopping_cart_link');

    // Checkout process
    await page.click('#checkout');
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');

    // Verify overview page
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');

    // Finish checkout
    await page.click('#finish');

    // Verify complete page
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  });

});
