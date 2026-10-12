import { expect, test } from '@mobrowser/cli/e2e';

test('browses the configured site and blocks unsolicited off-site navigation', async ({ page }) => {
  await page.route('https://teamdev.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<h1>Workspace</h1><a href="/mobrowser/account">Account</a>',
  }));
  await page.goto('https://teamdev.com/mobrowser/');
  await page.getByRole('link', { name: 'Account' }).click();
  await expect(page).toHaveURL('https://teamdev.com/mobrowser/account');
  await expect(page.goto('https://example.org/')).rejects.toThrow();
  await expect(page).toHaveURL('https://teamdev.com/mobrowser/account');
  await expect(page.getByRole('heading', { name: 'Workspace' })).toBeVisible();
});
