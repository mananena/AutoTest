function getCurrentWeekDay() {
    let date = new Date()
    let options = { weekday: "long" };
    return new Intl.DateTimeFormat("ru-RU", options).format(date)
}

module.exports = getCurrentWeekDay