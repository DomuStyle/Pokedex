let counter = 0;

function renderPokemonCards(pokemonArray) {
    const contentDiv = document.getElementById('content');
    let html = '';
    

    for (let index = 0; index < pokemonArray.length; index++) {
        const pokemon = pokemonArray[index];
        if (pokemon) { // Check if data was successfully fetched
            
            if (counter < 24) {
                html += `<div class="pokemon_card">
                            <div class="card_header">
                                <p class="card_id"># ${pokemon.id}</p><h2 class="card_name">${pokemon.name}</h2>
                            </div>
                            <div class="card_display">
                                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}_image">
                            </div>
                            <div class="card_body">
                                <p><b>height:</b> ${pokemon.height}m</p>
                                <p><b>weight:</b> ${pokemon.weight} kg</p>
                                <p><b>Base-xp:</b> ${pokemon.base_experience}</p>
                                <p><b>Abilities:</b> ${pokemon.abilities}</p>
                            </div>        
                        </div>`;
                counter++;
            } else {
                break;
            }
            
        }
    }
    contentDiv.innerHTML = html;
}

function getShowMoreBtnTemplate() {
    let showMoreBtn = document.getElementById('show_more_btn');
    showMoreBtn.innerHTML = `
                            <button onClick="">show more</button>
                            `;
}

// function renderDetailsCard(){
//     document.getElementById('dateiled_content');
// }