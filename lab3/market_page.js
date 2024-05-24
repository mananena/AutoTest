const {By, Key, until} = require('selenium-webdriver')
const BasePage = require('../lab3/basepage')

class YandexMarketPage extends BasePage {
    async open() {
        await this.goToUrl("https://market.yandex.ru")
    }

    get CatalogButton() {
        return By.xpath(`//button/span[text()="Каталог"]/..`)
    }

    get LinkInUl() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../../../li[position() = 5]`)
    }

    get LaptopAndComputerLink() {
        return By.xpath(`//li/a//span[text() = "Ноутбуки и компьютеры"]/../..`)
    }
    
    get LaptopLink() {
        return By.xpath(`//div[@data-baobab-name="new-category-snippet"]//h3/following-sibling::div//div[text() = "Ноутбуки"]/ancestor::a`)
    }

    get ListViewRadio() {
        return By.xpath(`//input[@name="viewType" and @aria-label="в виде списка"]`)
    }

    async getHeaderFromProductCardByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//h3`)
    }

    async getPriceFromProductCardByID(id=1) {
        return By.xpath(`//div[@data-auto="SerpList"]/div[@data-apiary-widget-name="@marketfront/SerpEntity" and position() = ${id+1}]//div[@data-baobab-name="price"]//span[@data-auto="snippet-price-current"]/span[@class="_1ArMm"]`)
    }

    getInputMinPrice() {
        return By.xpath('//div[@data-baobab-name="filter" and position() = 1]//div[@data-auto="filter-range-glprice"]//span[@data-auto="filter-range-min"]//input')
    }

    getInputMaxPrice() {
        return By.xpath('//div[@data-baobab-name="filter" and position() = 1]//div[@data-auto="filter-range-glprice"]//span[@data-auto="filter-range-max"]//input')
    }

    async waitElementLocated(locator) {
        await this.waitUntil(until.elementLocated(locator))
    }

}

module.exports = new YandexMarketPage()