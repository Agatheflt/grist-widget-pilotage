// Vérifie, dans un vrai navigateur, que la version construite du widget s'affiche.
import { expect, test } from '@playwright/test';

test('la page du widget affiche son titre', async ({ page }) => {
  await page.goto('');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Pilotage de la stratégie SIGNAL — initialisation' }),
  ).toBeVisible();
});
