/**
 * Displays a loading spinner in the content area.
 */
function showLoadingSpinner() {
    document.getElementById('content').innerHTML = getLoadingSpinnertemplate();
}

/**
 * Loads more Pokémon cards, fetching the next batch if necessary.
 */
async function loadMorePokemon() {
    try {
        // Check against displayedPokemon length
        if (counter >= displayedPokemon.length) {
            const nextBatch = await fetchNextBatch();  // Fetch from API
            if (nextBatch.length === 0) {
                return;
            }
            pokemonData.push(...nextBatch);
            displayedPokemon.push(...nextBatch);
        }

        let contentDiv = document.getElementById('content');
        let additionalHtml = '';
        let loadCount = 0;

        // Loop over displayedPokemon starting from counter
        for (let i = counter; i < displayedPokemon.length && loadCount < 24; i++) {
            let pokemon = displayedPokemon[i];

            // Skip undefined Pokémon
            if (!pokemon || !pokemon.abilities) {
                console.warn(`Skipping undefined Pokémon at index ${i}`);
                counter++;
                continue;
            }

            // Compute original index in pokemonData for overlay
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
        lazyLoadImages();  // Call after adding new content
    } catch (error) {
        console.error("Could not load more Pokémon:", error);
    }
}

/**
 * Toggles the visibility of the overlay and lazy loads images if shown.
 */
function toggleOverlay() {
    let overlayDiv = document.getElementById('overlay');
    overlayDiv.classList.toggle('d_none')
    if (!overlayDiv.classList.contains('d_none')) {
        setTimeout(lazyLoadImages, 0);  // Ensure called after visible
    }
}

/**
 * Toggles the visibility of the AI popup.
 */
function toggleAIPopup() {
    let aiPopupDiv = document.getElementById('ai_popup');
    aiPopupDiv.classList.toggle('d_none');
}

/**
 * Displays the next Pokémon in the overlay.
 * @param {number} index - The current index of the Pokémon.
 */
function showNextPokemon(index) {
    index = (index + 1) % pokemonData.length;
    document.getElementById('overlay').innerHTML = '';
    renderDetailsOverlay(index);
}

/**
 * Displays the previous Pokémon in the overlay.
 * @param {number} index - The current index of the Pokémon.
 */
function showPreviousPokemon(index) {
    index = (index - 1 + pokemonData.length) % pokemonData.length;
    document.getElementById('overlay').innerHTML = '';
    renderDetailsOverlay(index);
}

/**
 * Prevents the click event on a child element from bubbling up.
 */
function childClickEvent() {
    event.stopPropagation();
}
