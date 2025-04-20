// ==UserScript==
// @name        Google Web Parameter Search
// @namespace   ViolentMonkey Scripts
// @match       *://www.google.com/search*
// @grant       none
// @version     1.0
// @author      -
// @icon        https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw
// @description Automatically adds udm=14 and num=50 parameters to Google web searches to show 50 results per page, but respects "All" search view
// ==/UserScript==

/*
 * This script automatically modifies Google search URLs to:
 * 1. Always show web search results (using udm=14 parameter)
 * 2. Show 50 results per page instead of the default 10 (using num=50 parameter)
 *
 * IMPORTANT: You can still manually click on other search categories!
 * - If you click on "All", the script will detect this and NOT redirect you
 * - This allows you to use the "All" search view when you want to
 * - The same applies to Images, Videos, News, etc. - just click on those tabs
 *
 * The script runs automatically when you search from the Google homepage
 * or when you use the Chrome address bar with Google as your search engine.
 */

(() => {
    // Function to modify the URL
    function modifyGoogleSearchUrl() {
        // Get current URL
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;

        // Get the search query
        const query = searchParams.get('q');

        // Check if we're on a special search page ("All", Images, Videos, etc.)
        const isAllSearch = searchParams.has('source') && searchParams.get('source') === 'lnms';
        const isSpecialCategory = searchParams.has('tbm'); // tbm parameter indicates Images, Videos, News, etc.

        // If we're on a special search page, don't modify the URL
        if (isAllSearch || isSpecialCategory) {
            return;
        }

        // If there's no query or we're already on a properly formatted URL, do nothing
        if (!query || (searchParams.get('udm') === '14' && searchParams.get('num') === '50')) {
            return;
        }

        // Create new URL with the udm=14 and num=50 parameters
        const newUrl = new URL('https://www.google.com/search');
        newUrl.searchParams.set('udm', '14');
        newUrl.searchParams.set('num', '50');
        newUrl.searchParams.set('q', query);

        // Replace the current URL without reloading the page
        window.history.replaceState({}, '', newUrl.toString());

        // If the page hasn't loaded the correct results yet, reload it
        if (!document.querySelector('a[aria-current="page"][href*="udm=14"][href*="num=50"]')) {
            window.location.href = newUrl.toString();
        }
    }

    // Run when the page loads
    modifyGoogleSearchUrl();

    // Also run when URL changes without page reload (Google sometimes does this)
    const observer = new MutationObserver(() => {
        const url = window.location.href;
        const currentUrl = new URL(url);

        // Don't modify special search pages ("All", Images, Videos, etc.)
        const isAllSearch = currentUrl.searchParams.has('source') && currentUrl.searchParams.get('source') === 'lnms';
        const isSpecialCategory = currentUrl.searchParams.has('tbm'); // tbm parameter indicates Images, Videos, News, etc.

        if (isAllSearch || isSpecialCategory) {
            return;
        }

        if (url.includes('google.com/search') &&
            (!url.includes('udm=14') || !url.includes('num=50'))) {
            modifyGoogleSearchUrl();
        }
    });

    // Observe changes to the document
    observer.observe(document, { subtree: true, childList: true });

    // Also listen for history state changes
    window.addEventListener('popstate', () => {
        // The modifyGoogleSearchUrl function already has checks for special pages
        // so we can just call it directly
        modifyGoogleSearchUrl();
    });
})();
