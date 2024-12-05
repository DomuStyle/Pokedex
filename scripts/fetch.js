// fetch data from pokeAPI and store inside pokemonData array
// async function fetchAllPokemon() {

//     try {
//         const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1350&offset=0'); // ?limit50(amount to show) &offset=49(start position) use 49 if u want to start at pos 50
//         const data = await response.json();
//         // Fetch details for each Pokémon and store in array
//         for (let i = 0; i < data.results.length; i++) {
//             const pokemon = await fetchPokemonDetails(data.results[i].url);
//             pokemonData.push(pokemon);
//         }
//         // Render first batch of Pokémon after  initialdata is fetched
//         renderPokemonCards(pokemonData);
//     } catch (error) {
//         console.error("Error fetching Pokémon data:", error);
//     }
// }

async function fetchAllPokemon() {
    try {
        // First, fetch the first 100 Pokémon
        const initialResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=0');
        const initialData = await initialResponse.json();
        
        // Fetch details for the first 100 Pokémon
        for (let i = 0; i < initialData.results.length; i++) {
            const pokemon = await fetchPokemonDetails(initialData.results[i].url);
            pokemonData.push(pokemon);
        }

        // Render the first 100 Pokémon
        renderPokemonCards(pokemonData);

        // Now fetch the remaining Pokémon in batches or all at once
        const remainingResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1250&offset=100');
        const remainingData = await remainingResponse.json();
        
        // Fetch details for the remaining Pokémon
        for (let i = 0; i < remainingData.results.length; i++) {
            const pokemon = await fetchPokemonDetails(remainingData.results[i].url);
            pokemonData.push(pokemon);
        }

        // Optionally, you might want to re-render or update cards if new data is needed on the screen
        // or handle any completion logic here

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

async function fetchPokemonDetails(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
    }
}

