// fetch data from pokeAPI and store inside pokemonData array
async function fetchAllPokemon() {
    try {
        // First, fetch the first 100 Pokemon
        const initialResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const initialData = await initialResponse.json();
        
        // Fetch details for the first 100 Pokemon
        for (let i = 0; i < initialData.results.length; i++) {
            const pokemon = await fetchPokemonDetails(initialData.results[i].url);
            pokemonData.push(pokemon);
        }

        // Render the first batch of Pokemon
        renderPokemonCards(pokemonData);

        // Now fetch the remaining Pokemon in batches or all at once
        const remainingResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1250&offset=100');
        const remainingData = await remainingResponse.json();
        
        // Fetch details for the remaining Pokemon
        for (let i = 0; i < remainingData.results.length; i++) {
            const pokemon = await fetchPokemonDetails(remainingData.results[i].url);
            pokemonData.push(pokemon);
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
    }
}

