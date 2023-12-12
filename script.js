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