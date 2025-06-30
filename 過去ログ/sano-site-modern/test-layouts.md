# Layout Testing Summary

## Implementation Complete

I have successfully implemented different header and footer layouts for different pages as requested:

### 1. Index Page (Homepage)
- **Header**: Displays "佐野徹夜" prominently at the top
- **Footer**: Only SNS icons, centered
- **Implementation**: `showHeaderTitle={true}` and `footerLayout="homepage"`

### 2. Other Pages (about, works, news, etc.)
- **Header**: Does NOT display "佐野徹夜"
- **Footer**: Has "佐野徹夜" on the left side with SNS icons and copyright on the right
- **Implementation**: Default values (`showHeaderTitle={false}` and `footerLayout="default"`)

### Changes Made:

1. **Layout Component** (`/src/components/Layout.tsx`):
   - Added `footerLayout` prop with type `'default' | 'homepage'`
   - Changed default `showHeaderTitle` to `false`
   - Passes layout prop to Footer component

2. **Header Component** (`/src/components/Header.tsx`):
   - Added `Title` styled component for displaying "佐野徹夜"
   - Added `showTitle` prop to conditionally render the title
   - Title appears above the navigation when `showTitle={true}`

3. **Footer Component** (`/src/components/Footer.tsx`):
   - Added `layout` prop to support different footer layouts
   - Created `HomepageFooterContent` styled component for homepage layout
   - Homepage layout: Only centered SNS icons
   - Default layout: Name on left, SNS icons and copyright on right

4. **Page Updates**:
   - Homepage (`/src/app/page.tsx`): Uses `showHeaderTitle={true}` and `footerLayout="homepage"`
   - All other pages: Use default Layout (no props needed)

### To Verify:
1. Visit http://localhost:3001 - Homepage should show "佐野徹夜" in header and only SNS icons in footer
2. Visit http://localhost:3001/about - Should NOT show "佐野徹夜" in header, footer should have full layout
3. Visit http://localhost:3001/works - Same as about page
4. Visit http://localhost:3001/news - Same as about page

The implementation follows the exact requirements and maintains consistency across all pages.