// ==============
// === Config ===
// ==============
const apiKey = "mgMtRKqOssbqEmUBEyMMD3uuJf2UGuTy";

let cachedCategories = null;
let categoriesVisible = null;

let cachedFeatured = null;
let featuredVisible = null;

let lastView = null;

// ====================
// === DOM Elements ===
// ====================
const giphyLogo = document.getElementById("js-logo");
const backButton = document.getElementById("js-back-button");
const categoriesButton = document.getElementById("js-categories-button");
const featuredButton = document.getElementById('js-featured-button');

const searchButton = document.getElementById("js-search-button");
const searchBar = document.getElementById("js-search-bar");
const resultsContainer = document.getElementById("js-results");
const focusContainer = document.getElementById("js-focus-container");
const categoryContainer = document.getElementById("js-category-container");
const featuredContainer = document.getElementById("js-featured-container");

// =========================
// === Utility Functions ===
// =========================
function returnHome() {
    hideAll();
    resultsContainer.style.display = "none";
    backButton.style.display = "none";
};

function hideAll() {
    categoryContainer.style.display = "none";
    featuredContainer.style.display = "none";
    categoriesVisible = false;
    featuredVisible = false;
}
function showInFocusContainer(gif) {
    hideAll();
    focusContainer.innerHTML = "";
    focusContainer.style.display = "flex";
    resultsContainer.style.display = "none";
    backButton.style.display = "flex";
    const img = document.createElement("img");
    img.src = gif.images.original.url;
    img.alt = gif.title;
    img.classList.add("focus-img");
    focusContainer.appendChild(img);
}

function goBack() {
    backButton.style.display = "none";
    focusContainer.style.display = "none";

    if (lastView === 'search') {
        resultsContainer.style.display = 'flex';
    } else if (lastView === 'featured') {
        lastView = null;
    }
}

// ==========================
// === Categories Section ===
// ==========================
async function fetchCategories() {

    // Toggle off
    if (categoriesVisible) {
        categoryContainer.innerHTML = '';
        categoryContainer.style.display = "none";
        categoriesVisible = false;
        return;
    }
    hideAll();

    // Fetch and cache if not already done
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

    // Cache
    renderCategories(cachedCategories);
    categoryContainer.style.display = "grid";
    categoriesVisible = true;
}

// Render Categories from cache
function renderCategories(categories) {
    categoryContainer.innerHTML = "";

    categories.forEach((cat) => {
        const catItem = document.createElement("li");
        catItem.classList.add("category-item");

        const catImg = document.createElement("img");
        catImg.src = cat.gif.images.fixed_height_small.url;
        catImg.alt = cat.name;
        catImg.classList.add("category-thumbnail");

        const catLabel = document.createElement("span");
        catLabel.textContent = cat.name;

        catItem.appendChild(catImg);
        catItem.appendChild(catLabel);

        const subList = document.createElement("ul");
        subList.style.display = "none";
        subList.classList.add("subcategory-container");

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

        catItem.addEventListener("click", () => {
            subList.style.display =
                subList.style.display === "none" ? "grid" : "none";
        });

        categoryContainer.appendChild(catItem);
        categoryContainer.appendChild(subList);
    });
}

// ========================
// === Featured Section ===
// ========================
async function displayFeatured() {
    //Toggle off
    if (featuredVisible) {
        featuredContainer.innerHTML = '';
        featuredContainer.style.display = "none";
        featuredVisible = false;
        return;
    }
    hideAll();

    // Fetch and cache if not already done
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

    // Cache
    renderFeatured(cachedFeatured);
    featuredContainer.style.display = "flex";
    featuredVisible = true;
}

// Render Featured from Cache
function renderFeatured(featured) {
    featuredContainer.innerHTML = "";

    featured.forEach((feat) => {
        const featImg = document.createElement("img");
        featImg.src = feat.images.fixed_height.url;
        featImg.alt = feat.title;
        featImg.classList.add("featured-item");
        featImg.addEventListener("click", () => {
            lastView = 'featured';
            showInFocusContainer(feat);
        });
        featuredContainer.appendChild(featImg);
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
    lastView = 'search';
    hideAll();
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
categoriesButton.addEventListener("click", fetchCategories);
featuredButton.addEventListener("click", displayFeatured);
searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) {
        backButton.style.display = "none";
        focusContainer.style.display = "none";
        searchGifs(query);
    }
});