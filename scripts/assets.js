function showLoadingSpinner() {
    document.getElementById('content').innerHTML = getLoadingSpinnertemplate();
}

async function loadMorePokemon() {
    try {
        // CHANGED: Check against displayedPokemon length
        if (counter >= displayedPokemon.length) {
            const nextBatch = await fetchNextBatch();  // NEW: Fetch from API
            if (nextBatch.length === 0) {
                console.log("No more Pokémon to load");
                return;
            }
            pokemonData.push(...nextBatch);
            displayedPokemon.push(...nextBatch);
        }

        let contentDiv = document.getElementById('content');
        let additionalHtml = '';
        let loadCount = 0;

        // CHANGED: Loop over displayedPokemon starting from counter
        for (let i = counter; i < displayedPokemon.length && loadCount < 24; i++) {
            let pokemon = displayedPokemon[i];

            // Skip undefined Pokémon
            if (!pokemon || !pokemon.abilities) {
                console.warn(`Skipping undefined Pokémon at index ${i}`);
                counter++;
                continue;
            }

            // NEW: Compute original index in pokemonData for overlay
            let originalIndex = pokemonData.indexOf(pokemon);
            if (originalIndex === -1) {
                console.error('Pokémon not found in global data');
                continue;
            }

            additionalHtml += getPokemonCardsTemplate(pokemon, originalIndex);
            loadCount++;
            counter++;
        }

        contentDiv.innerHTML += additionalHtml;
        lazyLoadImages();  // NEW: Call after adding new content
    } catch (error) {
        console.error("Could not load more Pokémon:", error);
    }
}

function toggleOverlay() {
    let overlayDiv = document.getElementById('overlay');
    overlayDiv.classList.toggle('d_none')
    if (!overlayDiv.classList.contains('d_none')) {
        setTimeout(lazyLoadImages, 0);  // NEW: Ensure called after visible
    }
}

// NEW: Toggle function for AI popup
function toggleAIPopup() {
    let aiPopupDiv = document.getElementById('ai_popup');
    aiPopupDiv.classList.toggle('d_none');
}

function showNextPokemon(index) {
    index = (index + 1) % pokemonData.length;
    document.getElementById('overlay').innerHTML = '';
    renderDetailsOverlay(index);
}

function showPreviousPokemon(index) {
    index = (index - 1 + pokemonData.length) % pokemonData.length;
    document.getElementById('overlay').innerHTML = '';
    renderDetailsOverlay(index);
}

// prevent childelement onClick from bubbling up.
function childClickEvent() {
    event.stopPropagation();
}
