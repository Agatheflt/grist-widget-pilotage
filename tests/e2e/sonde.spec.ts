// Vérifie que la sonde Grist (T1.02) s'affiche et liste ses essais.
// Hors de Grist, aucun essai n'est exécuté : on contrôle seulement la page.
import { expect, test } from '@playwright/test';

test('la sonde affiche ses essais et le journal', async ({ page }) => {
  await page.goto('outils/sonde-grist/');
  await expect(
    page.getByRole('heading', { level: 1, name: "Sonde de validation de l'API Grist" }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(15);
  await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copier le rapport' })).toBeVisible();
});
