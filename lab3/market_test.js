const assert = require('assert'); 
const { before, after, afterEach, describe, it } = require('mocha')
const { By } = require('selenium-webdriver');
const page = require('./market_page')
const getNowDateAndTime = require('./currentDateTime')

describe('Яндекс маркет', async function() {
    before(async function() {
        await page.open()
    })

    it('Нажимает на кнопку каталога', async function() {
        await page.waitElementLocated(page.CatalogButton)
        page.sleep(1000)

        await page.click(page.CatalogButton)
        page.sleep(1000)
    })
    
    it('Переходим в Ноутбуки и компьютеры', async function() {
        await page.waitElementLocated(page.LinkInUl)
        page.sleep(1000)
        
        await page.click(page.LaptopAndComputerLink)
        page.sleep(1000)
    })

    it('Переходит по ссылке Ноутбуки', async function() {
        await page.waitElementLocated(page.LaptopLink)
        await page.sleep(1000)
        
        await page.click(page.LaptopLink)
        page.sleep(1000)
    })

    let rememberHeading
    let rememberPrice
    let cardHeader
    let cardPrice

    it('Выводит в лог первые пять товаров', async function() {
        await page.waitElementLocated(await page.getHeaderFromProductCardByID(1))
        await page.sleep(1000)
        
        console.log(`Первые пять товаров:`)
        for (let i=1; i<6; i++) {
            if(i >= 4) {
                cardHeader = await page.getHeaderFromProductCardByID(i+1)
                cardPrice = await page.getPriceFromProductCardByID(i+1)
            } else {
                cardHeader = await page.getHeaderFromProductCardByID(i)
                cardPrice = await page.getPriceFromProductCardByID(i)
            }

            let text = await page.getTextOfElement(cardHeader)
            let price = await page.getTextOfElement(cardPrice)
            if (i == 2) {
                rememberHeading = text
                rememberPrice = price
            }
            console.log(`\t${i}) ${text} - ${price} рублей`)
        }

        console.log(`Я запомнил товар: \n\t ${rememberHeading} - ${rememberPrice} рублей`);
    })

    it('Вводим фильтр цена от 60000 до 110000', async function() {
        // await page.waitElementLocated(await page.getInputMinPrice())
        // await page.waitElementLocated(await page.getInputMaxPrice())
        await page.sleep(1000)

        await page.enterText(page.getInputMinPrice(), 60000)
        await page.sleep(1000)

        await page.sleep(1000)
        await page.enterText(page.getInputMaxPrice(), 110000)
        await page.sleep(1000)
    })

    it('Проверка на соответсвие цены и фильтра', async function () {
        await page.waitElementLocated(await page.getHeaderFromProductCardByID(1))
        await page.sleep(1000)
        
        console.log("Проверка 5 товаров:")
        for (let i=1; i<6; i++) {
            if(i >= 4) {
                cardPrice = await page.getPriceFromProductCardByID(i+1)
            } else {
                cardPrice = await page.getPriceFromProductCardByID(i)
            }
            let price = await page.getTextOfElement(cardPrice)
            price = parseInt(price.replace(/\s/g, ""))

            let minPrice = 60000;
            let maxPrice = 110000;
    
            assert.strictEqual(price >= minPrice && price <= maxPrice, true, "\t${i}) товар не соответствует диапазону цен.");
        }
    })
    
    afterEach(async function() {
        if (this.currentTest.state == 'failed') {
            let dateTime = getNowDateAndTime()
            let imageFileName = `${this.currentTest.title}_${dateTime}.jpg`
            await page.saveScreenshot(imageFileName)
        }
    })

    after(async function() {
        await page.closeBrowser()
    })
})