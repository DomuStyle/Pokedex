// initialize the application by fecthing all Pokeon on page load
async function init() {
    showLoadingSpinner();
    await fetchAllPokemon();
    setupSearchListeners(); // Initialize the search listeners
    setupTypeFilters(); // NEW: Set up type filter button listeners
}

// global variables and array's 
let counter = 0;

let pokemonData = []; // Array to store Pokémon data fetched from the api

let results = []; // array to store results for autocomplete function

let currentFocus = -1; // stores current focus index for keyboard navigation in search suggestions

let displayedPokemon = []; // array to store currently displayed (filtered) Pokémon

let currentType = null; // stores currently selected type filter


function renderPokemonCards(pokemonArray) {
    const contentDiv = document.getElementById('content');
    let html = '';
    
    for (let index = 0; index < pokemonArray.length; index++) {
        const pokemon = pokemonArray[index];
        if (pokemon) { // Check if data was successfully fetched
            
            if (counter < 24) {
                // CHANGED: Compute the original index in pokemonData for overlay
                let originalIndex = pokemonData.indexOf(pokemon);
                if (originalIndex === -1) {
                    console.error('Pokémon not found in global data');
                    continue;
                }
                let cardTemplate = getPokemonCardsTemplate(pokemon, originalIndex);
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
    getShowMoreBtnTemplate();
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

function setupSearchListeners() {
    const searchInput = document.getElementById('search_pokemon');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        searchPokemon(); // Re-renders the list when you type
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.repeat) return; // Only process initial press.

        const list = document.getElementById('suggestions');
        const items = list ? list.querySelectorAll('.suggestion-item') : []; // Use class to select

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            addActive(items, searchInput);
            searchInput.focus(); // Ensure input keeps focus.
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            addActive(items, searchInput);
            searchInput.focus(); // Ensure input keeps focus.
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                // Replace input with full selected name on Enter (selection).
                searchInput.value = items[currentFocus].innerText;
                addActive(items, searchInput); // Added: Re-highlight briefly for visual consistency during selection.
                items[currentFocus].click(); // Simulate click to select
            }
        }
    });
}

function searchPokemon() {
    let input = document.getElementById('search_pokemon').value.toLowerCase();
    let suggestions = document.getElementById('suggestions');

    if (input.length < 3) {
        suggestions.innerHTML = '';
        currentFocus = -1; // Reset focus
        return;
    }

    // CHANGED: Filter from displayedPokemon (respects current type filter) and limit to the first 10 hits (guard against null/undefined)
    results = displayedPokemon
        .filter(pokemon => pokemon && pokemon.name && pokemon.name.toLowerCase().startsWith(input)) // Added guard: Skip invalid entries to prevent errors
        .slice(0, 10);
   
    suggestions.innerHTML = '';
    currentFocus = -1; // Reset focus whenever the list updates

    results.forEach((pokemon, i) => {
        // Find the index in the original pokemonData array
        let pokemonIndex = pokemonData.findIndex(p => p && p.id === pokemon.id); // Added guard: Skip invalid
        
        const p = document.createElement('p');
        p.className = 'suggestion-item'; // Add class for easy selection
        p.innerText = pokemon.name; // Use innerText for safety
        p.setAttribute('role', 'option'); // Accessibility: mark as option
        
        p.onclick = () => {
            handleSearchSelection(pokemonIndex);
        };
        suggestions.appendChild(p);
    });

    // Accessibility: mark suggestions as listbox
    suggestions.setAttribute('role', 'listbox');
}

function addActive(items, searchInput) {
    if (!items || items.length === 0) return;
    removeActive(items);
    
    // Loop navigation
    if (currentFocus >= items.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = items.length - 1;
    
    items[currentFocus].classList.add("suggestion-active");
    items[currentFocus].scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function removeActive(items) {
    for (let item of items) {
        item.classList.remove("suggestion-active");
    }
}

function handleSearchSelection(index) {
    // Added: Replace input with full selected Pokémon name on selection.
    // This ensures it's set for both keyboard and mouse selections.
    document.getElementById('search_pokemon').value = pokemonData[index].name;

    renderDetailsOverlay(index); // from script.js
    toggleOverlay();             // from assets.js
    
    // Clear suggestions after selection
    document.getElementById('suggestions').innerHTML = '';
    currentFocus = -1; // Reset focus
}


window.addEventListener('click', function(e) {
    const searchInput = document.getElementById('search_pokemon');
    const suggestions = document.getElementById('suggestions');
    if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.innerHTML = '';
        currentFocus = -1; // Reset focus
    }
});

function selectPokemon(name) {
    document.getElementById('search_pokemon').value = name;
    document.getElementById('suggestions').innerHTML = '';
    toggleOverlay(name);
}

// NEW: Function to set up click listeners on type buttons
function setupTypeFilters() {
    const typeButtons = document.querySelectorAll('[class^="header_btn_"]');
    typeButtons.forEach(btn => {
        const type = btn.className.replace('header_btn_', '');
        btn.addEventListener('click', () => applyFilter(type));
    });
}

// NEW: Function to apply or toggle a type filter
function applyFilter(selectedType) {
    if (currentType === selectedType) {
        currentType = null; // Toggle off
    } else {
        currentType = selectedType; // Set new filter
    }

    // Recompute displayedPokemon from the full pokemonData
    if (currentType === null) {
        displayedPokemon = pokemonData.slice(); // Shallow copy to separate array
    } else {
        displayedPokemon = pokemonData.filter(p => p && p.types.some(t => t.type.name === currentType));
    }

    // Update active class on buttons
    const typeButtons = document.querySelectorAll('[class^="header_btn_"]');
    typeButtons.forEach(b => b.classList.remove('active'));
    if (currentType !== null) {
        const selectedBtn = document.querySelector(`.header_btn_${currentType}`);
        if (selectedBtn) selectedBtn.classList.add('active');
    }

    // Reset and re-render
    counter = 0;
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';
    renderPokemonCards(displayedPokemon);
}

// log stored array for development | delete if app finished!
// console.log(pokemonData);
