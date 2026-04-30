"use strict";

class DigitalClockView {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }

    updateTime(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.render();
    }

    render() {
        const timeString = `${this.formatNumber(this.hours)}:${this.formatNumber(this.minutes)}:${this.formatNumber(this.seconds)}`;
        this.element.textContent = timeString;
    }

    formatNumber(num) {
        return num < 10 ? '0' + num : num;
    }
}
