# Japan Region Deployment Guide

This project is configured for optimal performance in Japan.

## Deployment Options

### 1. Vercel (Recommended for Japan)
The `vercel.json` file is configured for Tokyo region (nrt1).

**Deploy:**
```bash
vercel --prod
```

**Or connect via Vercel Dashboard:**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will automatically detect `vercel.json`
4. Region will be set to Tokyo (nrt1) automatically

### 2. Netlify
The `netlify.toml` file is configured for Asia-Pacific region.

**Deploy:**
```bash
netlify deploy --prod
```

**Set region in Netlify Dashboard:**
1. Go to Site settings
2. Build & deploy > Build settings
3. Set region to "Asia-Pacific (Tokyo)"

### 3. Cloudflare Pages
The `cloudflare.json` file is configured for Japan region.

**Deploy:**
1. Go to Cloudflare Dashboard
2. Workers & Pages > Create application > Pages
3. Connect Git repository
4. Build settings: Output directory: `dist`
5. Custom domain: Point to Japan region

### 4. GitHub Pages (Current)
Already configured in `.github/workflows/main.yml`

- GitHub Pages uses a global CDN
- Will automatically route to nearest edge location
- Good for global deployment, including Japan

## Performance Optimization

- **Language**: Default set to Japanese (`lang="ja"`)
- **Region**: Configured for Japan (Tokyo region)
- **Caching**: Aggressive caching headers for static assets
- **CDN**: All platforms use edge CDN for fast delivery

## Custom Domain (Optional)

For Japan-specific domain:
1. Update `CNAME` file with your domain
2. Add DNS records pointing to chosen platform
3. Configure SSL certificate

## Testing

To test Japan region deployment:
```bash
# Test local build
npm run build
npm run preview

# Test on Vercel
vercel dev

# Test on Netlify
netlify dev
```

## Monitoring

Monitor performance from Japan:
- Use tools like WebPageTest (Tokyo location)
- Check Google PageSpeed Insights
- Monitor Core Web Vitals from Japan users
