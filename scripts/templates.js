/**
 * Returns the HTML template for the loading spinner.
 * @returns {string} The HTML string for the loading spinner.
 */
function getLoadingSpinnertemplate() {
    return `
            <div class="spinner_container">
                <div class="loading_spinner">
                    <img src="./assets/icons/pokemon-1536847_640.png" alt="Pokeball_icon" loading="lazy">
                </div>
                <img class="pika_gif" src="./assets/Running-Pikachu-GIF.gif" alt="" loading="lazy">
            </div>
            `;
}

/**
 * Returns the HTML template for a Pokémon card.
 * @param {Object} pokemon - The Pokémon data object.
 * @param {number} index - The index of the Pokémon.
 * @returns {string} The HTML string for the Pokémon card.
 */
function getPokemonCardsTemplate(pokemon, index) {
    let dynamicBackground = renderDynamicBackground(pokemon);
    
    return `
    <div class="pokemon_card_container">
        <div class="pokemon_card" onClick="renderDetailsOverlay(${index}), toggleOverlay()">
            <div class="header_bg">
                <div class="card_header">
                    <p class="card_id">${pokemon.id}</p>
                    <h2 class="card_name">${capitalizeName(pokemon.name)}</h2> <!-- CHANGED -->
                </div>
            </div>    
            <div class="card_display" ${dynamicBackground}>
                <img data-src="${pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${pokemon.name}_image" loading="lazy">
            </div>
            <div class="card_body">
                <p><b>height:</b> ${pokemon.height / 10}m</p>
                <p><b>weight:</b> ${pokemon.weight / 10} kg</p>
                <p><b>Base-xp:</b> ${pokemon.base_experience}</p>
            </div>        
        </div>
    </div>
    `;
}

/**
 * Returns the HTML template for the detail overlay of a Pokémon.
 * @param {Object} pokemon - The Pokémon data object.
 * @param {number} index - The index of the Pokémon.
 * @returns {string} The HTML string for the detail overlay.
 */
function getDetailOverlayTemplate(pokemon, index) {
    let abilityItem = pokemon.abilities.map(ability => capitalizeName(ability.ability.name)).join(", ");
    let dynamicBackground = renderDynamicBackground(pokemon);    
    return `
            <div class="detail_card_border moving_gradient" onClick="childClickEvent()">
                <div class="details_card_background">
                    <div class="details_card_display" ${dynamicBackground}>
                        <div class="overlay_header">
                            <div class="overlay_header1">
                                <p class="overlay_id">${pokemon.id}</p><h2 class="overlay_name">${capitalizeName(pokemon.name)}</h2> <!-- CHANGED -->
                            </div>
                            <div class="overlay_header2">
                                <p class="overlay_battlepoints">BP: ${pokemon.stats[0].base_stat}</p>
                            </div>
                        </div>

                        <img class="overlay_img" data-src="${pokemon.sprites.other.home.front_default || pokemon.sprites.other['official-artwork'].front_default}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${pokemon.name}_image" loading="lazy">
                    </div>
                    <div class="overlay_nav">
                        <!-- CHANGED: Added onclick to call AI function with index -->
                        <button class="overlay_btn_1" onclick="getAIPokemonInfo(${index})">AI-Feature</button>
                    </div>
                    <div class="overlay_body">
                        <p class="overlay_body_text"><b>Height:</b> ${pokemon.height / 10}m</p> <!-- Fixed unit consistency -->
                        <p class="overlay_body_text"><b>Weight:</b> ${pokemon.weight / 10} kg</p>
                        <p class="overlay_body_text"><b>Base XP:</b> ${pokemon.base_experience}</p>
                        <p class="overlay_body_text"><b>Abilities:</b> ${abilityItem}</p>
                        <div class="navigation_buttons">
                            <img src="./assets/icons/arrowLeft.png" class="btn_left" onClick="showPreviousPokemon(${index})" loading="lazy">
                            <img src="./assets/icons/arrowRight.png" class="btn_right" onClick="showNextPokemon(${index})" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>
            `;
}

/**
 * Returns the HTML template for the AI popup.
 * @param {string} text - The text to display in the popup.
 * @returns {string} The HTML string for the AI popup.
 */
function getAIPopupTemplate(text) {
    return `
        <div class="ai_popup_border" onclick="childClickEvent()">
            <div class="ai_popup_content">
                <img class="ai_popup_img" src="./assets/img/poke_prof_by_grok.jpg" alt="AI_Icon" loading="lazy">
                <div class="ai_popup_right">
                    <button class="ai_close_btn" onclick="toggleAIPopup()">&times;</button>
                    <h3>Pokémon Prof. Gemini</h3>
                    <p class="ai_popup_text">${text}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Updates the show more button based on whether there are more Pokémon to load.
 */
function getShowMoreBtnTemplate() {
    let hasMore = true;
    if (currentType !== null) {
        hasMore = offset < currentTypePokemonList.length;
    } else {
        hasMore = true;  // Assume more for general (up to 1350)
    }

    let showMoreBtn = document.getElementById('show_more_btn');
    showMoreBtn.innerHTML = hasMore ? `
                            <button onClick="loadMorePokemon()">show more</button>
                            ` : '';  // Hide if no more
}