"use strict";

class AnalogueClockView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;

        // Set canvas size
        this.size = 300;
        this.canvas.width = this.size;
        this.canvas.height = this.size;

        // Start animation
        this.animate();
    }

    updateTime(hours, minutes, seconds) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    drawClock() {
        const ctx = this.ctx;
        const radius = this.size / 2;
        const centerX = radius;
        const centerY = radius;

        // Clear canvas
        ctx.clearRect(0, 0, this.size, this.size);

        // Draw clock face
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw hour markers
        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x1 = centerX + (radius - 20) * Math.cos(angle);
            const y1 = centerY + (radius - 20) * Math.sin(angle);
            const x2 = centerX + (radius - 5) * Math.cos(angle);
            const y2 = centerY + (radius - 5) * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#333';
            ctx.stroke();

            // Draw numbers
            const numX = centerX + (radius - 35) * Math.cos(angle);
            const numY = centerY + (radius - 35) * Math.sin(angle);
            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i.toString(), numX, numY);
        }

        // Draw minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue; // Skip hour markers
            const angle = (i * 6 - 90) * Math.PI / 180;
            const x1 = centerX + (radius - 12) * Math.cos(angle);
            const y1 = centerY + (radius - 12) * Math.sin(angle);
            const x2 = centerX + (radius - 5) * Math.cos(angle);
            const y2 = centerY + (radius - 5) * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#666';
            ctx.stroke();
        }

        // Draw hour hand
        let hourAngle = ((this.hours % 12) * 30 + this.minutes * 0.5) * Math.PI / 180 - Math.PI / 2;
        this.drawHand(centerX, centerY, hourAngle, radius * 0.5, 6, '#222');

        // Draw minute hand
        let minuteAngle = (this.minutes * 6 + this.seconds * 0.1) * Math.PI / 180 - Math.PI / 2;
        this.drawHand(centerX, centerY, minuteAngle, radius * 0.7, 4, '#222');

        // Draw second hand
        let secondAngle = (this.seconds * 6) * Math.PI / 180 - Math.PI / 2;
        this.drawHand(centerX, centerY, secondAngle, radius * 0.85, 2, '#ff4444');

        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff4444';
        ctx.fill();
    }

    drawHand(centerX, centerY, angle, length, width, color) {
        const ctx = this.ctx;
        const x = centerX + length * Math.cos(angle);
        const y = centerY + length * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    animate() {
        this.drawClock();
        requestAnimationFrame(() => this.animate());
    }
}
