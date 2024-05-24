const BasePage = require('./basepage');
const { By, Key } = require('selenium-webdriver');

class MospolytechPage extends BasePage {

    constructor() {
        super();
        this.schedulesButton = By.css('a[title="Расписание"]');
        this.seeOnWebsiteLink = By.css('a[href="https://rasp.dmami.ru/"]');
    }

    get searchField() { return By.xpath("//input[@class='groups']") }

    async open() {
        await this.goToUrl('https://mospolytech.ru/');
    }

    async clickSchedulesButton() {
        await this.click(this.schedulesButton);
    }

    async clickSeeOnWebsiteLink() {
        await this.click(this.seeOnWebsiteLink);
    }

    async SwitchToNextTab() {
        let originalTab = await driver.getWindowHandle();
        const windows = await driver.getAllWindowHandles();
        
        windows.forEach(async handle => {
            if (handle !== originalTab) {
                await driver.switchTo().window(handle);
            }
        });
    }

    async searchGroup(searchText) {
        await this.enterText(this.searchField, searchText);
        // await driver.findElement(By.css("input[@class='groups']"))
        // // await driver.wait(until.elementLocated(By.xpath("//input[@class='groups']")), 5000);
    }

    get currentWeekDay() {
        return By.xpath('//div[contains(@class, "schedule-day_today")]/div[contains(@class, "schedule-day__title")]')
    }
    
}

module.exports = new MospolytechPage();
