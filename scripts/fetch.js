// async function fetchNameJson() {
//     let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15&offset=0');
//     let responseNameJson = await response.json();
//     console.log(responseNameJson);

//     for (let index = 0; index < responseNameJson.results.length; index++) {
//         getNameTemplate(responseNameJson, index);
//     } 
// }

async function fetchAllPokemon() {

    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'); // ?limit50(amount to show) &offset=49(start position) use 49 if u want to start at pos 50
        const data = await response.json();

        // Fetch details for each Pokémon and store in array
        for (let i = 0; i < data.results.length; i++) {
            const pokemon = await fetchPokemonDetails(data.results[i].url);
            pokemonData.push(pokemon);
        }

        // Render all Pokémon after all data is fetched
        renderPokemonCards(pokemonData);
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

