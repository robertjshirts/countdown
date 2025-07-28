class CountdownList {
    constructor() {
        this.timers = [];
        this.init();
    }

    async init() {
        await this.fetchAndRenderCountdowns();
        // Update every second
        this.interval = setInterval(() => {
            this.updateCountdowns();
        }, 1000);
    }

    async fetchAndRenderCountdowns() {
        try {
            const response = await fetch('/api/countdown');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch countdown data');
            }

            this.renderCountdowns(data.countdowns || []);
        } catch (error) {
            this.renderError(error.message);
        }
    }

    renderCountdowns(countdowns) {
        const listContainer = document.getElementById('countdown-list');
        listContainer.innerHTML = '';

        if (!Array.isArray(countdowns) || countdowns.length === 0) {
            this.renderError('No countdowns configured.');
            return;
        }

        this.timers = countdowns.map((cd, idx) => {
            const card = document.createElement('div');
            card.className = 'countdown-card';

            // Title (link to target if valid date)
            const titleEl = document.createElement('h1');
            titleEl.className = 'countdown-title';
            titleEl.textContent = cd.title || `Countdown ${idx + 1}`;
            card.appendChild(titleEl);

            // Target date
            const targetDate = new Date(cd.targetDateTime);
            const targetDateEl = document.createElement('div');
            targetDateEl.className = 'target-date';
            targetDateEl.innerHTML = `Target: <span class="target-datetime">${isNaN(targetDate.getTime()) ? 'Invalid date' : targetDate.toLocaleString()}</span>`;
            card.appendChild(targetDateEl);

            // Time display
            const timeDisplay = document.createElement('div');
            timeDisplay.className = 'time-display';
            timeDisplay.style.display = cd.isComplete ? 'none' : 'grid';

            // Time units
            ['days', 'hours', 'minutes', 'seconds'].forEach(unit => {
                const unitDiv = document.createElement('div');
                unitDiv.className = 'time-unit';

                const valueSpan = document.createElement('span');
                valueSpan.className = 'time-value';
                valueSpan.classList.add(`cd-${unit}-${idx}`);
                valueSpan.textContent = cd.timeRemaining ? cd.timeRemaining[unit] : '--';

                const labelSpan = document.createElement('span');
                labelSpan.className = 'time-label';
                labelSpan.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);

                unitDiv.appendChild(valueSpan);
                unitDiv.appendChild(labelSpan);
                timeDisplay.appendChild(unitDiv);
            });
            card.appendChild(timeDisplay);

            // Total hours
            const totalHoursDiv = document.createElement('div');
            totalHoursDiv.className = 'total-hours';
            totalHoursDiv.style.display = cd.isComplete ? 'none' : 'flex';

            const hoursNumber = document.createElement('span');
            hoursNumber.className = `hours-number cd-hours-number-${idx}`;
            hoursNumber.textContent = cd.totalHours !== undefined ? cd.totalHours : '--';

            const hoursLabel = document.createElement('span');
            hoursLabel.className = 'hours-label';
            hoursLabel.textContent = 'Total Hours Remaining';

            totalHoursDiv.appendChild(hoursNumber);
            totalHoursDiv.appendChild(hoursLabel);
            card.appendChild(totalHoursDiv);

            // Completed message
            const completedMsg = document.createElement('div');
            completedMsg.className = 'completed-message';
            completedMsg.style.display = cd.isComplete ? 'block' : 'none';
            completedMsg.textContent = '🎉 Countdown Complete! 🎉';
            card.appendChild(completedMsg);

            // Error message (if any)
            if (cd.error) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = `<p>${cd.error}</p>`;
                card.appendChild(errorDiv);
            }

            listContainer.appendChild(card);

            // Return timer state for updating
            return {
                idx,
                isComplete: cd.isComplete,
                targetDateTime: cd.targetDateTime,
                card,
                completedMsg,
                timeDisplay,
                totalHoursDiv,
                hoursNumber,
                timeUnits: {
                    days: card.querySelector(`.cd-days-${idx}`),
                    hours: card.querySelector(`.cd-hours-${idx}`),
                    minutes: card.querySelector(`.cd-minutes-${idx}`),
                    seconds: card.querySelector(`.cd-seconds-${idx}`)
                }
            };
        });
    }

    async updateCountdowns() {
        try {
            const response = await fetch('/api/countdown');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch countdown data');
            }

            const countdowns = data.countdowns || [];
            countdowns.forEach((cd, idx) => {
                const timer = this.timers[idx];
                if (!timer) return;

                // Update time units
                if (cd.timeRemaining) {
                    timer.timeUnits.days.textContent = cd.timeRemaining.days;
                    timer.timeUnits.hours.textContent = cd.timeRemaining.hours;
                    timer.timeUnits.minutes.textContent = cd.timeRemaining.minutes;
                    timer.timeUnits.seconds.textContent = cd.timeRemaining.seconds;
                }

                // Update total hours
                timer.hoursNumber.textContent = cd.totalHours !== undefined ? cd.totalHours : '--';

                // Show/hide completed message and time display
                if (cd.isComplete && !timer.isComplete) {
                    timer.timeDisplay.style.display = 'none';
                    timer.totalHoursDiv.style.display = 'none';
                    timer.completedMsg.style.display = 'block';
                    timer.isComplete = true;
                } else if (!cd.isComplete && timer.isComplete) {
                    timer.timeDisplay.style.display = 'grid';
                    timer.totalHoursDiv.style.display = 'flex';
                    timer.completedMsg.style.display = 'none';
                    timer.isComplete = false;
                }
            });
        } catch (error) {
            this.renderError(error.message);
        }
    }

    renderError(errorMessage) {
        const listContainer = document.getElementById('countdown-list');
        listContainer.innerHTML = `
            <div class="error-message" style="display: block;">
                <p>Unable to load countdown data.</p>
                <p>${errorMessage}</p>
            </div>
        `;
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Initialize countdown list when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.countdownList = new CountdownList();
});

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', () => {
    if (window.countdownList) {
        window.countdownList.destroy();
    }
});
