let offset = 0;  // Track pagination offset
const LIMIT = 24;  // Batch size

let allPokemonNames = [];  // Global for search suggestions (name/id only)

/**
 * Fetches the initial batch of all Pokémon and renders them.
 */
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

/**
 * Fetches the next batch of Pokémon, either from all or filtered by type.
 * @returns {Promise<Array>} The batch of fetched Pokémon.
 */
async function fetchNextBatch() {
    try {
        let pokemonUrls;
        if (currentType !== null && currentTypePokemonList.length > 0) {
            pokemonUrls = currentTypePokemonList.slice(offset, offset + LIMIT);  // Use filtered list
        } else {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
            const data = await response.json();
            if (data.results.length === 0) return [];
            pokemonUrls = data.results.map(result => result.url);
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

/**
 * Fetches detailed information for a single Pokémon from the given URL.
 * @param {string} url - The URL to fetch Pokémon details from.
 * @returns {Promise<Object|null>} The Pokémon details or null on error.
 */
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

/**
 * Fetches a single Pokémon by name or ID.
 * @param {string|number} nameOrId - The name or ID of the Pokémon.
 * @returns {Promise<Object|null>} The Pokémon details or null on error.
 */
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

/**
 * Loads all Pokémon names for search suggestions.
 */
async function loadAllPokemonNames() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1350');
        const data = await response.json();
        allPokemonNames = data.results.map(p => ({ name: p.name, id: parseInt(p.url.split('/').slice(-2, -1)[0]) }));
    } catch (error) {
        console.error("Error loading names for search:", error);
    }
}