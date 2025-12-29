// fetch data from pokeAPI and store inside pokemonData array

async function fetchAllPokemon() {
    try {
        // Fetch the initial list (keep at 100 for buffer, or reduce to 48 for even faster initial load)
        const initialResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const initialData = await initialResponse.json();
        
        // Parallel fetch details: Map to promises, use allSettled to handle partial failures
        const detailPromises = initialData.results.map(result => fetchPokemonDetails(result.url));
        const initialResults = await Promise.allSettled(detailPromises);
        const initialPokemon = initialResults
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .filter(p => p !== null); // Filter out any nulls from errors
        pokemonData.push(...initialPokemon); // Spread to add all successful ones

        // NEW: Add to displayedPokemon (since currentType is null initially, add all)
        displayedPokemon.push(...initialPokemon);

        // Render the first batch immediately (will skip any undefined/null)
        renderPokemonCards(displayedPokemon);

        // Fetch remaining in background (parallelize this too, but in batches to avoid overwhelming browser)
        const remainingResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1250&offset=100');
        const remainingData = await remainingResponse.json();
        
        // Batch remaining into groups of 100 to prevent too many concurrent requests
        const batchSize = 100;
        for (let i = 0; i < remainingData.results.length; i += batchSize) {
            const batch = remainingData.results.slice(i, i + batchSize);
            const batchPromises = batch.map(result => fetchPokemonDetails(result.url));
            const batchResults = await Promise.allSettled(batchPromises);
            const batchPokemon = batchResults
                .filter(result => result.status === 'fulfilled')
                .map(result => result.value)
                .filter(p => p !== null); // Filter out any nulls from errors
            pokemonData.push(...batchPokemon);

            // NEW: Conditionally add to displayedPokemon based on current filter
            if (currentType === null) {
                displayedPokemon.push(...batchPokemon);
            } else {
                const matching = batchPokemon.filter(p => p && p.types.some(t => t.type.name === currentType));
                displayedPokemon.push(...matching);
            }
        }

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

// fetch detailed data about each pokemon using pokemon url
async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        return null; // Return null on error for easy filtering
    }
}