require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

/**
 * API endpoint to get countdown data
 * Now supports multiple countdowns via comma-separated env variables:
 * TARGET_DATETIMES and COUNTDOWN_TITLES
 */
app.get('/api/countdown', (req, res) => {
  try {
    const targetDateTimes = (process.env.TARGET_DATETIMES || process.env.TARGET_DATETIME || '').split(',').map(s => s.trim()).filter(Boolean);
    const titles = (process.env.COUNTDOWN_TITLES || process.env.COUNTDOWN_TITLE || '').split(',').map(s => s.trim());
    

    if (!targetDateTimes.length) {
      return res.status(500).json({
        error: 'TARGET_DATETIMES (or TARGET_DATETIME) not configured in environment variables'
      });
    }

    const now = new Date();
    let countdowns = targetDateTimes.map((targetDateTime, i) => {
      const title = titles[i] || `Countdown ${i + 1}`;
      const target = new Date(targetDateTime);

      if (isNaN(target.getTime())) {
        return {
          title,
          targetDateTime,
          error: 'Invalid date format. Use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)'
        };
      }

      const diffMs = target.getTime() - now.getTime();
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      return {
        title,
        targetDateTime: target.toISOString(),
        totalHours: Math.max(0, diffHours),
        timeRemaining: {
          days: Math.max(0, days),
          hours: Math.max(0, hours),
          minutes: Math.max(0, minutes),
          seconds: Math.max(0, seconds)
        },
        isComplete: diffMs <= 0,
        _diffMs: diffMs,
        _targetTime: target.getTime()
      };
    });

    // Sort: completed first (most recently completed first), then uncompleted (soonest first)
    countdowns = countdowns.sort((a, b) => {
      if (a.isComplete && b.isComplete) {
        // Most recently completed first (largest _targetTime first)
        return b._targetTime - a._targetTime;
      }
      if (!a.isComplete && !b.isComplete) {
        // Soonest to be achieved first (smallest _diffMs first)
        return a._diffMs - b._diffMs;
      }
      // Completed before uncompleted
      return a.isComplete ? -1 : 1;
    });

    // Remove internal fields before sending
    countdowns = countdowns.map(cd => {
      const { _diffMs, _targetTime, ...rest } = cd;
      return rest;
    });

    res.json({ countdowns });
  } catch (error) {
    res.status(500).json({ error: 'Server error calculating countdowns' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Countdown website running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the countdown`);
});
