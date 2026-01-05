let offset = 0;  // NEW: Track pagination offset
const LIMIT = 24;  // Batch size

let allPokemonNames = [];  // NEW: Global for search suggestions (name/id only)

async function fetchAllPokemon() {
    try {
        showLoadingSpinner();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=0`);
        const data = await response.json();
        
        const detailPromises = data.results.map(result => fetchPokemonDetails(result.url));
        const results = await Promise.allSettled(detailPromises);
        const pokemonBatch = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(p => p !== null);
        
        pokemonData.push(...pokemonBatch);
        displayedPokemon.push(...pokemonBatch);
        
        renderPokemonCards(displayedPokemon);
        offset += LIMIT;  // Advance offset
    } catch (error) {
        console.error("Error fetching initial Pokémon:", error);
    }
}

// UPDATED: Function to fetch next batch (called from loadMorePokemon)
async function fetchNextBatch() {
    try {
        let pokemonUrls;
        if (currentType !== null && currentTypePokemonList.length > 0) {
            pokemonUrls = currentTypePokemonList.slice(offset, offset + LIMIT);  // Use filtered list
            console.log('Next filtered URLs length:', pokemonUrls.length);  // NEW: Debug
        } else {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            if (data.results.length === 0) return [];
            pokemonUrls = data.results.map(result => result.url);
            console.log('Next general URLs length:', pokemonUrls.length);  // NEW: Debug
        }
        
        if (pokemonUrls.length === 0) return [];
        
        const detailPromises = pokemonUrls.map(url => fetchPokemonDetails(url));
        const results = await Promise.allSettled(detailPromises);
        const pokemonBatch = results
            .filter(r => r.status === 'fulfilled')
            .map(r => r.value)
            .filter(p => p !== null);
        
        offset += LIMIT;
        return pokemonBatch;
    } catch (error) {
        console.error("Error fetching next batch:", error);
        return [];
    }
}

async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Keep only needed fields to reduce object size ~50-70%
        return {
            id: data.id,
            name: data.name,
            types: data.types,
            sprites: data.sprites,
            height: data.height,
            weight: data.weight,
            base_experience: data.base_experience,
            abilities: data.abilities,
            stats: data.stats
        };
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        return null;
    }
}

// NEW: Helper to fetch a single Pokémon's details on-demand (for search/overlay if not loaded)
async function fetchSinglePokemon(nameOrId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
        const data = await response.json();
        const stripped = {
            id: data.id,
            name: data.name,
            types: data.types,
            sprites: data.sprites,
            height: data.height,
            weight: data.weight,
            base_experience: data.base_experience,
            abilities: data.abilities,
            stats: data.stats
        };
        pokemonData.push(stripped);  // Add to local for future use
        return stripped;
    } catch (error) {
        console.error("Error fetching single Pokémon:", error);
        return null;
    }
}

// NEW: Load all names/IDs once (lightweight, no details)
async function loadAllPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1350');
        const data = await response.json();
        allPokemonNames = data.results.map(p => ({ name: p.name, id: parseInt(p.url.split('/').slice(-2, -1)[0]) }));
    } catch (error) {
        console.error("Error loading names for search:", error);
    }
}