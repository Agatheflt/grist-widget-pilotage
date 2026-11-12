// Configuration des tests de bout en bout (docs/04 §2).
// Les tests s'exécutent sur la version construite du widget, servie par « vite preview ».
import { defineConfig, devices } from '@playwright/test';

const adresse = 'http://localhost:4173/grist-widget-pilotage/';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: adresse, trace: 'on-first-retry' },
  // Chromium partout ; Firefox seulement en intégration continue, car son installation
  // locale sous Windows peut échouer (bibliothèques système manquantes).
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ...(process.env.CI ? [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }] : []),
  ],
  webServer: {
    command: 'npm run build && npm run apercu',
    url: adresse,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
