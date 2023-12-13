document.addEventListener('DOMContentLoaded', function () {

	const pokemonFinderLink = document.getElementById('pokemonFinderLink');
	const myTeamLink = document.getElementById('myTeamLink');
	const mainImage = document.getElementById('mainImage');
	const pokemonFinderBox = document.getElementById('pokemonFinderBox');
	const myTeamBox = document.getElementById('myTeamBox');
  
	// Dölj boxarna vid sidans öppnande damnit
	pokemonFinderBox.style.display = 'none';
	myTeamBox.style.display = 'none';
  
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
	});
  });

//Hämta pokemon från API

const pokedex = document.getElementById("pokedex");

console.log(pokedex);

const fetchPokemon = () => {
	const promises = [];
	for( let i = 1; i <= 5; i++ ){
				
		const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
		promises.push(fetch(url).then((res)=> res.json()));
	}

	Promise.all(promises).then( results => {
		const pokemon = results.map((data) => ({
			name: data.name,
			id: data.id,
			image: data.sprites['front_default'],
			type: data.types.map((type) => type.type.name).join(', ')
		}));
		displayPokemon(pokemon);
	});
};

const displayPokemon = (pokemon) => {
	console.log(pokemon);
	const pokemonHTMLString = pokemon.map (individ => `
	<li class="card">
	  <img class="card-image"src="${individ.image}"/>
	  <h3 class="card-title">${individ.id}. ${individ.name}</h3>
	  <p class="card-info">Type: ${individ.type}</p>
	</li>
	
	`
	)
	.join('')
	pokedex.innerHTML = pokemonHTMLString;


};

fetchPokemon();

// Lägg pokemon i team
