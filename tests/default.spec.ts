import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';

test.describe('dappy browser should works', () => {
  const config = {
    dappyNetwork: process.env.DAPPY_NETWORK || 'local',
  };

  let app: ElectronApplication;

  test.beforeAll(async () => {
    app = await electron.launch({ args: ['dist/main/main.js'], cwd: './' });
  });

  test('go to default.dappy', async ({ page }) => {
    const window = await app.firstWindow();

    await window.locator('[aria-label="address"]').fill(`default.dappy.${config.dappyNetwork}`);

    await window.keyboard.press('Enter');

    await app.waitForEvent('window');

    const defaultDappyPage = app.windows().find((w) => w.url().includes('default.dappy'));

    if (!defaultDappyPage) {
      throw new Error("Can't find default.dappy page");
    }

    await expect(defaultDappyPage.locator('body')).toContainText('dappy default website');
  });

  test.afterAll(async () => {
    await app.close();
  });
});
