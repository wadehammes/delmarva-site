# Production 500 Error Debugging Guide

## 🚨 Issue: 500 Internal Server Error in Production

### ✅ Fixes Applied

1. **Removed Turbopack Configuration**: Turbopack is primarily for development and can cause production issues
2. **Conservative Caching**: Changed from aggressive 1-year caching to 1-hour caching with stale-while-revalidate
3. **Error Handling**: Added try-catch blocks to headers and redirects functions
4. **Simplified Webpack Configuration**: Removed aggressive code splitting and complex SVG optimization
5. **Clean Configuration**: Removed experimental features that could cause instability

### 🔍 Debugging Steps

#### 1. Check Vercel Logs
```bash
# View deployment logs
vercel logs --follow

# Check function logs
vercel logs --function=index
```

#### 2. Environment Variables
Ensure all required environment variables are set in Vercel:
- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_CONTENT_DELIVERY_API_KEY`
- `CONTENTFUL_PREVIEW_API_KEY`
- `CONTENTFUL_PREVIEW_SECRET`
- `CONTENTFUL_CMA_TOKEN`
- `ENVIRONMENT`
- `GA_MEASUREMENT_ID`
- `GOOGLE_TAG_MANAGER_ID`

#### 3. Test Locally
```bash
# Test production build locally
pnpm run build
pnpm run start

# Test with production environment
NODE_ENV=production pnpm run start
```

#### 4. Check Contentful Connection
Verify Contentful API is accessible and returning data:
```bash
# Test Contentful connection
curl "https://cdn.contentful.com/spaces/YOUR_SPACE_ID/entries?access_token=YOUR_TOKEN"
```

### 🛠️ Common Causes & Solutions

#### 1. Missing Environment Variables
**Symptoms**: 500 error on all pages
**Solution**: Add missing environment variables in Vercel dashboard

#### 2. Contentful API Issues
**Symptoms**: 500 error on pages with Contentful data
**Solution**: 
- Check Contentful API limits
- Verify API keys are correct
- Check Contentful service status

#### 3. Build Issues
**Symptoms**: 500 error after deployment
**Solution**:
- Check build logs in Vercel
- Verify all dependencies are installed
- Check for TypeScript errors

#### 4. Memory Issues
**Symptoms**: Intermittent 500 errors
**Solution**:
- Increase Vercel function memory limit
- Optimize bundle size
- Add error boundaries

### 📊 Monitoring

#### 1. Add Error Monitoring
```typescript
// Add to your app for better error tracking
if (process.env.NODE_ENV === 'production') {
  // Add Sentry, LogRocket, or similar
}
```

#### 2. Health Check Endpoint
```typescript
// Add to api/health/route.ts
export async function GET() {
  try {
    // Test critical services
    return Response.json({ status: 'healthy' });
  } catch (error) {
    return Response.json({ status: 'unhealthy', error: error.message }, { status: 500 });
  }
}
```

### 🔧 Configuration Changes Made

#### Before (Problematic)
```typescript
// Aggressive caching
"public, max-age=31536000, immutable"

// Turbopack in production
turbopack: { rules: { ... } }

// No error handling
async headers() { return [...]; }
```

#### After (Fixed)
```typescript
// Conservative caching
"public, max-age=3600, stale-while-revalidate=86400"

// Removed Turbopack
// No turbopack configuration

// With error handling
async headers() {
  try {
    return [...];
  } catch (error) {
    console.error("Error in headers:", error);
    return [];
  }
}
```

### 🚀 Next Steps

1. **Deploy the fixed configuration**
2. **Monitor logs for any remaining errors**
3. **Test all critical pages**
4. **Set up proper error monitoring**
5. **Add health check endpoints**

### 📞 If Issues Persist

1. Check Vercel status page
2. Review Contentful API usage
3. Test with minimal configuration
4. Contact Vercel support if needed

### 🎯 Expected Outcome

After applying these fixes:
- ✅ 500 errors should be resolved
- ✅ Better error handling and logging
- ✅ More stable caching strategy
- ✅ Cleaner, production-ready configuration 