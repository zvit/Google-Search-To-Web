// ==UserScript==
// @name        Google Web Parameter Search with Buttons
// @namespace   ViolentMonkey Scripts
// @match       *://www.google.com/search*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.3
// @author      -
// @icon        https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw
// @description Automatically adds udm=14 and configurable num parameter to Google web searches and adds custom search buttons
// @run-at      document-end
// ==/UserScript==

/*
 * This script automatically modifies Google search URLs to:
 * 1. Always show web search results (using udm=14 parameter)
 * 2. Show configurable number of results per page (default 50) instead of Google's default 10
 * 3. Adds custom search buttons for Reddit, StackOverflow, and GitHub
 *
 * FEATURES:
 * - Press Shift+S to open settings panel to configure number of results per page
 * - Settings are stored across sessions
 * - Google Images search is not affected by the num parameter
 *
 * IMPORTANT: The script will NOT redirect if:
 * - The URL already has any UDM parameter (used by Google for different search tabs)
 * - You're on a special search page (Images, Videos, News, etc.)
 * - You're on the "All" search tab
 * - You came from a page with a UDM parameter (fixes tab navigation issues)
 *
 * FIXED IN v1.3:
 * - Added configurable number of results per page via settings panel (Shift+S)
 * - Excluded Google Images from number of results modification
 * - Added persistent storage of user preferences
 *
 * FIXED IN v1.2:
 * - Fixed issue with redirecting back to Web results when clicking on tabs like Images, Videos, etc.
 * - Added referrer checking to prevent unwanted redirects when navigating between tabs
 * - Improved detection of special search pages using UDM parameters
 *
 * The script runs automatically when you search from the Google homepage
 * or when you use the Chrome address bar with Google as your search engine.
 */

(() => {
    // Simple logging function
    function log(message) {
        console.log(`[GoogleWebParamSearch] ${message}`);
    }
    
    // Default settings
    const DEFAULT_RESULTS_PER_PAGE = 50;
    
    // Get stored results per page or use default
    function getResultsPerPage() {
        return GM_getValue('resultsPerPage', DEFAULT_RESULTS_PER_PAGE);
    }

    // Function to check if a URL has any UDM parameter
    function hasUdmParameter(url) {
        return url.searchParams.has('udm');
    }

    // Function to check if the referrer has a UDM parameter
    function hasUdmInReferrer() {
        try {
            if (document.referrer) {
                const referrerUrl = new URL(document.referrer);
                return referrerUrl.searchParams.has('udm');
            }
        } catch (e) {
            // If there's an error parsing the referrer, just return false
            log(`Error checking referrer: ${e.message}`);
        }
        return false;
    }

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
        
        // Check specifically for Google Images (tbm=isch)
        const isGoogleImages = searchParams.has('tbm') && searchParams.get('tbm') === 'isch';

        // Check if the URL already has any UDM parameter
        const hasUdm = hasUdmParameter(currentUrl);

        // Check if we came from a page with a UDM parameter
        const fromUdmPage = hasUdmInReferrer();

        // If we're on a special search page, the URL has a UDM parameter (other than 14),
        // or we came from a page with a UDM parameter, don't modify the URL
        if (isAllSearch || isSpecialCategory || (hasUdm && searchParams.get('udm') !== '14') || fromUdmPage) {
            log(`Not modifying URL - Special page: ${isAllSearch || isSpecialCategory}, Has UDM: ${hasUdm}, From UDM page: ${fromUdmPage}`);
            return;
        }

        // Get stored results per page value
        const resultsPerPage = getResultsPerPage().toString();
        
        // If there's no query or we're already on a properly formatted URL, do nothing
        if (!query || (searchParams.get('udm') === '14' && 
                     (!isGoogleImages && searchParams.get('num') === resultsPerPage))) {
            return;
        }

        // Create new URL with the udm=14 parameter
        const newUrl = new URL('https://www.google.com/search');
        newUrl.searchParams.set('udm', '14');
        
        // Only set num parameter if not on Google Images
        if (!isGoogleImages) {
            newUrl.searchParams.set('num', resultsPerPage);
        }
        
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
        
        // Check specifically for Google Images (tbm=isch)
        const isGoogleImages = currentUrl.searchParams.has('tbm') && currentUrl.searchParams.get('tbm') === 'isch';

        // Check if the URL already has any UDM parameter
        const hasUdm = hasUdmParameter(currentUrl);

        // Check if we came from a page with a UDM parameter
        const fromUdmPage = hasUdmInReferrer();

        // If we're on a special search page, the URL has a UDM parameter (other than 14),
        // or we came from a page with a UDM parameter, don't modify the URL
        if (isAllSearch || isSpecialCategory || (hasUdm && currentUrl.searchParams.get('udm') !== '14') || fromUdmPage) {
            log(`Observer: Not modifying - Special page: ${isAllSearch || isSpecialCategory}, Has UDM: ${hasUdm}, From UDM page: ${fromUdmPage}`);
            return;
        }
        
        // Get current results per page setting
        const resultsPerPage = getResultsPerPage().toString();

        if (url.includes('google.com/search') &&
            (!url.includes('udm=14') || 
            (!isGoogleImages && !url.includes(`num=${resultsPerPage}`)))) {
            log('Observer: Modifying URL to add parameters');
            modifyGoogleSearchUrl();
        }
    });

    // Observe changes to the document
    observer.observe(document, { subtree: true, childList: true });

    // Also listen for history state changes
    window.addEventListener('popstate', () => {
        // Check if we're on a special page or have a UDM parameter
        const currentUrl = new URL(window.location.href);
        const isAllSearch = currentUrl.searchParams.has('source') && currentUrl.searchParams.get('source') === 'lnms';
        const isSpecialCategory = currentUrl.searchParams.has('tbm');
        
        // Check specifically for Google Images (tbm=isch)
        const isGoogleImages = currentUrl.searchParams.has('tbm') && currentUrl.searchParams.get('tbm') === 'isch';
        
        const hasUdm = hasUdmParameter(currentUrl);

        // Check if we came from a page with a UDM parameter
        const fromUdmPage = hasUdmInReferrer();

        // If we're on a special search page, the URL has a UDM parameter (other than 14),
        // or we came from a page with a UDM parameter, don't modify the URL
        if (isAllSearch || isSpecialCategory || (hasUdm && currentUrl.searchParams.get('udm') !== '14') || fromUdmPage) {
            log(`Popstate: Not modifying - Special page: ${isAllSearch || isSpecialCategory}, Has UDM: ${hasUdm}, From UDM page: ${fromUdmPage}`);
            return;
        }

        log('Popstate: Modifying URL');
        modifyGoogleSearchUrl();
    });

    // Create settings panel
    function createSettingsPanel() {
        // Check if panel already exists
        if (document.getElementById('googleSearchSettingsPanel')) {
            return;
        }
        
        // Create panel elements
        const panel = document.createElement('div');
        panel.id = 'googleSearchSettingsPanel';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = '#fff';
        panel.style.padding = '20px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        panel.style.zIndex = '9999';
        panel.style.minWidth = '300px';
        panel.style.maxWidth = '400px';
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = 'Google Search Settings';
        title.style.margin = '0 0 15px 0';
        title.style.fontSize = '18px';
        title.style.fontFamily = 'Arial, sans-serif';
        title.style.color = '#1a73e8';
        panel.appendChild(title);
        
        // Create settings form
        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '15px';
        panel.appendChild(form);
        
        // Results per page setting
        const resultsSetting = document.createElement('div');
        resultsSetting.style.display = 'flex';
        resultsSetting.style.flexDirection = 'column';
        resultsSetting.style.gap = '5px';
        
        const resultsLabel = document.createElement('label');
        resultsLabel.textContent = 'Results per page:';
        resultsLabel.style.fontFamily = 'Arial, sans-serif';
        resultsLabel.style.fontSize = '14px';
        resultsLabel.htmlFor = 'resultsPerPage';
        resultsSetting.appendChild(resultsLabel);
        
        const resultsInput = document.createElement('input');
        resultsInput.type = 'number';
        resultsInput.id = 'resultsPerPage';
        resultsInput.min = '10';
        resultsInput.max = '100';
        resultsInput.step = '10';
        resultsInput.value = getResultsPerPage().toString();
        resultsInput.style.padding = '8px';
        resultsInput.style.borderRadius = '4px';
        resultsInput.style.border = '1px solid #dadce0';
        resultsSetting.appendChild(resultsInput);
        
        form.appendChild(resultsSetting);
        
        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'flex-end';
        buttonsContainer.style.gap = '10px';
        buttonsContainer.style.marginTop = '10px';
        form.appendChild(buttonsContainer);
        
        // Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.border = '1px solid #dadce0';
        cancelButton.style.backgroundColor = '#f8f9fa';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontFamily = 'Arial, sans-serif';
        cancelButton.style.fontSize = '14px';
        cancelButton.onclick = () => {
            document.body.removeChild(panel);
        };
        buttonsContainer.appendChild(cancelButton);
        
        // Save button
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.textContent = 'Save';
        saveButton.style.padding = '8px 16px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.border = 'none';
        saveButton.style.backgroundColor = '#1a73e8';
        saveButton.style.color = '#fff';
        saveButton.style.cursor = 'pointer';
        saveButton.style.fontFamily = 'Arial, sans-serif';
        saveButton.style.fontSize = '14px';
        saveButton.onclick = () => {
            const resultsValue = parseInt(resultsInput.value, 10);
            if (resultsValue >= 10 && resultsValue <= 100) {
                GM_setValue('resultsPerPage', resultsValue);
                document.body.removeChild(panel);
                // Reload the page to apply new settings
                if (window.location.href.includes('google.com/search')) {
                    modifyGoogleSearchUrl();
                }
            }
        };
        buttonsContainer.appendChild(saveButton);
        
        // Add panel to body
        document.body.appendChild(panel);
    }
    
    // Add keyboard shortcut listener
    document.addEventListener('keydown', (e) => {
        // Shift+S to open settings
        if (e.key === 'S' && e.shiftKey && !e.ctrlKey && !e.altKey) {
            createSettingsPanel();
        }
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
