const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 10000);

    try {
        const response = await fetch(API_URL, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
}