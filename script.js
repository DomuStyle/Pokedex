// initialize the application by fecthing all Pokeon on page load
async function init() {
    await fetchAllPokemon();
}

let pokemonData = []; // Array to store Pokémon data fetched from the api

function searchPokemon() {
    let input = document.getElementById('search_pokemon').value.toLowerCase();
    let results = [];

    results = pokemonData.filter(pokemon => pokemon.name.toLowerCase().startsWith(input));
   
    let suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    let suggestionHTML = '';
    for (let index = 0; index < results.length; index++) {
        suggestionHTML += `
                	    <p onclick="selectPokemon('${results[index].name}')">
                        ${results[index].name}
                        </p>
                        `;
    }
    suggestions.innerHTML = suggestionHTML;
    console.log(results);
    
}

function selectPokemon(name) {
    document.getElementById('search_pokemon').value = name;
    document.getElementById('suggestions').innerHTML = ''; // Clear suggestions when one is selected
}
console.log(pokemonData);