// Mode sombre et identité visuelle dans un vrai navigateur (TEST-E2E-THEME, TEST-SEC-02 partiel).
import { expect, test } from '@playwright/test';

test('le widget s’affiche en clair avec Marianne et passe en sombre', async ({ page }) => {
  const requetesExternes: string[] = [];
  page.on('request', (requete) => {
    if (!requete.url().startsWith('http://localhost:4173/')) requetesExternes.push(requete.url());
  });

  await page.goto('');
  const racine = page.locator('html');
  await expect(racine).toHaveAttribute('data-fr-theme', 'light');

  const policeTitre = await page
    .getByRole('heading', { level: 1 })
    .evaluate((titre) => getComputedStyle(titre).fontFamily);
  expect(policeTitre).toContain('Marianne');

  const fondClair = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.getByRole('switch', { name: 'Mode sombre' }).click();
  await expect(racine).toHaveAttribute('data-fr-theme', 'dark');
  const fondSombre = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(fondSombre).not.toBe(fondClair);

  // Le choix est mémorisé après rechargement.
  await page.reload();
  await expect(racine).toHaveAttribute('data-fr-theme', 'dark');

  // Polices et styles sont servis par le widget lui-même (aucune requête vers un autre service).
  expect(requetesExternes).toEqual([]);
});
