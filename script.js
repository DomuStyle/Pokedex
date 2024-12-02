// initialize the application by fecthing all Pokeon on page load
async function init() {
    await fetchAllPokemon();
}

let pokemonData = []; // Array to store Pokémon data fetched from the api

function fetchData() {
    const pokemonName = document.getElementById('search_pokemon').value.toLowerCase(); // toLowerCase turns the input into small cases
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }
            return response.json();
        })
        .then(data => {
            const imgElement = document.getElementById('test_img');
            imgElement.src = data.sprites.other.home.front_default || data.sprites.front_default || '';
        })
        .catch(error => {
            console.error("Error fetching Pokémon data:", error);
        });
}
console.log(pokemonData);


