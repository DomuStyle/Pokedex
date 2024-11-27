async function fetchDataJson() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151&offset=0');
    let responseAsJson = await response.json();
    console.log(responseAsJson);
}
