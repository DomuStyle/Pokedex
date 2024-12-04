// initialize the application by fecthing all Pokeon on page load
async function init() {
    showLoadingSpinner();
    await fetchAllPokemon();
    getShowMoreBtnTemplate();
}

// global variables and array's
let counter = 0;

let pokemonData = []; // Array to store Pokémon data fetched from the api

// render functions
function renderPokemonCards(pokemonArray) {
    const contentDiv = document.getElementById('content');
    let html = '';
    
    for (let index = 0; index < pokemonArray.length; index++) {
        const pokemon = pokemonArray[index];
        if (pokemon) { // Check if data was successfully fetched
            
            if (counter < 24) {
                html += getPokemonCardsTemplate(pokemon);
                counter++;
            } else {
                break;
            }
            
        }
    }
    contentDiv.innerHTML = html;
}

// search pokemon function
function searchPokemon() {
    let input = document.getElementById('search_pokemon').value.toLowerCase();

    if (input.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

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

// log stored array for development | delete if app finished!
console.log(pokemonData);