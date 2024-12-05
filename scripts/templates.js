function getLoadingSpinnertemplate() {
    return `
            <div class="loading_spinner">
                <img src="./assets/icons/pokemon-1536847_640.png" alt="Pokeball_icon">
            </div>
            `;
}

function getPokemonCardsTemplate(pokemon) {
    let abilityItem = pokemon.abilities.map(ability => ability.ability.name).join(", "); // use .map & .join to display abilities

    

    return `
            <div class="pokemon_card">
                <div class="card_header">
                    <p class="card_id"># ${pokemon.id}</p><h2 class="card_name">${pokemon.name}</h2>
                </div>
                ${getdnymaicBackgtoundtemplate(pokemon)}
                <div class="card_body">
                    <p><b>height:</b> ${pokemon.height}m</p>
                    <p><b>weight:</b> ${pokemon.weight} kg</p>
                    <p><b>Base-xp:</b> ${pokemon.base_experience}</p>
                    <p><b>Abilities:</b> ${abilityItem}</p>
                </div>        
            </div>`;
}

function getdnymaicBackgtoundtemplate(pokemon) {
    let typeClasses = pokemon.types.map(pokemonType => pokemonType.type.name).join(" ");
    
    let typeColors = [];
    for (let i = 0; i < pokemon.types.length; i++) {
        let pokemonType = pokemon.types[i];
        let typeName = pokemonType.type.name;
        let typeColor = getComputedStyle(document.documentElement).getPropertyValue(`--${typeName}-color`);
        typeColors.push(typeColor.trim());
    }

    let backgroundStyle = renderDynamicBackground(typeColors);

    return `
            <div class="card_display ${typeClasses}" style="${backgroundStyle}">
                <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}_image">
            </div>
            `;
}

function getShowMoreBtnTemplate() {
    let showMoreBtn = document.getElementById('show_more_btn');
    showMoreBtn.innerHTML = `
                            <button onClick="loadMorePokemon()">show more</button>
                            `;
}

// function getPokemonCardtemplate(pokemon) {
//     return `
//             <div class="pokemon_card">
//                 <div class="card_header">
//                     <p class="card_id"># ${pokemon.id}</p><h2 class="card_name">${pokemon.name}</h2>
//                 </div>
//                 <div class="card_display">
//                     <img src="${pokemon.sprites.other.home.front_default}" alt="${pokemon.name}_image">
//                 </div>
//                 <div class="card_body">
//                     <p><b>height:</b> ${pokemon.height}m</p>
//                     <p><b>weight:</b> ${pokemon.weight} kg</p>
//                     <p><b>Base-xp:</b> ${pokemon.base_experience}</p>
//                     <p><b>Abilities:</b> ${pokemon.abilities}</p>
//                 </div>        
//             </div>`;
// }