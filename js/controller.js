"use strict";
/*******************************************************
 *     Back to the Future - 100p
 *
 *     Marty! Marty can you read me? This is Doc Brown,
 *     im messaging you from the Year of 1955!
 *
 *     The Flux Capacitor worked and I traveled back in time!
 *     I don't have time to explain all the details, but
 *     time itself is of the essence Marty! As proud as I am
 *     of my achievement, it seems like I can't come back to
 *     the future. At least not without your help!
 *
 *     Do you remember the Wrist-watch I gave you? You need
 *     to sync its hands to match the digital clock of the
 *     Delorean! Only when they are perfectly in sync, the
 *     Flux Capacitor can bring me back to 1985!
 *
 *     I think it's best to create a model first, which keeps
 *     track of the true time. Once we got that, we can sync
 *     the two clocks in separate views. Yours, analogue and
 *     animated, mine digital. Use this controller file to
 *     glue everything together!
 *
 *     Our clocks should be synced in no-time! Got it?
 *     No - Time! *laughs nervously*. Unfortunatley, I only
 *     have enough fuel for one ride. So we need to be 100%
 *     certain that it works. I'd suggest you add a button somewhere
 *     that saves the current time into the localStorage.
 *
 *     Now hurry Marty! Or I will be stuck in the past forever!
 *
 *     Doc Brown - 1955-11-05
 *******************************************************/

// HINT:
// setInterval(functionName, 1000); will call functionName() every 1000 miliseconds.

"use strict";

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // Create the model (single source of truth)
    const timeModel = new TimeModel();

    // Create the container structure first
    const container = document.createElement('div');
    container.className = 'clock-container';

    // Create analogue clock wrapper with title
    const analogueWrapper = document.createElement('div');
    analogueWrapper.className = 'clock-wrapper';
    const analogueTitle = document.createElement('h2');
    analogueTitle.textContent = 'Wrist Watch';
    analogueTitle.className = 'clock-title';
    const analogueCanvas = document.createElement('canvas');
    analogueCanvas.id = 'analogueCanvas';
    analogueWrapper.appendChild(analogueTitle);
    analogueWrapper.appendChild(analogueCanvas);

    // Create digital clock wrapper with title
    const digitalWrapper = document.createElement('div');
    digitalWrapper.className = 'clock-wrapper';
    const digitalTitle = document.createElement('h2');
    digitalTitle.textContent = 'Digital Clock';
    digitalTitle.className = 'clock-title';
    const digitalDisplay = document.createElement('div');
    digitalDisplay.id = 'digitalClock';
    digitalDisplay.className = 'digital-display';
    digitalWrapper.appendChild(digitalTitle);
    digitalWrapper.appendChild(digitalDisplay);

    container.appendChild(analogueWrapper);
    container.appendChild(digitalWrapper);

    // Add flux capacitor decoration
    const fluxDecoration = document.createElement('div');
    fluxDecoration.className = 'flux-decoration';
    fluxDecoration.innerHTML = 'Flux Capacitor';

    // Create save button
    const saveButton = document.createElement('button');
    saveButton.textContent = '---Save Current Time---';
    saveButton.id = 'saveTimeBtn';
    saveButton.className = 'save-button';

    // Create status message element
    const statusMessage = document.createElement('div');
    statusMessage.id = 'statusMessage';
    statusMessage.className = 'status-message';

    // Create sync indicator
    const syncIndicator = document.createElement('div');
    syncIndicator.className = 'sync-indicator';
    syncIndicator.innerHTML = 'Clocks synced';

    // FIRST: Append all elements to body
    document.body.appendChild(container);
    document.body.appendChild(fluxDecoration);
    document.body.appendChild(saveButton);
    document.body.appendChild(statusMessage);
    document.body.appendChild(syncIndicator);

    // THEN: Create views AFTER the canvas element exists in DOM
    const analogueView = new AnalogueClockView('analogueCanvas');
    const digitalView = new DigitalClockView('digitalClock');

    // Register views as observers
    timeModel.addObserver(analogueView);
    timeModel.addObserver(digitalView);

    // Initialize with current time
    const now = new Date();
    timeModel.setTimeFromDate(now);

    // Load saved time from localStorage if exists
    const savedTime = localStorage.getItem('savedFluxTime');
    if (savedTime) {
        try {
            const timeData = JSON.parse(savedTime);
            // Check if saved time is from today (not older than 24 hours)
            const savedDate = new Date(timeData.timestamp);
            const nowDate = new Date();
            if (nowDate - savedDate < 24 * 60 * 60 * 1000) {
                timeModel.setTime(timeData.hours, timeData.minutes, timeData.seconds);
                statusMessage.textContent = 'LOADED SAVED TIME: ${timeModel.getTimeString()}';
                statusMessage.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
                statusMessage.style.opacity = '1';
                setTimeout(() => {
                    statusMessage.style.opacity = '0';
                    setTimeout(() => {
                        if (statusMessage.textContent.includes('LOADED SAVED TIME')) {
                            statusMessage.textContent = '';
                        }
                    }, 500);
                }, 3000);
            } else {
                localStorage.removeItem('savedFluxTime'); // Remove old data
            }
        } catch (e) {
            console.error('Failed to load saved time', e);
        }
    }

    // Start the clock ticking every second
    setInterval(() => {
        timeModel.tick();
    }, 1000);

    // Save button functionality
    saveButton.addEventListener('click', () => {
        const currentHours = timeModel.hours;
        const currentMinutes = timeModel.minutes;
        const currentSeconds = timeModel.seconds;

        const timeToSave = {
            hours: currentHours,
            minutes: currentMinutes,
            seconds: currentSeconds,
            timestamp: new Date().toISOString(),
            formattedTime: timeModel.getTimeString()
        };

        localStorage.setItem('savedFluxTime', JSON.stringify(timeToSave));

        // Show success message
        statusMessage.textContent = `TIME SAVED! (${timeModel.getTimeString()})`;
        statusMessage.style.backgroundColor = 'rgba(46, 204, 113, 0.9)';
        statusMessage.style.opacity = '1';

        // Flash effect on button
        saveButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            saveButton.style.transform = 'scale(1)';
        }, 200);

        // Fade out message after 3 seconds
        setTimeout(() => {
            statusMessage.style.opacity = '0';
            setTimeout(() => {
                if (statusMessage.textContent.includes('TIME SAVED')) {
                    statusMessage.textContent = '';
                    statusMessage.style.backgroundColor = '';
                }
            }, 500);
        }, 3000);
    });

    // Add keyboard shortcut (Ctrl+S or Cmd+S)
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveButton.click();
        }
    });
});
