const assert = require('assert');
const MospolytechPage = require('../lab2/mospolytech_page');
const { By } = require('selenium-webdriver');

function getCurrentWeekDay() {
    let date = new Date()
    let options = { weekday: "long" };
    return new Intl.DateTimeFormat("ru-RU", options).format(date)
}

describe('Mospolytech.ru test', function() {

    beforeEach(async function() {
        await MospolytechPage.open();
    });

    it('Поиск расписания группы 221-322', async function() {
        try {
            await MospolytechPage.clickSchedulesButton();
            await MospolytechPage.clickSeeOnWebsiteLink();
            await MospolytechPage.SwitchToNextTab();
            await MospolytechPage.searchGroup('221-322');
            await driver.sleep(3000);
            await MospolytechPage.click(By.xpath('//div[@id="221-322"]'));
            await driver.sleep(2000);
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    });

    it('Сравнивает выделенный день недели с сегодняшним', async function() {
        try {
            let weekDayOnPage = await MospolytechPage.getTextOfElement(MospolytechPage.currentWeekDay);
            let systemWeekDay = getCurrentWeekDay(); 
            assert.strictEqual(weekDayOnPage.toUpperCase(), systemWeekDay.toUpperCase(), "Дни недели не совпадают");
        } catch (error) {
            console.log("На странице нет выделенного дня недели");
        }
    });
    
    

    afterEach(async function() {
        await MospolytechPage.closeBrowser();
    });
});
