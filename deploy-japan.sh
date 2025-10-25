#!/bin/bash

echo "🚀 Japan Region Deployment Helper"
echo "=================================="
echo ""
echo "Choose your deployment platform:"
echo "1. Vercel (Tokyo region - Recommended)"
echo "2. Netlify (Asia-Pacific region)"
echo "3. Cloudflare Pages (Japan region)"
echo "4. GitHub Pages (Already configured)"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo ""
    echo "🔗 Connecting to Vercel..."
    vercel login
    echo ""
    echo "🚀 Deploying to Tokyo region (nrt1)..."
    vercel --prod
    ;;
  2)
    echo ""
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo ""
    echo "🔗 Connecting to Netlify..."
    netlify login
    echo ""
    echo "🚀 Deploying to Asia-Pacific region..."
    netlify deploy --prod
    ;;
  3)
    echo ""
    echo "📋 Cloudflare Pages setup:"
    echo "1. Go to https://dash.cloudflare.com"
    echo "2. Workers & Pages > Create application > Pages"
    echo "3. Connect your GitHub repository"
    echo "4. Build settings: Output directory = 'dist'"
    echo "5. Deploy!"
    ;;
  4)
    echo ""
    echo "📋 GitHub Pages is already configured!"
    echo ""
    echo "Current workflow: .github/workflows/main.yml"
    echo "Region: Auto (nearest CDN edge to users)"
    echo ""
    echo "To deploy:"
    echo "1. Push your code to GitHub"
    echo "2. Go to repository Settings > Pages"
    echo "3. Select 'GitHub Actions' as source"
    echo "4. Your site will auto-deploy on push!"
    ;;
  *)
    echo "Invalid choice!"
    exit 1
    ;;
esac

echo ""
echo "✅ Done!"
echo ""
echo "🌏 Your site will be optimized for Japan region!"
