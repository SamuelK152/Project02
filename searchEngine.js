const apiKey = "mgMtRKqOssbqEmUBEyMMD3uuJf2UGuTy";

const categoriesButton = document.getElementById("js-categories-button");
categoriesButton.addEventListener("click", fetchCategories);

let categoriesVisible = false;

async function fetchCategories() {
    const list = document.getElementById("js-category-list");

    // Toggle visibility
    if (categoriesVisible) {
        list.innerHTML = "";
        categoriesVisible = false;
        return;
    }

    try {
        const data = await fetch(
            `https://api.giphy.com/v1/gifs/categories?api_key=${apiKey}`
        );
        const response = await data.json();
        const categories = response.data;

        // Categories Container
        categories.forEach((cat) => {
            const item = document.createElement("li");
            item.textContent = cat.name;
            item.classList.add("category-item");

            // Subcategories Container
            const subList = document.createElement("ul");
            subList.style.display = "none";
            subList.classList.add("subcategory-list");

            cat.subcategories.forEach((sub) => {
                const subItem = document.createElement("li");
                subItem.textContent = sub.name;
                subList.appendChild(subItem);
                subItem.classList.add("subcategory-list-item");  //inprog
            });

            // Toggle subcategories on click
            item.addEventListener("click", () => {
                subList.style.display =
                    subList.style.display === "none" ? "grid" : "none";
            });

            list.appendChild(item);
            list.appendChild(subList);
        });

        categoriesVisible = true;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}