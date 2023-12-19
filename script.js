document.addEventListener('DOMContentLoaded', function () {
    //variabler fasta
    const pokemonFinderLink = document.getElementById('pokemonFinderLink');
    const myTeamLink = document.getElementById('myTeamLink');
    const mainImage = document.getElementById('mainImage');
    const pokemonFinderBox = document.getElementById('pokemonFinderBox');
    const myTeamBox = document.getElementById('myTeamBox');
    const myReserveBox = document.getElementById('myReserveBox');
    const pokedex = document.getElementById("pokedex");
    const searchInput = document.getElementById('pokemonSearchInput');
    const reserveSearchInput = document.getElementById('reserveSearchInput');
    const teamFullMessage = document.getElementById('teamFullMessage'); 
    const teamText = document.getElementById('teamText'); 
    const reserveText = document.getElementById('reserveText'); 

    //variabler lösa
    let addToTeamButtons;
    let removeFromReserveButtons;
    let kickChampionButtons;
    let myTeam = [];
    let allPokemon = [];
    let allReservePokemon = [];

    //clickevents, visa/visa inte
    pokemonFinderLink.addEventListener('click', function (event) {
        event.preventDefault();
        mainImage.style.display = 'none';
        pokemonFinderBox.style.display = 'block';
        myTeamBox.style.display = 'none';
        myReserveBox.style.display = 'none';
        teamText.style.display = 'none';
        reserveText.style.display = 'none';
        reserveSearchInput.style.display = 'none';
        searchInput.style.display = 'block';
		
    });

    myTeamLink.addEventListener('click', function (event) {
        event.preventDefault();
        mainImage.style.display = 'none';
        myTeamBox.style.display = 'block';
        pokemonFinderBox.style.display = 'none';
        myReserveBox.style.display = 'block';
        teamText.style.display = 'block';
        reserveText.style.display = 'block';
        reserveSearchInput.style.display = 'block';
        searchInput.style.display = 'block';
        displayMyTeam();
    });

    //sök pokemon på laget
    searchInput.addEventListener('input', function () {
        filterPokemon();
    });

    //sök pokemon i reserve
    reserveSearchInput.addEventListener('input', function () {
        filterReservePokemon();
    });

    function filterPokemon() {
        const searchQuery = searchInput.value.toLowerCase();

        if (myTeamBox.style.display === 'block') {
            const filteredMyTeam = myTeam.filter((p) => p.name.toLowerCase().includes(searchQuery));
            const myTeamHTMLString = filteredMyTeam
                .map((pokemon, index) => `
                    <li class="card">
                        <img class="card-image" src="${pokemon.image}"/>
                        <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
                        <p class="card-info">Type: ${pokemon.type}</p>
                        <button class="kick-champion" data-index="${index}">Remove Champion</button>
                    </li>
                `)
                .join('');

            myTeamBox.innerHTML = myTeamHTMLString;

            //sparka pokemon
            kickChampionButtons = document.querySelectorAll('.kick-champion');

            kickChampionButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const selectedIndex = button.dataset.index;
                    const removedPokemon = myTeam[selectedIndex];
                    myTeam.splice(selectedIndex, 1);
                    displayMyTeam();
                    showConfirmation(`Removed ${removedPokemon.name} from team`);
                });
            });

            // Check if the team is full and display the message
            if (myTeam.length >= 3) {
                teamFullMessage.style.display = 'block';
            } else {
                teamFullMessage.style.display = 'none';
            }
        } else {
            const filteredPokemon = allPokemon.filter((p) => p.name.toLowerCase().includes(searchQuery));
            const pokemonHTMLString = filteredPokemon
                .map((individ, index) => `
                    <li class="card">
                        <img class="card-image" src="${individ.image}"/>
                        <h3 class="card-title">${individ.id}. ${individ.name}</h3>
                        <p class="card-info">Type: ${individ.type}</p>
                        <label for="nickname-${index}">Nickname:</label>
                        <input type="text" id="nickname-${index}" placeholder="Enter nickname">
                        <button class="add-to-team" data-index="${index}">Add to Team</button>
                    </li>
                `)
                .join('');

            pokedex.innerHTML = pokemonHTMLString;

            //lägg till i lag
            addToTeamButtons = document.querySelectorAll('.add-to-team');

            addToTeamButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const selectedIndex = button.dataset.index;
                    const nicknameInput = document.getElementById(`nickname-${selectedIndex}`);
                    const nickname = nicknameInput.value;

                    const selectedPokemon = { ...filteredPokemon[selectedIndex], name: nickname || filteredPokemon[selectedIndex].name };
                    //om man lämnar nickname blankt så ska den få sitt originalnamn
                    if (myTeam.length < 3) {
                        myTeam.push(selectedPokemon);
                        displayMyTeam();
                        showConfirmation(`Added ${nickname || filteredPokemon[selectedIndex].name} to team`);
                    } else {
                        addToReserve(selectedPokemon);
                        showConfirmation('Your Team is full! Pokemon added to RESERVE.');
                    }
                });
            });

            // Check if the team is full and display the message
            if (myTeam.length >= 3) {
                teamFullMessage.style.display = 'block';
            } else {
                teamFullMessage.style.display = 'none';
            }
        }
    }

    function filterReservePokemon() {
        const reserveSearchQuery = reserveSearchInput.value.toLowerCase();
        const filteredReservePokemon = allReservePokemon.filter((p) => p.name.toLowerCase().includes(reserveSearchQuery));

        const reservePokemonHTMLString = filteredReservePokemon
            .map((pokemon, index) => `
                <li class="card">
                    <img class="card-image" src="${pokemon.image}"/>
                    <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
                    <p class="card-info">Type: ${pokemon.type}</p>
                    <button class="remove-from-reserve" data-index="${index}">Remove from reserve</button>
                </li>
            `)
            .join('');

        myReserveBox.innerHTML = reservePokemonHTMLString;

        // ta bort från reserve
        removeFromReserveButtons = document.querySelectorAll('.remove-from-reserve');

        removeFromReserveButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const selectedIndex = button.dataset.index;
                const removedPokemon = allReservePokemon[selectedIndex];
                allReservePokemon.splice(selectedIndex, 1);
                filterReservePokemon();
                showConfirmation(`Removed ${removedPokemon.name} from reserve`);
            });
        });
    }

    function displayMyTeam() {
        const myTeamHTMLString = myTeam.map((pokemon, index) => `
            <li class="card">
                <img class="card-image" src="${pokemon.image}"/>
                <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
                <p class="card-info">Type: ${pokemon.type}</p>
                <button class="kick-champion" data-index="${index}">Remove Champion</button>
            </li>
        `).join('');

        myTeamBox.innerHTML = myTeamHTMLString;

        kickChampionButtons = document.querySelectorAll('.kick-champion');

        kickChampionButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const selectedIndex = button.dataset.index;
                const removedPokemon = myTeam[selectedIndex];
                myTeam.splice(selectedIndex, 1);
                displayMyTeam();
                showConfirmation(`Removed ${removedPokemon.name} from team`);
            });
        });

        // Check if the team is full and display the message
        if (myTeam.length >= 3) {
            teamFullMessage.style.display = 'block';
        } else {
            teamFullMessage.style.display = 'none';
        }
    }

    function addToReserve(pokemon) {
        allReservePokemon.push(pokemon);
        filterReservePokemon();
        showConfirmation(`Added ${pokemon.name} to Reserve`);
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

    //plocka från api
    function fetchPokemon() {
        const promises = [];
        for (let i = 1; i <= 150; i++) {
            const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            promises.push(fetch(url).then((res) => res.json()));
        }

        Promise.all(promises).then(results => {
            allPokemon = results.map((data) => ({
                name: data.name,
                id: data.id,
                image: data.sprites['front_default'],
                type: data.types.map((type) => type.type.name).join(', ')
            }));
            allReservePokemon = [];
            displayPokemon(allPokemon);
        });
    }

    function displayPokemon(pokemon) {
        const pokemonHTMLString = pokemon.map((individ, index) => `
            <li class="card">
                <img class="card-image" src="${individ.image}"/>
                <h3 class="card-title">${individ.id}. ${individ.name}</h3>
                <p class="card-info">Type: ${individ.type}</p>
                <label for="nickname-${index}">Nickname:</label>
                <input type="text" id="nickname-${index}" placeholder="Enter nickname">
                <button class="add-to-team" data-index="${index}">Add to Team</button>
            </li>
        `).join('');

        pokedex.innerHTML = pokemonHTMLString;

        addToTeamButtons = document.querySelectorAll('.add-to-team');

        addToTeamButtons.forEach((button) => {
            button.addEventListener('click', function () {
                const selectedIndex = button.dataset.index;
                const nicknameInput = document.getElementById(`nickname-${selectedIndex}`);
                const nickname = nicknameInput.value;

                const selectedPokemon = { ...pokemon[selectedIndex], name: nickname || pokemon[selectedIndex].name };

                if (myTeam.length < 3) {
                    myTeam.push(selectedPokemon);
                    displayMyTeam();
                    showConfirmation(`Added ${nickname || pokemon[selectedIndex].name} to team`);
                } else {
                    addToReserve(selectedPokemon);
                    showConfirmation('Your Team is full! Pokemon added to Reserve. Or, bänkvärmare.');
                }
            });
        });
    }

    fetchPokemon();
});