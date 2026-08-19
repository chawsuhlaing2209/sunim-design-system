import type { TestRunnerConfig } from '@storybook/test-runner';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), '.screenshots');

/**
 * `npm run screenshots` runs this against a live Storybook and writes one PNG
 * per story into .screenshots/ — the artefacts the parity stage compares against
 * the Figma reference. Without a postVisit hook the test-runner only smoke-tests
 * that each story renders, and no image is ever produced.
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await page.setViewportSize({ width: 900, height: 200 });
  },
  async postVisit(page, context) {
    // Web fonts change measured type metrics; wait for them before capturing.
    await page.evaluate(() => document.fonts.ready);
    // Let the state transitions settle so focus rings are fully painted.
    await page.waitForTimeout(250);
    await mkdir(OUT, { recursive: true });
    const image = await page.locator('#storybook-root').screenshot();
    await writeFile(join(OUT, `${context.id}.png`), image);
  },
};

export default config;
