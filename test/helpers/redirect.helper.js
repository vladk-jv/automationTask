export async function testSocialRedirect(buttonElement, expectedUrlPart) {
  const originalWindow = await browser.getWindowHandle();

  await buttonElement.click();

  await browser.waitUntil(
    async () => (await browser.getWindowHandles()).length === 2,
    {
      timeout: 5000,
      timeoutMsg: "expected a new window to open after 5s",
    }
  );

  const windows = await browser.getWindowHandles();
  const newWindow = windows.find((w) => w !== originalWindow);

  await browser.switchToWindow(newWindow);
  await expect(browser).toHaveUrl(expectedUrlPart);
  await browser.closeWindow();
  await browser.switchToWindow(originalWindow);
}
