async function fetchDataJson() {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15&offset=0');
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    let htmlcontent = "";
    for (let index = 0; index < responseAsJson.results.length; index++) {
        htmlcontent += getContentTemplate(responseAsJson, index);
    }

    document.getElementById('content').innerHTML = htmlcontent;
}

function getContentTemplate(responseAsJson, index) {
    const char = responseAsJson[index];
    console.log(responseAsJson[index]);
    
    return `<div class="pokedex-card">
                <h2>Name: ${responseAsJson.results[index].name}</h2>
            </div>
            `;
}



