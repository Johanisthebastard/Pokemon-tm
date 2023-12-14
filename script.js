document.addEventListener('DOMContentLoaded', function () {
	// mina fasta variabler som snackar med olika dom-element genom id, och manipulera innehållet
    const pokemonFinderLink = document.getElementById('pokemonFinderLink');
    const myTeamLink = document.getElementById('myTeamLink');
    const mainImage = document.getElementById('mainImage');
    const pokemonFinderBox = document.getElementById('pokemonFinderBox');
    const myTeamBox = document.getElementById('myTeamBox');
    const pokedex = document.getElementById("pokedex");
    const searchInput = document.getElementById('pokemonSearchInput');

	// mina variabler för pokemonlagring
    let addToTeamButtons;
    let kickChampionButtons;
    let myTeam = [];
    let allPokemon = [];

	//Ändra synlighet för olika sections baserat på userchoice
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
	
	//inputlistener som anropar och filtrerar baserat på inmatning
    searchInput.addEventListener('input', function () {
        filterPokemon();
    });
	//filtrerar pokedexen eller myteam beroende på vilket som är synligt och visar matchande input
    function filterPokemon() {
        const searchQuery = searchInput.value.toLowerCase();

        if (myTeamBox.style.display === 'block') {
            // Filter för MY TEAM
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
        } else {
            // Filter for Pokemon Finder
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

            // Gör så namnet på pokemon visas, om jag inte gett ett nick och är det > 3, visa att det är fullt
            addToTeamButtons = document.querySelectorAll('.add-to-team');

            addToTeamButtons.forEach((button) => {
                button.addEventListener('click', function () {
                    const selectedIndex = button.dataset.index;
                    const nicknameInput = document.getElementById(`nickname-${selectedIndex}`);
                    const nickname = nicknameInput.value;

                    const selectedPokemon = { ...filteredPokemon[selectedIndex], name: nickname || filteredPokemon[selectedIndex].name };

                    if (myTeam.length < 3) {
                        myTeam.push(selectedPokemon);
                        displayMyTeam();
                        showConfirmation(`Added ${nickname || filteredPokemon[selectedIndex].name} to team`);
                    } else {
                        showConfirmation('Your Team is full! Remove a Pokemon before adding a new one.');
                    }
                });
            });
        }
    }

	//Visar pokemonzz på myteamsidan, generera html för varje individ, eventlistener för att ta bort
    function displayMyTeam() {
		//skapa en sträng för varje pokem0nzz i myteam/gör till en enda sträng
        const myTeamHTMLString = myTeam.map((pokemon, index) => `
            <li class="card">
                <img class="card-image" src="${pokemon.image}"/>
                <h3 class="card-title">${pokemon.id}. ${pokemon.name}</h3>
                <p class="card-info">Type: ${pokemon.type}</p>
                <button class="kick-champion" data-index="${index}">Remove Champion</button>
            </li>
        `).join('');

        myTeamBox.innerHTML = myTeamHTMLString;

        // Updatera knapp efter myteambox omrenderats
        kickChampionButtons = document.querySelectorAll('.kick-champion');

		//eventlistener lägg till ny efter varje knapp med kick-champ.
        kickChampionButtons.forEach((button) => {
            button.addEventListener('click', function () {
                //hämta valt index från data index
				const selectedIndex = button.dataset.index;
                
				//hämta borttagen pokemon från team baserat på valt index
				const removedPokemon = myTeam[selectedIndex];
                //ta bort borttagen pokemon från team
				myTeam.splice(selectedIndex, 1);
                //kalla på display för att uppdatera visning av team
				displayMyTeam();
                showConfirmation(`Removed ${removedPokemon.name} from team`);
            });
        });
    }

	//Hämta pokemon från API --! ÄNDRA TILL 150 när den ska visas! !--
    function fetchPokemon() {
        const promises = [];
        for (let i = 1; i <= 5; i++) {
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

        // Uppdatera addToTeamButtons
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
                    showConfirmation('Your Team is full! Remove a Pokemon before adding a new one.');
                }
            });
        });
    }
	
	// GÖmma pokemon i index pokedex
    function hidePokemon(index) {
		//Hämta pokemonelement med angivet index och ändra display none/block
        const hiddenPokemon = pokedex.children[index];
        hiddenPokemon.style.display = 'none';
    }
	
    function showPokemon(index) {
        const shownPokemon = pokedex.children[index];
        shownPokemon.style.display = 'block';
    }

    function showConfirmation(message) {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation';
        confirmationMessage.textContent = message;
        document.body.appendChild(confirmationMessage);
		//Antingen att jag tog bort pokemon, lade till eller team full. ändra i 'showconfirmation'

		// ta bort bekräftelse efter 2 sek
        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
        }, 2000);
    }

    fetchPokemon();
});