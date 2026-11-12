// Politique de sécurité du contenu du widget (TECH-113, TEST-SEC-07).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync('index.html', 'utf8');
const csp = /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/.exec(page)?.[1] ?? '';

describe('politique de sécurité du contenu', () => {
  it('est déclarée dans la page du widget', () => {
    expect(csp).not.toBe('');
  });

  it('interdit l’exécution de code dynamique et les requêtes vers d’autres services', () => {
    expect(csp).not.toContain('unsafe-eval');
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
  });

  it('n’autorise comme script externe que l’API Grist', () => {
    const scripts = (/script-src ([^;]+)/.exec(csp)?.[1] ?? '').trim().split(/\s+/);
    expect(scripts).toEqual(["'self'", 'https://docs.getgrist.com']);
  });

  it('ne charge les polices que depuis le widget', () => {
    expect(csp).toContain("font-src 'self' data:");
  });
});
