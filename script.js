const apiKey = 'e7dde15cd9a72fa47f207695501c7aea'; 
const apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey + '&query=';
const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search');

// Função para buscar filmes da API
async function fetchMovies(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        renderMovies(data.results);
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        movieList.innerHTML = "<p>Erro ao carregar filmes. Tente novamente mais tarde.</p>";
    }
}

// Função para exibir filmes na tela
function renderMovies(movies) {
    movieList.innerHTML = ''; // Limpa a lista antes de adicionar os novos filmes

    if (movies.length === 0) {
        movieList.innerHTML = "<p>Nenhum filme encontrado.</p>";
        return;
    }

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const movieImage = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const movieTitle = movie.title;
        const movieDescription = movie.overview.substring(0, 100) + '...';

        movieCard.innerHTML = `
            <img src="${movieImage}" alt="${movieTitle}">
            <div class="info">
                <h3>${movieTitle}</h3>
                <p>${movieDescription}</p>
            </div>
        `;

        movieList.appendChild(movieCard);
    });
}

// Função de busca ao digitar
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query.length > 2) {
        fetchMovies(query);
    } else {
        movieList.innerHTML = '';
    }
});

if ('serviceWorker' in navigator) {  
    navigator.serviceWorker.register("./service-worker.js");
}

// Carrega filmes iniciais
fetchMovies('batman'); // Exemplo de busca inicial
