# iPhone Fix Guide for Google Web Parameter Search Script

## Problem
The script doesn't work on iPhone with Safari + Userscripts extension. Google search results stick to "All" tab instead of switching to "Web" tab.

## Root Cause
The script runs too late (`@run-at document-end`). On mobile Safari, Google's page finishes rendering before the script can modify the URL, so the redirect never happens.

---

## Required Changes

### 1. Change Script Run Timing ⚠️ CRITICAL FIX

**Location:** Line 6 in the metadata block

**Change from:**
```javascript
// @run-at      document-end
```

**Change to:**
```javascript
// @run-at      document-start
```

**Why:** This makes the script run earlier, before Google's JavaScript finishes rendering the page, giving it time to modify the URL.

---

### 2. Add Mobile Detection and Aggressive URL Modification

**Location:** After the `log` function definition (around line 36)

**Add this code:**
```javascript
// Detect mobile devices
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
```

**Location:** Replace the first `modifyGoogleSearchUrl()` call (around line 170)

**Change from:**
```javascript
// Run when the page loads
modifyGoogleSearchUrl();
```

**Change to:**
```javascript
// Run when the page loads
if (isMobile) {
    // Run immediately on mobile
    modifyGoogleSearchUrl();
    // Run again after short delays to catch late-loading elements
    setTimeout(modifyGoogleSearchUrl, 100);
    setTimeout(modifyGoogleSearchUrl, 500);
} else {
    modifyGoogleSearchUrl();
}
```

**Why:** Mobile browsers sometimes need multiple attempts to catch the URL at the right moment.

---

### 3. Add Visible Settings Button for Mobile (Optional but Recommended)

**Location:** Inside the `window.addEventListener('load', ...)` block, after the custom search buttons code (around line 320)

**Add this code at the end of the load event listener:**
```javascript
// Add settings button for mobile (since Shift+S doesn't work well)
if (isMobile) {
    const settingsButton = document.createElement('button');
    settingsButton.textContent = '⚙️';
    settingsButton.style.position = 'fixed';
    settingsButton.style.bottom = '20px';
    settingsButton.style.right = '20px';
    settingsButton.style.zIndex = '9999';
    settingsButton.style.padding = '12px';
    settingsButton.style.borderRadius = '50%';
    settingsButton.style.border = 'none';
    settingsButton.style.backgroundColor = '#1a73e8';
    settingsButton.style.color = 'white';
    settingsButton.style.fontSize = '20px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    settingsButton.onclick = createSettingsPanel;
    document.body.appendChild(settingsButton);
}
```

**Why:** The keyboard shortcut Shift+S doesn't work well on mobile keyboards, so mobile users need a button to access settings.

---

### 4. Update Script Version

**Location:** Line 7 in the metadata block

**Change from:**
```javascript
// @version     1.4
```

**Change to:**
```javascript
// @version     1.5
```

---

## Testing Checklist

After making these changes, test on iPhone:

- [ ] Script modifies URL to include `udm=14` on search
- [ ] Results per page setting works (default 50)
- [ ] Can navigate to Images/Videos tabs without being redirected back
- [ ] Settings button appears (gear icon in bottom right)
- [ ] Settings panel opens and saves preferences
- [ ] Custom search buttons (Reddit, StackOverflow, GitHub) appear and work

---

## Known Limitations on Mobile

1. **Keyboard shortcut (Shift+S)** - Doesn't work reliably on mobile keyboards. Use the settings button instead.
2. **Performance** - The MutationObserver may use more battery on mobile. This is acceptable for the functionality it provides.
3. **Browser support** - Only tested with Safari + Userscripts extension. May work with other iOS browsers that support userscripts (like Orion).

---

## Troubleshooting

**If it still doesn't work after these changes:**

1. **Clear Safari cache** - Old page data might interfere
2. **Check Userscripts extension is enabled** for google.com
3. **Try disabling other userscripts** temporarily to check for conflicts
4. **Check Console for errors** - Safari Developer tools can connect to iPhone
5. **Verify the script match pattern** - Make sure `*://www.google.com/search*` matches your region's Google domain

**If using a different Google domain (e.g., google.co.uk):**

Add this line to the metadata block:
```javascript
// @match       *://*.google.*/search*
```

This will match all Google domains.

---

## Why These Changes Don't Affect Desktop

All changes are safe for desktop use:
- `document-start` works on both mobile and desktop
- Mobile detection only adds extra runs for mobile devices
- The settings button only appears on mobile devices
- Desktop functionality remains unchanged