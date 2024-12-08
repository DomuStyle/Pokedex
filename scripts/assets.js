function showLoadingSpinner() {
    document.getElementById('content').innerHTML = getLoadingSpinnertemplate();
}

async function loadMorePokemon() {
    try {
        if (counter >= pokemonData.length) {
            console.log("no more pokemon to load");
            return; 
        }

        let contentDiv = document.getElementById('content');
        let additionalHtml = '';
        let loadCount = 0;

        for (let index = counter; index < pokemonData.length && loadCount < 24; index++) {
            let pokemon = pokemonData[index];

            if (pokemon) {
                additionalHtml += getPokemonCardsTemplate(pokemon);
                loadCount++;
                counter++;
            }
        }

        contentDiv.innerHTML += additionalHtml;
    } catch (error) {
        console.error("could not load more pokemon", error);
    }
}

function toggleOverlay() {
    let overlayDiv = document.getElementById('overlay');
    overlayDiv.classList.toggle('d_none')
}

function childClickEvent() {
    event.stopPropagation();
}
// function closeOverlay() {
    
// }