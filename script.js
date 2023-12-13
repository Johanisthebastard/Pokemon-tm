document.addEventListener('DOMContentLoaded', function () {

    const pokemonFinderLink = document.getElementById('pokemonFinderLink');
    const myTeamLink = document.getElementById('myTeamLink');
    const mainImage = document.getElementById('mainImage');
    const pokemonFinderBox = document.getElementById('pokemonFinderBox');
    const myTeamBox = document.getElementById('myTeamBox');
    const pokedex = document.getElementById("pokedex");

    let addToTeamButtons;
    let kickChampionButtons;

    let myTeam = [];

    pokemonFinderLink.addEventListener('click', function (event) {
        event.preventDefault();
        mainImage.style.display = 'none';
        pokemonFinderBox.style.display = 'block';
        myTeamBox.style.display = 'none';
    });

    myTeamLink.addEventListener('click', function (event) {
        event.preventDefault();
        mainImage.style.display = 'none';
        myTeamBox.style.display = 'block';
        pokemonFinderBox.style.display = 'none';
        displayMyTeam();
    });

    function displayMyTeam() {
        const myTeamHTMLString = myTeam
            .map((pokemon, index) => `
                <li class="card">
                    <img class="card-image" src="${pokemon.image}"/>
                    <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
                    <p class="card-info">Type: ${pokemon.type}</p>
                    <button class="kick-champion">Kick Champion</button>
                </li>
            `)
            .join('');

        myTeamBox.innerHTML = myTeamHTMLString;

        // Update kickChampionButtons after re-rendering myTeamBox
        kickChampionButtons = document.querySelectorAll('.kick-champion');

        kickChampionButtons.forEach((button, index) => {
            button.addEventListener('click', function () {
                const removedPokemon = myTeam[index];
                myTeam.splice(index, 1);
                displayMyTeam();
                showConfirmation(`Kicked ${removedPokemon.name} from team`);
            });
        });
    }

    function fetchPokemon() {
        const promises = [];
        for (let i = 1; i <= 5; i++) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            promises.push(fetch(url).then((res) => res.json()));
        }

        Promise.all(promises).then(results => {
            const pokemon = results.map((data) => ({
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                type: data.types.map((type) => type.type.name).join(', ')
            }));
            displayPokemon(pokemon);
        });
    }

    function displayPokemon(pokemon) {
        const pokemonHTMLString = pokemon.map(individ => `
            <li class="card">
                <img class="card-image"src="${individ.image}"/>
                <h3 class="card-title">${individ.id}. ${individ.name}</h3>
                <p class="card-info">Type: ${individ.type}</p>
                <button class="add-to-team">Add to Team</button>
            </li>
        `)
        .join('');

        pokedex.innerHTML = pokemonHTMLString;

        // Update addToTeamButtons after re-rendering pokedex
        addToTeamButtons = document.querySelectorAll('.add-to-team');

        addToTeamButtons.forEach((button, index) => {
            button.addEventListener('click', function () {
                if (myTeam.length < 3) {
                    const selectedPokemon = pokemon[index];
                    myTeam.push(selectedPokemon);
                    displayMyTeam();
                    showConfirmation(`Added ${selectedPokemon.name} to team`);
                } else {
                    alert('My Team is full! Remove a Pokemon before adding a new one.');
                }
            });
        });
    }

    function showConfirmation(message) {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation';
        confirmationMessage.textContent = message;
        document.body.appendChild(confirmationMessage);

        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
        }, 2000);
    }

    fetchPokemon();
});