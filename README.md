# Google Web Parameter Search v1.4

A ViolentMonkey userscript that enhances Google search by automatically adding parameters for better results and providing convenient buttons for site-specific searches.

![Google Logo](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

## Features

- **Enhanced Web Results**: Automatically adds `udm=14` parameter to force Google to show the dedicated "Web" tab results instead of the default mixed "All" results that are cluttered with AI summaries, ads, videos, "People also ask" boxes, and other distractions
- **Configurable Results Per Page**: Allows setting the number of results per page (default 50) via a settings panel accessible with Shift+S
- **Custom Search Buttons**: Adds convenient buttons for searching Reddit, StackOverflow, and GitHub with your current query
- **Respects User Choices**: Detects when you click on special categories like "All", "Images", or "Videos" and won't override your selection
- **Seamless Experience**: Works automatically with both Google homepage searches and address bar searches

## How It Works

This script runs on Google search pages and modifies the URL to include helpful parameters:

1. When you search on Google, it automatically redirects to the dedicated "Web" tab results with a configurable number of results per page (default 50), bypassing the cluttered default view filled with AI summaries, ads, and distractions
2. If you manually click on "All", "Images", "Videos", or other tabs, the script detects this and respects your choice
3. The script adds convenient buttons below the search tabs for quickly searching your query on Reddit, StackOverflow, and GitHub (with proper spacing from the top navigation)
4. The script works in the background without requiring any user interaction

## Installation

1. Install a userscript manager like [ViolentMonkey](https://violentmonkey.github.io/), [Tampermonkey](https://www.tampermonkey.net/), or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
2. Open the [GoogleWebParamSearch.js](GoogleWebParamSearch.js) file in this repository
3. Use the script in your userscript manager to install it

## Why Use This Script?

### The Problem with Google's Default Results

Google's default search experience (the "All" tab) has become increasingly cluttered and less useful:

- Only about a third of the results are actual relevant web pages
- Large portions of the page are taken up by AI-generated summaries
- "People also ask" boxes consume significant screen space
- Ads, videos, image carousels, and other elements push down web results
- Related searches and other suggestions distract from what you actually searched for
- The result is a chaotic mix that makes it harder to find the specific information you need

### How This Script Helps

- **Clean, Focused Results**: Forces Google to show primarily web page results without the extra clutter
- **Save Time**: See 50 results at once instead of just 10, reducing the need to click through multiple pages
- **Quick Site-Specific Searches**: Easily search your query on Reddit, StackOverflow, or GitHub with just one click
- **More Relevant Content**: The dedicated "Web" tab provides more focused and relevant information
- **Flexibility**: Still allows you to manually switch to "All", Images, Videos, or other tabs when needed
- **No Configuration Needed**: Works automatically after installation

## Settings Panel

The script includes a settings panel that can be accessed by pressing **Shift+S** anywhere on a Google search page:

- **Results Per Page**: Customize how many search results appear on each page (between 10-100)
- The setting is saved between sessions and automatically applied to new searches
- Google Images searches will not be affected by the results per page setting

## Custom Search Buttons

The script adds stylish, easy-to-use buttons below the Google search tabs that allow you to quickly search your current query on popular websites:

![Custom Search Buttons Screenshot](https://i.imgur.com/YrP24hQ.png)

- **Reddit**: Search for discussions and community insights about your topic
- **StackOverflow**: Find programming solutions and technical answers
- **GitHub**: Discover relevant code repositories and projects

These buttons maintain proper spacing from the navigation bar and provide visual feedback when hovered, making them both functional and visually appealing.

## Compatibility

- Works with Chrome, Firefox, Edge, and other browsers that support ViolentMonkey
- Compatible with Google search in all regions and languages

## Privacy

This script:

- Only runs on Google search pages
- Does not collect any data
- Does not communicate with any external servers
- Only modifies the URL parameters locally in your browser

## License

MIT License - feel free to modify and share!

---

*Note: This script is not affiliated with Google. Google and the Google logo are trademarks of Google LLC.*
