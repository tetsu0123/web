# Removing Debug Overlays

The blue display in the top-left and red icon in the bottom-left are Next.js development mode overlays. These are automatically shown when running the app with `npm run dev`.

## To Remove These Overlays:

### Option 1: Run in Production Mode (Recommended)
```bash
# Build the application
npm run build

# Start in production mode
npm start
```

### Option 2: Disable React Strict Mode (Not Recommended)
If you need to stay in development mode but want to reduce some warnings, you can disable React Strict Mode in `next.config.js`:

```javascript
const nextConfig = {
  reactStrictMode: false, // Change from true to false
  // ... rest of config
}
```

### Option 3: Hide Error Overlay with CSS (Development Only)
Add this to your global CSS to hide the Next.js error overlay:

```css
/* Hide Next.js error overlay - USE ONLY FOR SCREENSHOTS/DEMOS */
#__next-build-error-dialog,
[data-nextjs-dialog-overlay],
[data-nextjs-errors-dialog-overlay],
[data-nextjs-terminal],
[data-nextjs-toast] {
  display: none !important;
}
```

### Option 4: Check for Actual Errors
The overlays might be showing because there are actual errors or warnings in your code:

1. Check the browser console for any errors
2. Check the terminal where you're running `npm run dev` for build errors
3. Fix any TypeScript or ESLint errors

## Important Notes:
- These overlays are helpful during development to catch errors early
- They will NOT appear in production builds
- The recommended approach is to build and run in production mode when you want to see the site without debug tools