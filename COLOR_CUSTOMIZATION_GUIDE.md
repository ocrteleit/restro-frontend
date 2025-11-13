# 🎨 Color Customization Guide

## How to Change Colors Across Your Entire Restaurant App

All colors are defined in **ONE FILE**: `app/globals.css`

### 📍 Location

Open: `app/globals.css` (lines 12-18)

---

## 🎨 Main Brand Colors (Change These!)

```css
:root {
  /* === BRAND COLORS (Change these for your restaurant) === */
  --brand-primary: #d97706; /* 🟠 Warm Orange - Main brand color */
  --brand-primary-dark: #b45309; /* Darker orange for hover states */
  --brand-primary-light: #fcd34d; /* Light amber for accents */
  --brand-secondary: #059669; /* 🟢 Fresh Green - Secondary actions */
  --brand-accent: #dc2626; /* 🔴 Red - Important/Delete actions */
}
```

### 🔄 To Change Your Brand Colors:

**Option 1: Edit the CSS File Directly**

1. Open `app/globals.css`
2. Find lines 14-18 (the BRAND COLORS section)
3. Replace the hex codes with your colors
4. Save the file
5. Refresh your browser - **ALL pages update instantly!**

**Example: Change to Blue Theme**

```css
:root {
  --brand-primary: #2563eb; /* Blue */
  --brand-primary-dark: #1d4ed8; /* Dark Blue */
  --brand-primary-light: #93c5fd; /* Light Blue */
  --brand-secondary: #10b981; /* Emerald Green */
  --brand-accent: #ef4444; /* Red */
}
```

**Example: Change to Purple Theme**

```css
:root {
  --brand-primary: #9333ea; /* Purple */
  --brand-primary-dark: #7e22ce; /* Dark Purple */
  --brand-primary-light: #c084fc; /* Light Purple */
  --brand-secondary: #f59e0b; /* Amber */
  --brand-accent: #dc2626; /* Red */
}
```

**Example: Change to Red/Pizza Theme**

```css
:root {
  --brand-primary: #dc2626; /* Red */
  --brand-primary-dark: #b91c1c; /* Dark Red */
  --brand-primary-light: #fca5a5; /* Light Red */
  --brand-secondary: #16a34a; /* Green */
  --brand-accent: #f59e0b; /* Amber */
}
```

---

## 🎯 Where These Colors Are Used

Your brand colors automatically apply to:

### Admin Panel

- ✅ Buttons (Accept, Confirm, Primary actions)
- ✅ Sidebar highlights
- ✅ Navigation active states
- ✅ Charts and graphs
- ✅ Status indicators
- ✅ Form focus states

### Restaurant Pages

- ✅ Menu buttons
- ✅ Add to cart buttons
- ✅ Navigation
- ✅ Price highlights
- ✅ Category badges
- ✅ Interactive elements

### Both Admin & Restaurant

- ✅ All buttons using `bg-primary`
- ✅ All links using `text-primary`
- ✅ All borders using `border-primary`
- ✅ All hover effects

---

## 📊 Complete Color System

### Status Colors (Order Management)

```css
--status-pending: #f59e0b; /* 🟡 Yellow - Pending orders */
--status-confirmed: #3b82f6; /* 🔵 Blue - Confirmed */
--status-preparing: #8b5cf6; /* 🟣 Purple - Being prepared */
--status-ready: #10b981; /* 🟢 Green - Ready to serve */
--status-completed: #059669; /* ✅ Dark Green - Completed */
--status-cancelled: #ef4444; /* 🔴 Red - Cancelled */
```

**To customize order status colors:**
Edit lines 75-80 in `app/globals.css`

### Chart Colors (Analytics)

```css
--chart-1: var(--brand-primary); /* Uses your primary color */
--chart-2: var(--brand-secondary); /* Uses your secondary color */
--chart-3: #3b82f6; /* Blue */
--chart-4: #8b5cf6; /* Purple */
--chart-5: #ec4899; /* Pink */
```

**To customize chart colors:**
Edit lines 83-87 in `app/globals.css`

---

## 🌓 Dark Mode Colors

Dark mode colors are automatically adjusted for better contrast!

**Location:** Lines 107-173 in `app/globals.css`

```css
.dark {
  --primary: #fb923c; /* Lighter orange for dark mode */
  /* All other colors automatically adjusted */
}
```

You usually don't need to change dark mode colors - they auto-adjust based on your brand colors!

---

## 💡 Using Colors in Your Code

### In JSX/Components

**Using Tailwind Classes:**

```jsx
// Primary color
<button className="bg-primary text-primary-foreground">Button</button>

// Secondary color
<div className="bg-secondary text-secondary-foreground">Content</div>

// Success/Green
<span className="text-success">Success message</span>

// Destructive/Red
<button className="bg-destructive text-white">Delete</button>

// Status colors
<Badge className="bg-[var(--status-pending)]">Pending</Badge>
<Badge className="bg-[var(--status-ready)]">Ready</Badge>
```

**Using CSS Variables Directly:**

```jsx
<div style={{ backgroundColor: "var(--brand-primary)" }}>Custom element</div>
```

### In CSS Files

```css
.my-custom-class {
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: 2px solid var(--brand-primary);
}

.my-button:hover {
  background-color: var(--primary-hover);
}

.status-badge {
  background-color: var(--status-ready);
}
```

---

## 🎨 Color Picker Tool

To find the perfect colors for your restaurant:

1. **Visit:** [Coolors.co](https://coolors.co/) - Generate color palettes
2. **Visit:** [Adobe Color](https://color.adobe.com/) - Professional color wheel
3. **Visit:** [Material Design Colors](https://materialui.co/colors/) - Pre-made palettes

### Recommended Restaurant Color Schemes

**Italian Restaurant (Red & Green):**

```css
--brand-primary: #dc2626;
--brand-secondary: #16a34a;
```

**Asian Fusion (Red & Gold):**

```css
--brand-primary: #dc2626;
--brand-secondary: #f59e0b;
```

**Modern Café (Brown & Cream):**

```css
--brand-primary: #92400e;
--brand-secondary: #fcd34d;
```

**Seafood Restaurant (Blue & Teal):**

```css
--brand-primary: #0284c7;
--brand-secondary: #14b8a6;
```

**Vegan/Healthy (Green & Orange):**

```css
--brand-primary: #16a34a;
--brand-secondary: #f97316;
```

---

## 🚀 Quick Start: Change Your Brand Color in 3 Steps

### Step 1: Choose Your Color

Pick a hex color code (like `#FF6B6B`)

### Step 2: Open globals.css

```bash
Open: app/globals.css
```

### Step 3: Replace Line 14

```css
--brand-primary: #ff6b6b; /* Your new color! */
```

### Step 4: Save & Refresh

Save the file and refresh your browser - **DONE!** ✅

---

## 📝 Pro Tips

### 1. **Test Your Colors**

- Ensure good contrast for readability
- Test in both light and dark mode
- Check on mobile devices

### 2. **Keep It Consistent**

- Use your brand colors throughout
- Don't add too many custom colors
- Stick to the defined palette

### 3. **Accessibility**

- Ensure text is readable on backgrounds
- Use the built-in color system for automatic contrast
- Test with color blind simulators

### 4. **Brand Alignment**

- Match your restaurant's logo colors
- Consider your food type (warm colors for hot food, cool for fresh/cold)
- Think about emotional response (orange = appetite, green = healthy)

---

## 🔍 Where Each Color is Used

### `--brand-primary` (Main Color)

- All primary buttons
- Navigation highlights
- Links
- Focus states
- Active menu items
- "Add to Cart" buttons
- Sidebar active items

### `--brand-secondary` (Secondary Color)

- Success messages
- Confirmation dialogs
- Secondary buttons
- Accents and highlights

### `--brand-accent` (Alert Color)

- Delete buttons
- Cancel actions
- Error messages
- Important warnings

### `--status-*` Colors

- Order status badges
- Dashboard indicators
- Workflow states

---

## 🎯 Common Customization Tasks

### Change Button Color Everywhere

```css
/* Line 41 in globals.css */
--primary: var(--brand-primary);
```

Change `--brand-primary` value!

### Change Success/Confirmation Color

```css
/* Line 51 in globals.css */
--success: var(--brand-secondary);
```

Change `--brand-secondary` value!

### Change Delete/Cancel Button Color

```css
/* Line 56 in globals.css */
--destructive: var(--brand-accent);
```

Change `--brand-accent` value!

---

## 📱 Testing Your Colors

After changing colors:

1. ✅ Visit the homepage
2. ✅ Visit admin dashboard
3. ✅ Check order management page
4. ✅ Test menu pages
5. ✅ Try all buttons
6. ✅ Toggle dark mode
7. ✅ Check mobile view

---

## 🆘 Troubleshooting

### "My colors aren't changing!"

1. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check you saved `globals.css`
3. Make sure you edited the `:root` section (lines 12-104)
4. Not the `.dark` section (that's for dark mode)

### "Text is hard to read!"

The color might not have enough contrast. Try:

- Darker primary color
- Lighter backgrounds
- Use the color contrast checker: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### "Dark mode looks wrong!"

Edit the `.dark` section (lines 107-173) to adjust dark mode colors

---

## 📚 Additional Resources

- [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors)
- [Color Theory for Web Design](https://www.smashingmagazine.com/2016/04/web-developer-guide-color/)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✨ Summary

**One File Controls Everything:** `app/globals.css`

**Three Main Variables to Change:**

1. `--brand-primary` (main color)
2. `--brand-secondary` (secondary color)
3. `--brand-accent` (alert/danger color)

**Effect:** Changes apply to **all pages** instantly - admin, restaurant, mobile, desktop!

**Current Colors:**

- 🟠 Primary: Orange `#D97706`
- 🟢 Secondary: Green `#059669`
- 🔴 Accent: Red `#DC2626`

---

**Need Help?** Check `app/globals.css` lines 6-104 for all color definitions!

**Happy Customizing! 🎨**
