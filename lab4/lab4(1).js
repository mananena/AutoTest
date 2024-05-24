const { Builder, Browser, By, until } = require('selenium-webdriver');
const fs = require('fs');
const SLEEP_TIME5 = 50000;
const SLEEP_TIME7 = 70000;

const withErrorHandling = (fn, handler) => {
    return async () => {
        try {
            await fn();
        } catch (error) {
            console.error(error);
            await handler();
        }
    };
};

class BasePage {
    constructor() {
        this.driver = new Builder().forBrowser(Browser.CHROME).build();
        this.driver.manage().setTimeouts({ implicit: 5000 });
    }

    async goToUrl(url) {
        await this.driver.get(url);
    }

    async enterText(locator, text) {
        await this.driver.findElement(locator).sendKeys(text);
    }

    async getText(locator) {
        return await this.driver.findElement(locator).getText();
    }

    async click(locator) {
        if (await this.isDriverActive()) {
            await this.driver.findElement(locator).click();
        } else {
            throw new Error('Driver is not active');
        }
    }
    
    async isDriverActive() {
        try {
            await this.driver.getTitle();
            return true;
        } catch (error) {
            return false;
        }
    }
    async isElementPresent(locator) {
        try {
            await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickElement(locator) {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
        await this.driver.findElement(locator).click();
    }

    async getTextFromElement(locator) {
        await this.driver.wait(until.elementIsVisible(this.driver.findElement(locator)), 10000);
        return await this.driver.findElement(locator).getText();
    }

    async getTextFromMultipleElements(locator) {
        const elements = await this.driver.findElements(locator);
        const texts = [];
        for (const element of elements) {
            texts.push(await element.getText());
        }
        return texts;
    }

    async saveScreenshot(fileName) {
        await this.driver.takeScreenshot().then((img) => {
            fs.writeFileSync(fileName, img, 'base64');
        });
    }

    async closeBrowser(delay = 0) {
        if (delay) await this.driver.sleep(delay);
        await this.driver.quit();
    }
}

class TechoParkPage extends BasePage {
    constructor() {
        super();
        this.URL = 'https://www.technopark.ru/'
        this.xpathCatalog = "//*[@id='__layout']/div/header/div/div[2]/div/div[1]/div[1]/div[1]";
        this.xpathCategory = "//*[@id='__layout']/div/header/div/div[2]/div/div[1]/div[1]/div[2]/div[3]/div/div/div[1]/div/div/div/nav/div[3]/a";
        this.xpathXbox = "//*[@id='__layout']/div/header/div/div[2]/div/div[1]/div[1]/div[2]/div[3]/div/div/div[2]/div[6]/div[1]/div/div/div/div[1]/div[1]/div/div[2]/div[1]/div[1]/div[2]/a[2]";
        this.xpathTitles = "//*[@id='catalog-main-container']/div/div[3]/div/article[1]/div/div[1]/div[1]/a[2]/div[2]";
        this.xpathPrices = "//*[@id='catalog-main-container']/div/div[3]/div/article[1]/div/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]";
        this.xpathAddFavorites = "//*[@id='catalog-main-container']/div/div[3]/div/article[1]/div/div[1]/div[1]/div[4]/button[1]";
        this.xpathRemoveFavorites = "//*[@id='catalog-main-container']/div/div[3]/div/article[1]/div/div[1]/div[1]/div[4]/button[1]";
        this.xpathFavoritesList = "//*[@id='__layout']/div/header/div/div[2]/div/div[2]/a[2]";
        this.xpathSave = "//div[@class='_3wd6p _1ehmv']";
    }

    async openPage() {
        await this.goToUrl(this.URL);
        await this.driver.manage().addCookie({
            name: "spravka",
            value: "dD0xNzE0OTI1MDg0O2k9MjEyLjQ2LjEwLjg4O0Q9QkIxMjBCMjA1OUNBMjgxREFCNjRBN0EwNzRBQTRBMTY4RDczQTBCNjQ5QjE5Q0ZFQjgxNUU2RkREM0FBODkzODlFRjAyNUQ4NUZFMEU1RUU5Rjc4RkRDNDI4OTc0ODM5OTY4QUMwREFENzY5QTE5MTNEOURBMkE5RDdFOUU2QTQ2NERDMzREOTFFNTkwOEMwRjc2NTU4NDBEM0VFODA4RTdERThDRTlGNDI5ODQ1RjJBOTBGM0ZBM0I2O3U9MTcxNDkyNTA4NDQzNjA0MTY5MDtoPTg1NzQxN2M1ZjAxZDJkMTc5ZWU1ZDgzMzMyY2I5NGQ3",
        });
        await this.goToUrl(this.URL);
    }

    async clickCatalogButton() {
        await this.clickElement(By.xpath(this.xpathCatalog));
    }

    async hoverCategory() {
        await this.driver.actions().move({ origin: await this.driver.findElement(By.xpath(this.xpathCategory)) }).perform();
        await this.driver.sleep(2000);
    }

    async clickElectro() {
        await this.driver.wait(until.elementLocated(By.xpath(this.xpathXbox)), 10000);
        await this.clickElement(By.xpath(this.xpathXbox));
    }
    async logElements() {
        const xboxTitles = await this.driver.findElements(By.xpath(this.xpathTitles));
        const xboxPrices = await this.driver.findElements(By.xpath(this.xpathPrices));
        const elements = await Promise.all(xboxTitles.slice(0, 5).map(async (el, i) => [await el.getText(), await xboxPrices[i].getText()]));
        for (let [title, price] of elements) {
            console.log(title, price);
        }
        return elements;
    }

    async addFavorites() {
        await this.driver.wait(until.elementLocated(By.xpath(this.xpathAddFavorites)), 10000);
        await this.clickElement(By.xpath(this.xpathAddFavorites));
    }

    async openFavorites() {
        await this.click(By.xpath(this.xpathFavoritesList));
    }

    async getFavorites() {
        const titles = await this.getTextFromMultipleElements(By.xpath(this.xpathTitles));
        const prices = await this.getTextFromMultipleElements(By.xpath(this.xpathPrices));
        return [titles, prices];
    }

    async removeFavorites() {
        if (await this.isElementPresent(By.xpath(this.xpathRemoveFavorites))) {
            await this.clickElement(By.xpath(this.xpathRemoveFavorites));
        } else {
            console.log("Элемент 'Удалить из избранного' не найден");
        }
    }

    async refreshPage() {
        await this.driver.navigate().refresh();
    }

    async getSaveText() {
        await this.driver.wait(until.elementLocated(By.xpath(this.xpathSave)), 10000);
        return await this.getTextFromElement(By.xpath(this.xpathSave));
    }
}

describe("TechoPark test", function () {
    this.timeout(100000);
    const yandexMarketPage = new TechoParkPage();
    let firstElem;

    before(async () => {
        await yandexMarketPage.openPage();
    });

    after(async () => {
        await yandexMarketPage.closeBrowser();
    });

    afterEach(async function () {
        if (this.currentTest.state === "failed") {
            const dateTime = new Date().toLocaleDateString();
            await yandexMarketPage.saveScreenshot(dateTime);
        }
    });

    it(
        "phone page",
        withErrorHandling(
            async () => {
                await yandexMarketPage.clickCatalogButton();
                await yandexMarketPage.hoverCategory();
                await yandexMarketPage.clickElectro();
                await yandexMarketPage.driver.wait(until.elementLocated(By.xpath(yandexMarketPage.xpathXbox)), 10000);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        )
    );

    it(
        "print titles and prices phone",
        withErrorHandling(
            async () => {
                firstElem = await yandexMarketPage.logElements();
                await yandexMarketPage.driver.sleep(SLEEP_TIME7);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png"),
        )
    );

    it(
        "add to favorites",
        withErrorHandling(
            async () => {
                await yandexMarketPage.addFavorites();
            },
            async () => await yandexMarketPage.saveScreenshot("error.png")
        )
    );

    it(
        "open favorites",
        withErrorHandling(
            async () => {
                await yandexMarketPage.openFavorites();
                await yandexMarketPage.driver.sleep(SLEEP_TIME5);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png")
        )
    );

    it(
        "remove favorites",
        withErrorHandling(
            async () => {
                if (await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathRemoveFavorites))) {
                    await yandexMarketPage.clickElement(By.xpath(yandexMarketPage.xpathRemoveFavorites));
                } else {
                    console.log("Элемент 'Удалить из избранного' не найден");
                }
                await yandexMarketPage.driver.sleep(SLEEP_TIME7);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png")
        )
    );

    it(
        "check favorite",
        withErrorHandling(
            async () => {
                if (await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathTitles)) &&
                    await yandexMarketPage.isElementPresent(By.xpath(yandexMarketPage.xpathPrices))) {
                    const [title, price] = await yandexMarketPage.getFavorites();
                    if (title[0] !== firstElem[0][0] || price[0] !== firstElem[0][1]) {
                        throw new Error(`Expected title: ${firstElem[0][0]}, price: ${firstElem[0][1]}. Actual title: ${title[0]}, price: ${price[0]}`);
                    }
                } else {
                    console.log("Элементы на странице 'Избранное' не найдены");
                }
                await yandexMarketPage.driver.sleep(SLEEP_TIME7);
            },
            async () => await yandexMarketPage.saveScreenshot("error.png")
        )
    );

    it(
        "refresh page",
        withErrorHandling(
            async () => {
                await yandexMarketPage.refreshPage();
                const savedText = await yandexMarketPage.getSaveText();
                if (savedText !== "Сохранено") {
                    throw new Error(`Expected "Сохранено", got "${savedText}"`);
                }
            },
            async () => await yandexMarketPage.saveScreenshot("error.png")
        )
    );
});
