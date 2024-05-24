const assert = require('assert');
const {Builder, Browser} = require('selenium-webdriver');

class BasePage {

    async goToUrl(url) {
        global.driver = new Builder().forBrowser(Browser.CHROME).build();
        driver.manage().setTimeouts({implicit: 500});
        await driver.get(url);
    }

    async enterText(locator, textToEnter) {
        await driver.findElement(locator).sendKeys(textToEnter);
    }

    async click(locator) {
        await driver.findElement(locator).click();
    }

    async saveScreenshot(fileName) {
        await driver.takeScreenshot().then(function (image) {
            require('fs').writeFileSync(fileName, image, 'base64')
        });
    }

    async getClassOfElement(locator) {
        return await driver.findElement(locator).getAttribute('class')
    }

    async getTextOfElement(locator) {
        return await driver.findElement(locator).getText()
    }

    async enterText(locator, textToEnter) {
        await driver.findElement(locator).sendKeys(textToEnter);
    }

    async sleep(milliseconds) {
        await driver.sleep(milliseconds * 3)
    }

    async closeBrowser() {
        await driver.sleep(1000);
        await driver.quit();
    }

    async waitUntil(condituion) {
        await driver.wait(condituion)
    }
}

module.exports = BasePage;