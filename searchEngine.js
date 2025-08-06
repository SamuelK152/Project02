// ==============
// === Config ===
// ==============
const apiKey = "mgMtRKqOssbqEmUBEyMMD3uuJf2UGuTy";

let menuVisible = null;
let searchBarPos = "body";

let cachedCategories = false;
let categoriesVisible = false;

let cachedFeatured = null;
let featuredVisible = null;

let lastView = null;

// ====================
// === DOM Elements ===
// ====================
const giphyLogo = document.getElementById("js-logo");
const backButton = document.getElementById("js-back-button");
const categoryContainer = document.getElementById("js-category-container");
const categoriesButton = document.getElementById("js-categories-button");
const menuCategoriesButton = document.getElementById("js-menu-categories-button");
const featuredButton = document.getElementById('js-featured-button');
const menuFeaturedButton = document.getElementById("js-menu-featured-button");
const menuButton = document.getElementById("js-menu-button");
const menuButtons = document.getElementById("js-menu-buttons")
const headerButtons = document.getElementById("js-header-buttons");
const mediaQuery620 = window.matchMedia('(max-width:620px)');
const headerSearchContainer = document.getElementById("js-header-search-container")
const searchContainer = document.getElementById("js-search-container")
const searchButton = document.getElementById("js-search-button");
const menuSearchButton = document.getElementById("js-header-search-button");
const menuSearchBar = document.getElementById("js-header-search-bar")
const searchBar = document.getElementById("js-search-bar");
const resultsContainer = document.getElementById("js-results");
const focusContainer = document.getElementById("js-focus-container");
const gifDetails = document.getElementById("js-gifDetails")

// =========================
// === Utility Functions ===
// =========================
function menuToggle() {
    if (menuVisible === null) {
        menuButtons.style.display = "flex"
        menuVisible = true
    } else if (menuVisible = true) {
        menuButtons.style.display = "none"
        menuVisible = null
    }
}
function handleScreenChange(e) {
    if (e.matches) {
        menuButton.classList.add('menuButton', 'btn');
        menuButton.classList.remove('hidden');
        headerButtons.classList.remove('header-buttons');
        headerButtons.classList.add('hidden');
    } else {
        menuButton.classList.add('hidden');
        menuButton.classList.remove('menuButton', 'btn');
        menuButtons.style.display = 'none';
        headerButtons.classList.add('header-buttons');
        headerButtons.classList.remove('hidden');
    }
}
handleScreenChange(mediaQuery620);

function searchToggle() {
    if (searchBarPos === "body") {
        headerSearchContainer.className = "headerSearchContainer"
        searchContainer.className = "hidden"
        menuButton.className = "menuButton btn"
        headerButtons.className = "hidden"
        searchBarPos = "header"
    } else if (searchBarPos === "header") {
        headerSearchContainer.className = "hidden"
        searchContainer.className = "searchContainer"
        headerButtons.className = "header-buttons"
        menuButton.className = "hidden"
        searchBarPos = "body"
    }
}

function returnHome() {
    //searchBar
    if (searchBarPos === "header") {
        searchToggle()
    }
    //backButton
    lastView = null;
    //Categories / Featured
    hideAll();
    //
    menuButtons.style.display = "none";
    resultsContainer.style.display = "none";
    backButton.style.display = "none";
    focusContainer.style.display = "none";
    categoryContainer.innerHTML = '';
    gifDetails.style.display = "none";

    // Responsive header/menu button toggle
    if (mediaQuery620.matches) {
        menuButton.classList.remove('hidden');
        menuButton.classList.add('btn');
        menuButton.classList.add('menuButton');
        headerButtons.classList.add('hidden');
    } else {
        menuButton.classList.add('hidden');
        headerButtons.classList.remove('hidden');
    }
};

function hideAll() {
    categoriesVisible = false;
    featuredVisible = false;
}

function showInFocusContainer(gif) {
    hideAll();
    focusContainer.innerHTML = "";
    gifDetails.innerHTML = "";

    focusContainer.style.display = "flex";
    resultsContainer.style.display = "none";
    backButton.style.display = "flex";
    gifDetails.style.display = "flex";

    const img = document.createElement("img");
    img.src = gif.images.original.url;
    img.alt = gif.title;
    img.classList.add("focus-img");

    const gifTitle = document.createElement("p");
    gifTitle.innerHTML = gif.title;
    gifTitle.classList.add("gif-title")

    focusContainer.appendChild(img);
    gifDetails.appendChild(gifTitle);
}

function hideFocusContainer() {
    backButton.style.display = "none";
    focusContainer.style.display = "none";
    gifDetails.style.display = "none";
}

function goBack() {
    backButton.style.display = "none";
    focusContainer.style.display = "none";
    gifDetails.style.display = "none";

    resultsContainer.style.display = 'flex';

}

// ==========================
// === Categories Section ===
// ==========================
async function cacheCategories() {
    if (!cachedCategories) {
        try {
            const data = await fetch(
                `https://api.giphy.com/v1/gifs/categories?api_key=${apiKey}`
            );
            const response = await data.json();
            cachedCategories = response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return;
        }
    }
}

async function categoriesButtonClick() {
    // Toggle off
    if (categoriesVisible) {
        searchToggle()
        categoryContainer.innerHTML = '';
        categoriesVisible = false;
        menuButtons.style.display = 'none';
        menuVisible = null;
        return;
    } else if (searchBarPos === "body") {
        searchToggle()
    }
    await cacheCategories();
    resultsContainer.innerHTML = '';
    renderCategories(cachedCategories);
    categoriesVisible = true;
    featuredVisible = false;
}

function renderCategories(categories) {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "flex";
    hideFocusContainer()

    categories.forEach((cat) => {
        const catItem = document.createElement("li");
        catItem.classList.add("category-item");

        const catImg = document.createElement("img");
        catImg.src = cat.gif.images.fixed_height_small.url;
        catImg.alt = cat.name;
        catImg.classList.add("category-thumbnail");

        const catLabel = document.createElement("span");
        catLabel.textContent = cat.name;

        const subBox = document.createElement("div");
        subBox.classList.add("subcategory-container");

        const subList = document.createElement("ul");
        subList.style.display = "none";
        subList.classList.add("subcategory-list");

        cat.subcategories.forEach((sub) => {
            const subItem = document.createElement("li");
            subItem.textContent = sub.name;
            subItem.classList.add("subcategory-item");
            subItem.addEventListener("click", () => {
                const query = sub.name;
                if (query) {
                    backButton.style.display = "none";
                    focusContainer.style.display = "none";
                    searchGifs(query);
                }
            });
            subList.appendChild(subItem);
        });

        catItem.addEventListener("click", (e) => {
            // Prevent bubbling to subcategory clicks
            if (e.target === catItem || e.target === catImg || e.target === catLabel) {
                // Clear all categories
                focusContainer.innerHTML = '';
                categoryContainer.innerHTML = "";

                const backBtn = document.createElement("p");
                backBtn.textContent = "back";
                backBtn.classList.add("category-back-btn");
                backBtn.addEventListener("click", () => {
                    renderCategories(cachedCategories);

                });

                // Show only this category
                subList.style.display = "grid";
                subBox.appendChild(subList);

                // Rebuild the selected category view
                catItem.innerHTML = "";
                catItem.appendChild(backBtn)
                catItem.appendChild(catImg);
                catItem.appendChild(catLabel);
                catItem.appendChild(subBox);

                focusContainer.appendChild(catItem);
                focusContainer.style.display = "flex";
            }
        });
        subBox.appendChild(subList);
        catItem.appendChild(catImg);
        catItem.appendChild(catLabel);
        catItem.appendChild(subBox);
        //catItem.appendChild(subBox); //Add subBox to catItem
        // subBox.appendChild(subList); //Add subList to subBox

        categoryContainer.appendChild(catItem);
    });
}

// ========================
// === Featured Section ===
// ========================
async function cacheFeatured() {
    if (!cachedFeatured) {
        try {
            const data = await fetch(
                `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=20&offset=0&rating=g&bundle=messaging_non_clips`
            );
            const response = await data.json();
            cachedFeatured = response.data;
        } catch (error) {
            console.error("Error fetching featured:", error);
            return;
        }
    }
}

async function featuredButtonClick() {
    //Toggle off
    if (featuredVisible) {
        searchToggle()
        resultsContainer.innerHTML = '';
        featuredVisible = false;
        menuButtons.style.display = 'none';
        menuVisible = null;
        return;
    } else if (searchBarPos === "body") {
        searchToggle()
    }
    await cacheFeatured();
    categoryContainer.innerHTML = '';
    renderFeatured(cachedFeatured);
    featuredVisible = true;
    categoriesVisible = false;
}

function renderFeatured(featured) {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "flex";
    hideFocusContainer()

    featured.forEach((feat) => {
        const featImg = document.createElement("img");
        featImg.src = feat.images.fixed_height.url;
        featImg.alt = feat.title;
        featImg.classList.add("featured-item");
        featImg.addEventListener("click", () => {
            showInFocusContainer(feat);
        });
        resultsContainer.appendChild(featImg);
    });
}

// ======================
// === Search Section ===
// ======================
async function searchGifs(query) {
    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(query)}&limit=50`
        );
        const data = await response.json();
        displayResults(data.data);
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
}

function displayResults(gifs) {
    hideAll();
    categoryContainer.innerHTML = "";
    resultsContainer.innerHTML = ""; // Clear previous results
    resultsContainer.style.display = "flex";
    gifs.forEach((gif) => {
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        img.addEventListener("click", () => showInFocusContainer(gif))
        resultsContainer.appendChild(img);
    });
}

// ======================
// === Initialization ===
// ======================
giphyLogo.addEventListener("click", returnHome);
backButton.addEventListener("click", goBack);
mediaQuery620.addEventListener('change', handleScreenChange);
categoriesButton.addEventListener("click", categoriesButtonClick);
menuCategoriesButton.addEventListener("click", categoriesButtonClick);
featuredButton.addEventListener("click", featuredButtonClick);
menuFeaturedButton.addEventListener("click", featuredButtonClick);
menuButton.addEventListener("click", menuToggle);
searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) {
        backButton.style.display = "none";
        focusContainer.style.display = "none";
        searchGifs(query);
        searchToggle()
    }
});
menuSearchButton.addEventListener("click", () => {
    const query = menuSearchBar.value.trim();
    if (query) {
        backButton.style.display = "none";
        focusContainer.style.display = "none";
        searchGifs(query);
    }
});

// ==================
// === Load Cache ===
// ==================

cacheFeatured()
cacheCategories()