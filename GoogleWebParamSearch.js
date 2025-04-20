// ==UserScript==
// @name        Google Web Parameter Search with Buttons
// @namespace   ViolentMonkey Scripts
// @match       *://www.google.com/search*
// @grant       none
// @version     1.0
// @author      -
// @icon        https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw
// @description Automatically adds udm=14 and num=50 parameters to Google web searches and adds custom search buttons
// @run-at      document-end
// ==/UserScript==

/*
 * This script automatically modifies Google search URLs to:
 * 1. Always show web search results (using udm=14 parameter)
 * 2. Show 50 results per page instead of the default 10 (using num=50 parameter)
 * 3. Adds custom search buttons for Reddit, StackOverflow, and GitHub
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
        // But make sure we preserve any existing parameters that might be needed by other scripts
        if (!document.querySelector('a[aria-current="page"][href*="udm=14"][href*="num=50"]')) {
            // Copy over any other parameters from the current URL
            for (const [key, value] of searchParams.entries()) {
                if (key !== 'q' && key !== 'udm' && key !== 'num') {
                    newUrl.searchParams.set(key, value);
                }
            }

            // Use replace instead of reload to minimize disruption
            window.location.replace(newUrl.toString());
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

    // Add custom search buttons
    window.addEventListener('load', () => {
        const mainBarElement = document.querySelector('.qogDvd');
        if (!mainBarElement) return; // Exit if the element doesn't exist

        // Create a container with spacing
        const spacerDiv = document.createElement('div');
        spacerDiv.style.marginTop = '15px'; // Add more spacing between top nav and buttons
        spacerDiv.style.marginBottom = '5px'; // Add spacing below the buttons too
        mainBarElement.parentNode.insertBefore(spacerDiv, mainBarElement.nextSibling);

        // Create the button bar
        const newBarElement = document.createElement('div');
        newBarElement.setAttribute('class', 'IUOThf');
        newBarElement.style.padding = '5px 0'; // Add vertical padding
        spacerDiv.appendChild(newBarElement);

        // Add CSS for hover effects
        const style = document.createElement('style');
        style.textContent = `
            .custom-search-button:hover {
                background-color: #f8f9fa;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
            }
        `;
        document.head.appendChild(style);

        const buttonNames = ['\"Reddit\"', 'StackOverflow', 'GitHub']; // Add button names here

        for (const buttonName of buttonNames) {
            const newButton = document.createElement('div');
            newButton.setAttribute('role', 'listitem');
            newButton.style.pointerEvents = 'auto';
            newButton.style.margin = '0 5px'; // Add spacing between buttons

            const link = document.createElement('a');
            const currentQuery = document.querySelector('input[name="q"]').value;
            link.setAttribute('href', `/search?q=${encodeURIComponent(`${currentQuery} ${buttonName}`)}`);
            link.setAttribute('aria-label', `Add ${buttonName}`);
            link.setAttribute('class', 'nPDzT T3FoJb');
            link.setAttribute('jsname', 'VIftV');
            link.setAttribute('role', 'link');

            const div = document.createElement('div');
            div.setAttribute('jsname', 'bVqjv');
            div.setAttribute('class', 'GKS7s custom-search-button');
            div.style.border = '1px solid #dadce0'; // Add a light border
            div.style.borderRadius = '20px'; // Rounded corners
            div.style.padding = '0 12px'; // Add horizontal padding
            div.style.transition = 'all 0.2s ease'; // Smooth transition for hover effects

            const span = document.createElement('span');
            span.setAttribute('class', 'FMKtTb UqcIvb');
            span.setAttribute('jsname', 'pIvPIe');
            span.textContent = buttonName;
            span.style.fontWeight = 'bold'; // Make text bold
            span.style.color = '#1a73e8'; // Google blue color

            div.appendChild(span);
            link.appendChild(div);
            newButton.appendChild(link);

            newBarElement.appendChild(newButton);
        }
    });
})();
