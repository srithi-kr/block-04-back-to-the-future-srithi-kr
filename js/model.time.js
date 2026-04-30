"use strict";

class TimeModel {
    constructor() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.observers = [];
    }

    // Add observer to notify when time changes
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Notify all observers of time change
    notifyObservers() {
        this.observers.forEach(observer => observer.updateTime(this.hours, this.minutes, this.seconds));
    }

    // Set time from Date object
    setTimeFromDate(date) {
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.notifyObservers();
    }

    // Set time manually (for loading from localStorage)
    setTime(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.notifyObservers();
    }

    // Increment time by one second
    tick() {
        this.seconds++;
        if (this.seconds >= 60) {
            this.seconds = 0;
            this.minutes++;
            if (this.minutes >= 60) {
                this.minutes = 0;
                this.hours++;
                if (this.hours >= 24) {
                    this.hours = 0;
                }
            }
        }
        this.notifyObservers();
    }

    // Get current time as formatted string
    getTimeString() {
        return `${this.formatNumber(this.hours)}:${this.formatNumber(this.minutes)}:${this.formatNumber(this.seconds)}`;
    }

    // Helper to format numbers with leading zero
    formatNumber(num) {
        return num < 10 ? '0' + num : num;
    }
}
