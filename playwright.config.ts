import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: 'field-guide.spec.ts',
  timeout: 45_000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: 'desktop-chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 850 } },
    },
  ],
  webServer: {
    command: 'npm run start -- -p 4173',
    url: 'http://127.0.0.1:4173/guides/better-taco-night',
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'ci-only-placeholder',
      SUPABASE_SERVICE_ROLE_KEY: 'ci-only-placeholder',
    },
  },
});
