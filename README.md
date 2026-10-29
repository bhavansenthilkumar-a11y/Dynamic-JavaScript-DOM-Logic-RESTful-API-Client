
# Dynamic Product Store

A responsive product store built using HTML, CSS, and JavaScript. It fetches product data from a public REST API and provides interactive search, category filtering, price sorting, and shopping cart functionality.

## Features

- Fetches products from Fake Store API using async/await
- Dynamic product rendering using JavaScript DOM manipulation
- Real-time search by product title or category
- Filter products by category
- Sort products by price (low to high and high to low)
- Add products to cart
- Increase or decrease product quantities
- Remove individual products or clear the cart
- Saves cart data using localStorage
- Loading skeleton cards while fetching products
- Error message and Retry button if the API request fails
- Responsive product layout

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules)
- Fetch API
- Fake Store API
- localStorage

## API

https://fakestoreapi.com/products

## Project Structure

Dynamic-Product-Store/
├── index.html
├── style.css
├── README.md
└── js/
    ├── api.js
    └── app.js

## How to Run

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Run `index.html` using the Live Server extension.
4. Make sure you have an internet connection to fetch products from the API.

## Author

Created as a JavaScript project to practice API integration, DOM manipulation, and client-side state management.
