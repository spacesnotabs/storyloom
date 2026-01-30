import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://127.0.0.1:5173'
const outPath = process.argv[3] ?? 'docs/screenshots/app.png'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: outPath, fullPage: true })
} finally {
  await browser.close()
}
