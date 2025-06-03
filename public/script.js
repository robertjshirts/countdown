class CountdownTimer {
    constructor() {
        this.interval = null;
        this.init();
    }

    init() {
        this.updateCountdown();
        // Update every second
        this.interval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    async updateCountdown() {
        try {
            const response = await fetch('/api/countdown');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch countdown data');
            }

            this.renderCountdown(data);
        } catch (error) {
            this.renderError(error.message);
        }
    }

    renderCountdown(data) {
        // Hide error message if it was showing
        document.getElementById('error-message').style.display = 'none';

        // Update title
        document.getElementById('countdown-title').textContent = data.title;

        // Update target date
        const targetDate = new Date(data.targetDateTime);
        document.getElementById('target-datetime').textContent = 
            targetDate.toLocaleString();

        if (data.isComplete) {
            // Show completion message
            document.getElementById('time-display').style.display = 'none';
            document.getElementById('total-hours').style.display = 'none';
            document.getElementById('completed-message').style.display = 'block';
            
            // Stop the interval
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        } else {
            // Show countdown
            document.getElementById('time-display').style.display = 'grid';
            document.getElementById('total-hours').style.display = 'flex';
            document.getElementById('completed-message').style.display = 'none';

            // Update time units
            document.getElementById('days').textContent = data.timeRemaining.days;
            document.getElementById('hours').textContent = data.timeRemaining.hours;
            document.getElementById('minutes').textContent = data.timeRemaining.minutes;
            document.getElementById('seconds').textContent = data.timeRemaining.seconds;

            // Update total hours
            document.querySelector('.hours-number').textContent = data.totalHours;
        }
    }

    renderError(errorMessage) {
        // Hide countdown elements
        document.getElementById('time-display').style.display = 'none';
        document.getElementById('total-hours').style.display = 'none';
        document.getElementById('completed-message').style.display = 'none';
        
        // Show error message
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('error-details').textContent = errorMessage;
        
        // Update title to show error state
        document.getElementById('countdown-title').textContent = 'Configuration Error';
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Initialize countdown timer when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Clean up interval when page is unloaded
window.addEventListener('beforeunload', () => {
    if (window.countdownTimer) {
        window.countdownTimer.destroy();
    }
}); 