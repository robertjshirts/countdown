# Countdown Website

A simple, beautiful countdown timer website that shows the number of hours (and detailed time breakdown) until a specified date/time. The target time is configured via environment variables, making it easy to deploy and customize.

## Features

- **Real-time countdown** with days, hours, minutes, and seconds
- **Total hours display** prominently showing hours remaining
- **Responsive design** that works on desktop and mobile
- **Beautiful modern UI** with gradient backgrounds and animations
- **Easy configuration** via environment variables
- **Multiple deployment options** (Vercel, Netlify, Heroku, etc.)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the configuration template:
```bash
cp config.env .env
```

Edit `.env` and set your target date/time:
```env
TARGET_DATETIME=2024-12-31T23:59:59Z
COUNTDOWN_TITLE=New Year's Eve Countdown
PORT=3000
```

**Date Format Examples:**
- UTC time: `2024-12-31T23:59:59Z`
- Local time with timezone: `2024-12-25T09:00:00-05:00`
- ISO 8601 format: `2024-06-15T12:00:00.000Z`

### 3. Run Locally

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to see your countdown timer.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `TARGET_DATETIME`
   - `COUNTDOWN_TITLE`
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Set build command: `npm install`
4. Set publish directory: `public`
5. Add environment variables in Netlify dashboard
6. For the server functionality, you'll need to use Netlify Functions or deploy elsewhere

### Heroku

1. Install Heroku CLI
2. Create a new Heroku app:
   ```bash
   heroku create your-countdown-app
   ```
3. Set environment variables:
   ```bash
   heroku config:set TARGET_DATETIME="2024-12-31T23:59:59Z"
   heroku config:set COUNTDOWN_TITLE="Your Countdown"
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Railway

1. Connect your GitHub repository to [Railway](https://railway.app)
2. Add environment variables in Railway dashboard
3. Deploy automatically

### DigitalOcean App Platform

1. Connect your repository to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Configure environment variables
3. Deploy

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TARGET_DATETIME` | Yes | Target date and time in ISO 8601 format | `2024-12-31T23:59:59Z` |
| `COUNTDOWN_TITLE` | No | Custom title for the countdown | `"New Year's Eve Countdown"` |
| `PORT` | No | Port for local development (default: 3000) | `3000` |

### Customization

You can customize the appearance by editing:
- `public/styles.css` - Colors, fonts, layout
- `public/index.html` - Structure and content
- `public/script.js` - Behavior and functionality

## API Endpoint

The app provides a REST API endpoint at `/api/countdown` that returns:

```json
{
  "title": "New Year's Eve Countdown",
  "targetDateTime": "2024-12-31T23:59:59.000Z",
  "totalHours": 8760,
  "timeRemaining": {
    "days": 365,
    "hours": 0,
    "minutes": 0,
    "seconds": 0
  },
  "isComplete": false
}
```

## Development

### File Structure

```
countdown/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies and scripts
├── config.env          # Environment template
└── README.md          # This file
```

### Local Development

1. Make changes to files
2. Server will auto-restart if using `npm run dev`
3. Refresh browser to see changes

## Troubleshooting

### Common Issues

1. **"TARGET_DATETIME not configured"**
   - Make sure you have a `.env` file with `TARGET_DATETIME` set

2. **"Invalid TARGET_DATETIME format"**
   - Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
   - Include timezone: `2024-12-31T23:59:59-05:00`

3. **Website not loading**
   - Check that all dependencies are installed: `npm install`
   - Verify the port is not in use
   - Check console for error messages

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your `.env` file configuration
3. Ensure all dependencies are installed
4. Check that the target date is in the future

## License

MIT License - feel free to use this for any countdown needs! 