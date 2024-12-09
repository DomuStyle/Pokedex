// initialize the application by fecthing all Pokeon on page load
async function init() {
    showLoadingSpinner();
    await fetchAllPokemon();
    getShowMoreBtnTemplate();
}

// global variables and array's 
let counter = 0;

let pokemonData = []; // Array to store Pokémon data fetched from the api

let results = []; // array to store results for autocomplete function

// render functions
function renderPokemonCards(pokemonArray) {
    const contentDiv = document.getElementById('content');
    let html = '';
    
    for (let index = 0; index < pokemonArray.length; index++) {
        const pokemon = pokemonArray[index];
        if (pokemon) { // Check if data was successfully fetched
            
            if (counter < 24) {
                let cardTemplate = getPokemonCardsTemplate(pokemon, index);
                let dynamicBacground = renderDynamicBackground(pokemon);
                let updatedCardTemplate = cardTemplate.replace('class="card_display"', `class="card_display" ${dynamicBacground}`);
                html += updatedCardTemplate;
                counter++;
            } else {
                break;
            }  
        }
    }
    contentDiv.innerHTML = html;
}

// render details card overlay
function renderDetailsOverlay(index) {
    let overlayDiv = document.getElementById('overlay');
    let pokemon = pokemonData[index];
    // console.log('Index before template:', index);
    let overlayTemplate = getDetailOverlayTemplate(pokemon, index);
    overlayDiv.innerHTML = overlayTemplate; 
}

// render dynamic bacgrounds
function renderDynamicBackground(pokemon) {
    const typeClasses = pokemon.types.map(type => type.type.name);
    let backgroundStyle = '';
    
    if (typeClasses.length > 1) {
        backgroundStyle = `background: radial-gradient(circle, var(--${typeClasses[1]}), var(--${typeClasses[1]}) 20%, var(--${typeClasses[0]}) 60%, var(--${typeClasses[0]}));`;
    } else {
        // If there's only one type, use that for the background
        backgroundStyle = `background-color: var(--${typeClasses[0]});`;
    }
    return `style="${backgroundStyle}"`;
}

// search pokemon function
function searchPokemon() {
    let input = document.getElementById('search_pokemon').value.toLowerCase();

    if (input.length < 3) {
        document.getElementById('suggestions').innerHTML = '';
        return;
    }

    results = pokemonData.filter(pokemon => pokemon.name.toLowerCase().startsWith(input));
   
    let suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';

    let suggestionHTML = '';
    for (let index = 0; index < results.length; index++) {
        suggestionHTML += `
                	    <p onclick="renderDetailsOverlay('${results[index].id -1}'), toggleOverlay()">
                        ${results[index].name}
                        </p>
                        `;
    }
    suggestions.innerHTML = suggestionHTML;
    console.log(results);
}

function selectPokemon(name) {
    document.getElementById('search_pokemon').value = name;
    document.getElementById('suggestions').innerHTML = '';
    toggleOverlay(name);
}

// log stored array for development | delete if app finished!
console.log(pokemonData);

[0].id