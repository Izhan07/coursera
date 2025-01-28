document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resetButton = document.getElementById("resetButton");
    const resultContainer = document.getElementById("resultContainer");

    // Fetch data from the JSON file
    async function fetchRecommendations() {
        try {
            const response = await fetch("travel_recommendation_api.json");
            
            if (!response.ok) {
                throw new Error("Failed to fetch recommendations.");
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            return {};
        }
    }

    // Filter and display recommendations
    async function displayRecommendations(keyword) {
        const data = await fetchRecommendations();
        const results = [];
        
        // Filter data for matches
        for (const [category, items] of Object.entries(data)) {
            items.forEach((item) => {
                
                if (
                    item.name.toLowerCase().includes(keyword.toLowerCase()) ||
                    (item.cities && item.cities.some(city => city.name.toLowerCase().includes(keyword.toLowerCase())))
                ) {
                    results.push({ category,item });
                    
                }
            });
        }

        // Clear previous results
        resultContainer.innerHTML = "";
           
        if (results.length > 0) {
            results.forEach(({ category, item }) => {
                const recommendationCard = document.createElement("div");
                recommendationCard.className = "recommendation-card";
                
                let content = `
                    <h3>${item.name}</h3>
                    
                    <p>${item.description || ""}</p>
                `;

                if (item.imageUrl) {
                    content += `<img src="${item.imageUrl}" alt="${item.name}" class="recommendation-image">`;
                    
                }

                if (item.cities) {
                    content += `<h4>Cities:</h4><ul>`;
                    item.cities.forEach((city) => {
                        content += `<li>
                            <strong>${city.name}</strong>: ${city.description}
                            <img src="${city.imageUrl}" alt="${city.name}" class="city-image">
                        </li>`;
                    });
                    content += `</ul>`;
                }

                recommendationCard.innerHTML = content;
                resultContainer.appendChild(recommendationCard);
            });
        } else {
            resultContainer.innerHTML = "<p>No recommendations found.</p>";
        }
    }

    // Event listener for search
    searchButton.addEventListener("click", () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            displayRecommendations(keyword);
        }
    });

    // Event listener for reset
    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        resultContainer.innerHTML = "";
    });
});
