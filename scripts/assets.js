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
                additionalHtml += getPokemonCardtemplate(pokemon);
                loadCount++;
                counter++;
            }
        }

        contentDiv.innerHTML += additionalHtml;
    } catch (error) {
        console.error("could not load more pokemon", error);
    }
}