function getLoadingSpinnertemplate() {
    return `
            <div class="loading_spinner">
                <img src="./assets/icons/pokemon-1536847_640.png" alt="Pokeball_icon">
            </div>
            `;
}

function getPokemonCardsTemplate(pokemon, index) {
    let dynamicBackground = renderDynamicBackground(pokemon);
    
    return `
    <div class="pokemon_card_container">
        <div class="pokemon_card" onClick="renderDetailsOverlay(${index}), toggleOverlay()">
            <div class="header_bg">
                <div class="card_header">
                    <p class="card_id"># ${pokemon.id}</p><h2 class="card_name">${pokemon.name}</h2>
                </div>
            </div>    
            <div class="card_display" ${dynamicBackground}>
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}_image">
            </div>
            <div class="card_body">
                <p><b>height:</b> ${pokemon.height / 10}m</p>
                <p><b>weight:</b> ${pokemon.weight / 10} kg</p>
                <p><b>Base-xp:</b> ${pokemon.base_experience}</p>
            </div>        
        </div>
    </div>
    `
    ;
}

function getDetailOverlayTemplate(pokemon, index) {
    let abilityItem = pokemon.abilities.map(ability => ability.ability.name).join(", ");
    let dynamicBackground = renderDynamicBackground(pokemon);
    console.log(pokemon);
    
    return `
            <div class="detail_card_border moving_gradient" onClick="childClickEvent()">
                <div class="details_card_background" ${dynamicBackground}>
                    <div class="overlay_header">
                        <div class="overlay_header1">
                            <p class="overlay_id"># ${pokemon.id}</p><h2 class="overlay_name">${pokemon.name}</h2>
                        </div>
                        <div class="overlay_header2">
                            <p class="overlay_battlepoints">BP: ${pokemon.stats[0].base_stat}</p><img class="overlay_power_img" src="" alt="poke_power_image">
                        </div>
                    </div>

                    <img class="overlay_img" src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}_image">
                </div>
                <div class="overlay_body">
                    <p class="overlay_body_text"><b>Height:</b> ${pokemon.height}m</p>
                    <p class="overlay_body_text"><b>Weight:</b> ${pokemon.weight} kg</p>
                    <p class="overlay_body_text"><b>Base XP:</b> ${pokemon.base_experience}</p>
                    <p class="overlay_body_text"><b>Abilities:</b> ${abilityItem}</p>
                    <div class="navigation_buttons">
                        <button onClick="showPreviousPokemon(${index})">Previous</button>
                        <button onClick="showNextPokemon(${index})">Next</button>
                    </div>
                </div>
            </div>
            `;
}

function getShowMoreBtnTemplate() {
    let showMoreBtn = document.getElementById('show_more_btn');
    showMoreBtn.innerHTML = `
                            <button onClick="loadMorePokemon()">show more</button>
                            `;
}
