const fs = require('fs');

let cachedResult = null;

/**
 * Check whether Playwright's bundled Chromium browser is actually installed.
 *
 * `npm install` pulls in the `playwright` package itself, but the browser
 * binary it drives is a separate, larger download that Playwright fetches
 * only when `npx playwright install chromium` is run. Without it, every
 * call that needs a browser (the local slideshow video renderer) fails,
 * and video generation silently falls through to a simulated placeholder
 * that this project's fail-closed design then blocks from approval or
 * publishing. This check exists so that gap surfaces at startup instead
 * of days later as an unexplained "nothing can be approved" mystery.
 */
async function checkChromium() {
  if (cachedResult !== null) {
    return cachedResult;
  }

  try {
    const { chromium } = require('playwright');
    const executablePath = chromium.executablePath();
    cachedResult = Boolean(executablePath) && fs.existsSync(executablePath);
  } catch (error) {
    cachedResult = false;
  }

  return cachedResult;
}

function chromiumInstallHint() {
  return 'npx playwright install chromium — needed for the free local slideshow video path (no paid video provider required)';
}

module.exports = { checkChromium, chromiumInstallHint };
