// Accessibilité de la vitrine des composants (TEST-A11Y-01, A11Y-03, A11Y-04, E2E-RESP partiel).
// Exécuté uniquement en CI (DEC-028).
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const theme of ['clair', 'sombre'] as const) {
  test(`aucune violation d’accessibilité grave en thème ${theme}`, async ({ page }) => {
    await page.goto('outils/vitrine/');
    if (theme === 'sombre') await page.getByRole('switch', { name: 'Mode sombre' }).click();
    // Ouvre les éléments repliés pour analyser aussi leur contenu.
    await page.getByRole('button', { name: /Objectif 2/ }).click();

    const resultat = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const graves = resultat.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(graves.map((v) => `${v.id} : ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}

test('une modale s’utilise entièrement au clavier', async ({ page }) => {
  await page.goto('outils/vitrine/');
  const declencheur = page.getByRole('button', { name: 'Ouvrir un formulaire' });
  await declencheur.focus();
  await page.keyboard.press('Enter');

  const modale = page.getByRole('dialog', { name: 'Créer une action' });
  await expect(modale).toBeVisible();
  // Le focus est placé dans la modale.
  expect(await modale.evaluate((m) => m.contains(document.activeElement))).toBe(true);

  await page.keyboard.press('Escape');
  await expect(modale).toBeHidden();
  await expect(declencheur).toBeFocused();
});

test('pas de défilement horizontal de la page à 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('outils/vitrine/');
  const deborde = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(deborde).toBe(false);
});
