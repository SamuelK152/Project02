const apiKey = "mgMtRKqOssbqEmUBEyMMD3uuJf2UGuTy";

// ##Categories Dropdown

const categoriesButton = document.getElementById("js-categories-button");
categoriesButton.addEventListener("click", fetchCategories);

let cachedCategories = null;
let categoriesVisible = false;

async function fetchCategories() {
    const list = document.getElementById("js-category-container");

    // Toggle off
    if (categoriesVisible) {
        list.innerHTML = "";
        categoriesVisible = false;
        return;
    }

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

    // Render from cache
    renderCategories(cachedCategories);
    categoriesVisible = true;
}

// Render Categories from cache
function renderCategories(categories) {
    const list = document.getElementById("js-category-container");

    categories.forEach((cat) => {
        const item = document.createElement("li");
        item.classList.add("category-item");

        const catImg = document.createElement("img");
        catImg.src = cat.gif.images.fixed_height_small.url;
        catImg.alt = cat.name;
        catImg.classList.add("category-thumbnail");

        const catLabel = document.createElement("span");
        catLabel.textContent = cat.name;

        item.appendChild(catImg);
        item.appendChild(catLabel);

        const subList = document.createElement("ul");
        subList.style.display = "none";
        subList.classList.add("subcategory-container");

        cat.subcategories.forEach((sub) => {
            const subItem = document.createElement("li");
            subItem.textContent = sub.name;
            subItem.classList.add("subcategory-item");
            subList.appendChild(subItem);
        });

        item.addEventListener("click", () => {
            subList.style.display =
                subList.style.display === "none" ? "grid" : "none";
        });

        list.appendChild(item);
        list.appendChild(subList);
    });
}

// ##Featured Section

let cachedFeatured = null;
let featuredVisible = false;

const feturedButton = document.getElementById('js-featured-button');
feturedButton.addEventListener("click", displayFeatured);

async function displayFeatured() {
    const list = document.getElementById("js-featured-container");

    //Toggle off
    if (featuredVisible) {
        list.innerHTML = "";
        featuredVisible = false;
        return;
    }

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

    // Render from cache
    renderFeatured(cachedFeatured);
    featuredVisible = true;
}

// Render Featured from Cache
function renderFeatured(featured) {
    const list = document.getElementById("js-featured-container");

    featured.forEach((feat) => {
        const item = document.createElement("li");
        item.classList.add("featured-item");

        const featImg = document.createElement("img");
        featImg.src = feat.images.fixed_height.url;
        featImg.alt = feat.title;
        featImg.classList.add("featured-thumbnail");

        item.appendChild(featImg);
        list.appendChild(item);
    });
}

// ##Search Bar

const searchButton = document.getElementById("js-search-button");
const searchBar = document.getElementById("js-search-bar");
const resultsContainer = document.getElementById("js-results");

searchButton.addEventListener("click", () => {
    const query = searchBar.value.trim();
    if (query) {
        searchGifs(query);
    }
});

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
    resultsContainer.innerHTML = ""; // Clear previous results
    gifs.forEach((gif) => {
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        resultsContainer.appendChild(img);
    });
}
