# Google Web Parameter Search

A ViolentMonkey userscript that enhances Google search by automatically adding parameters for better results.

![Google Logo](https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png)

## Features

- **Web Results Focus**: Automatically adds `udm=14` parameter to show web results
- **More Results Per Page**: Adds `num=50` parameter to display 50 results instead of the default 10
- **Respects User Choices**: Detects when you click on special categories like "All", "Images", or "Videos" and won't override your selection
- **Seamless Experience**: Works automatically with both Google homepage searches and address bar searches

## How It Works

This script runs on Google search pages and modifies the URL to include helpful parameters:

1. When you search on Google, it automatically redirects to web results with 50 results per page
2. If you manually click on "All", "Images", "Videos", or other tabs, the script detects this and respects your choice
3. The script works in the background without requiring any user interaction

## Installation

1. Make sure you have the [ViolentMonkey](https://violentmonkey.github.io/) extension installed
2. [Click here to install the script](https://github.com/YOUR-USERNAME/GoogleWebParamSearch/raw/main/GoogleWebParamSearch.js) (update this link with your actual GitHub raw file URL)
3. ViolentMonkey will prompt you to confirm the installation
4. Once installed, the script will automatically run on Google search pages

## Why Use This Script?

- **Save Time**: See more results at once without having to click through multiple pages
- **Better Results**: Web results often provide more relevant information than the "All" category
- **Flexibility**: Still allows you to use other search categories when needed
- **No Configuration Needed**: Works automatically after installation

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
