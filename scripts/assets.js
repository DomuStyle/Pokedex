function showLoadingSpinner() {
    document.getElementById('content').innerHTML = getLoadingSpinnertemplate();
}

async function loadMorePokemon() {
    try {
        if (counter >= pokemonData.length) {
            console.log("No more Pokémon to load");
            return;
        }

        let contentDiv = document.getElementById('content');
        let additionalHtml = '';
        let loadCount = 0;

        for (let index = counter; index < pokemonData.length && loadCount < 24; index++) {
            let pokemon = pokemonData[index];

            // Skip undefined Pokémon
            if (!pokemon || !pokemon.abilities) {
                console.warn(`Skipping undefined Pokémon at index ${index}`);
                counter++;
                continue;
            }

            // Pass the correct index to the card template
            additionalHtml += getPokemonCardsTemplate(pokemon, index);
            loadCount++;
            counter++;
        }

        contentDiv.innerHTML += additionalHtml;
    } catch (error) {
        console.error("Could not load more Pokémon:", error);
    }
}

function toggleOverlay() {
    let overlayDiv = document.getElementById('overlay');
    overlayDiv.classList.toggle('d_none')
}

// prevent childelement onClick from bubbling up.
function childClickEvent() {
    event.stopPropagation();
}
