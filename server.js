require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint to get countdown data
app.get('/api/countdown', (req, res) => {
  try {
    const targetDateTime = process.env.TARGET_DATETIME;
    const title = process.env.COUNTDOWN_TITLE || 'Countdown';
    
    if (!targetDateTime) {
      return res.status(500).json({ 
        error: 'TARGET_DATETIME not configured in environment variables' 
      });
    }

    const target = new Date(targetDateTime);
    const now = new Date();
    
    if (isNaN(target.getTime())) {
      return res.status(500).json({ 
        error: 'Invalid TARGET_DATETIME format. Use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)' 
      });
    }

    const diffMs = target.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    // Calculate days, hours, minutes, seconds for more detailed display
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    res.json({
      title,
      targetDateTime: target.toISOString(),
      totalHours: Math.max(0, diffHours),
      timeRemaining: {
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds)
      },
      isComplete: diffMs <= 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error calculating countdown' });
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