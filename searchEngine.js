async function fetchCategories() {
    try{
    const data = await fetch('https://api.giphy.com/v1/gifs/categories?api_key=mgMtRKqOssbqEmUBEyMMD3uuJf2UGuTy');
    const response = await data.json();
    const categories = response.data;
    const list = document.getElementById('category-list');
    categories.forEach(cat => {
    const item = document.createElement('li');
    item.textContent = cat.name;
    list.appendChild(item);
});
    } catch (error) {
    console.error('Error fetching categories:', error);
}
}

function loadPage() {
    fetchCategories();
};

loadPage();

