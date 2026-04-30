# Deployment Guide

## Backend Deployment (Node.js Server)

### Option 1: Heroku (Recommended for Beginners)

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-ai-sales-bot-api
```

4. **Set Environment Variables**
```bash
heroku config:set SUPABASE_URL="your-supabase-url"
heroku config:set SUPABASE_KEY="your-supabase-key"
heroku config:set OPENAI_API_KEY="your-openai-key"
heroku config:set JWT_SECRET="your-secret-key-random-string"
```

5. **Deploy**
```bash
git push heroku main
```

6. **View Live**
```bash
heroku open
```

Your API will be at: `https://your-ai-sales-bot-api.herokuapp.com`

### Option 2: Railway.app

1. **Create Account** at railway.app

2. **Connect GitHub Repository**
- Push your code to GitHub
- Connect your repo to Railway

3. **Set Environment Variables**
- Go to Variables tab
- Add all .env variables

4. **Deploy**
- Railway auto-deploys on push to main

Your API will be at the URL Railway provides

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean Account**

2. **Connect GitHub Repository**

3. **Configure as Node.js App**
- Set build command: `npm install`
- Set run command: `npm start`

4. **Set Environment Variables**
- Add all .env variables

5. **Deploy**

## Frontend Deployment (React App)

### Option 1: Netlify (Recommended)

1. **Build the Project**
```bash
cd frontend
npm run build
```

2. **Create Netlify Account** - netlify.com

3. **Connect GitHub**
- Authorize Netlify
- Select your repository

4. **Configure Build Settings**
- Build command: `npm run build`
- Publish directory: `dist`

5. **Set Environment Variables** (if using .env)
- Add VITE_API_URL in Netlify dashboard

6. **Deploy**
- Netlify auto-deploys on push to main

Your frontend will be at: `https://your-app-name.netlify.app`

### Option 2: Vercel

1. **Build the Project**
```bash
npm run build
```

2. **Create Vercel Account** - vercel.com

3. **Import Project**
- Select your GitHub repository
- Vercel auto-detects React/Vite

4. **Deploy**
- Vercel auto-deploys on push

### Option 3: GitHub Pages

```bash
# Update vite.config.js
export default {
  base: '/repo-name/',
  // ... rest of config
}

# Build
npm run build

# Deploy dist/ folder to gh-pages branch
```

## Updating API URLs After Deployment

After deploying backend, update the API base URL in frontend:

**Option 1: Environment Variable**
Create `frontend/.env.production`:
```
VITE_API_URL=https://your-api.herokuapp.com
```

Update axios calls:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
axios.post(`${apiUrl}/login`, {...})
```

**Option 2: Direct Update**
In each component that calls the API:
```javascript
// Change from:
axios.post('http://localhost:3001/login', ...)

// To:
axios.post('https://your-api.herokuapp.com/login', ...)
```

## Database Considerations

### Backup Your Data
Before deploying, backup your Supabase database:
1. Go to Supabase dashboard
2. Project Settings → Backups
3. Create manual backup

### Production Database
- Use same Supabase project for production
- Consider enabling automatic backups
- Monitor database performance
- Set up alerts for high usage

## SSL/HTTPS

All modern hosting platforms provide free SSL:
- ✅ Heroku - automatic SSL
- ✅ Netlify - automatic SSL
- ✅ Vercel - automatic SSL
- ✅ Railway - automatic SSL

## Domain Setup

Map your custom domain:

**Netlify:**
1. Domain Settings → Custom Domain
2. Add your domain
3. Update DNS records per instructions

**Vercel:**
1. Project Settings → Domains
2. Add custom domain
3. Update DNS records

**Heroku:**
```bash
heroku domains:add your-domain.com
# Update DNS per instructions
```

## Monitoring & Logs

### Backend Logs
- **Heroku**: `heroku logs --tail`
- **Railway**: View in dashboard
- **DigitalOcean**: View in dashboard

### Error Tracking
Consider adding error tracking:
- Sentry (free tier available)
- LogRocket
- Rollbar

### Performance Monitoring
- Use your hosting platform's analytics
- Monitor API response times
- Check database query performance

## Cost Estimates (Monthly)

- **Supabase**: Free tier (5GB), $25+/month for more
- **Heroku**: $7/month (Eco Dyno)
- **Netlify**: Free tier (100GB bandwidth)
- **OpenAI**: Pay per use (~$0.03/1000 tokens)
- **Domain**: $10-15/year

**Total**: ~$40-50/month for small to medium usage

## Security Checklist

Before deploying to production:

- ✅ Change JWT_SECRET to random strong string
- ✅ Set NODE_ENV=production on backend
- ✅ Enable HTTPS on all endpoints
- ✅ Set CORS to whitelist your domain
- ✅ Implement rate limiting
- ✅ Enable Supabase Row Level Security
- ✅ Review environment variables
- ✅ Add database backups
- ✅ Monitor API usage and costs
- ✅ Test authentication flow

## Continuous Integration

### GitHub Actions (Free)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
```

## Rollback

If something goes wrong:

**Heroku:**
```bash
heroku releases                    # View releases
heroku rollback v{number}         # Rollback
```

**Netlify:** Deploy previews allow easy testing before publishing

**Vercel:** Each deployment is versioned and can be reverted

## Troubleshooting Deployment

### Backend won't start
- Check logs with hosting provider
- Verify all environment variables set
- Check package.json main entry point
- Ensure port is not hardcoded to 3000 (use process.env.PORT)

### Frontend shows blank page
- Check build output for errors
- Verify API URL is correct
- Check browser console for CORS errors
- Ensure API is accessible from frontend domain

### API calls failing
- Verify CORS is configured
- Check authentication token is being sent
- Confirm backend is running
- Check network tab in DevTools

## Next Steps

1. Set up monitoring and logging
2. Implement auto-scaling if needed
3. Add CDN for static assets (Cloudflare)
4. Set up automated backups
5. Configure email notifications for errors
6. Monitor costs and usage
