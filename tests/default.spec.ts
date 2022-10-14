import { test, expect } from '@playwright/test';
import { ElectronApplication, _electron as electron } from 'playwright';

test.describe('dappy browser should works', () => {
  const config = {
    dappyNetwork: process.env.DAPPY_NETWORK || 'gamma',
  };

  let app: ElectronApplication;

  test.beforeAll(async () => {
    app = await electron.launch({
      env: { PARTITION: process.env.PARTITION || 'test' },
      args: ['.', `--network=${config.dappyNetwork}`],
      cwd: '.',
    });
  });

  test('go to default.dappy', async () => {
    const window = await app.firstWindow();

    // Validate GCU form
    await window.getByRole('checkbox').click();
    await window.getByRole('button').click();

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
