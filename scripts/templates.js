function renderPokemonCards(pokemonArray) {
    const contentDiv = document.getElementById('content');
    let html = '';

    for (let i = 0; i < pokemonArray.length; i++) {
        const pokemon = pokemonArray[i];
        if (pokemon) { // Check if data was successfully fetched
            html += `<div class="pokemon_card">
                        <div class="card_header">
                            <p class="card_id"># ${pokemon.id}</p><h2 class="card_name">${pokemon.name}</h2>
                        </div>
                        <div class="card_display">
                            <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}">
                        </div>
                        <div class="card_body">
                            <p><b>height:</b> ${pokemon.height}m</p>
                            <p><b>weight:</b> ${pokemon.weight}m</p>
                            <p><b>height:</b> ${pokemon.height}m</p>
                            <p><b>height:</b> ${pokemon.height}m</p>
                        </div>        
                    </div>`;
        }
    }
    contentDiv.innerHTML = html;
}