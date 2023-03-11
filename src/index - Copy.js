const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search-button')
const searchResults = document.getElementById('search-results')
const watchlistEl = document.getElementById('movie-list')
let movieList = []

document.addEventListener('click', function (e) {
    if(e.target.dataset.watchlist){
        addToWatchlist(e.target.dataset.watchlist)
    }
})

searchBtn.addEventListener('click', getMovies)

function getMovies(e) {
    e.preventDefault()
    
    fetch(`http://www.omdbapi.com/?apikey=b5227d92&s=${searchTerm.value}`)
        .then(res => res.json())
        .then(data => {
            searchResults.innerHTML = ""
            searchResults.style.padding = "var(--top-bottom-movie-padding)"
            searchResults.style.textAlign = "left"

            getMoviesDetail(data.Search)
        })
}

function getMoviesDetail(movies) {
    for (const movie of movies) {
        fetch(`http://www.omdbapi.com/?apikey=b5227d92&t=${movie.Title}`)
            .then(res => res.json())
            .then(data => {
                movieList.push(movie)
                renderSearchResults(data)
        })
    }
}

function renderSearchResults(movie) {
    const { Poster, Title, Ratings, Runtime, Genre, Plot, imdbID } = movie
    let formattedRating = Ratings[0].Value
    
    searchResults.innerHTML +=  `
        <div id=${imdbID} class="movie-results">
            <img class="movie-poster" src="${Poster}">
            <div class="movie-details">
                <h4>${Title}
                    <span> 
                        <i class="fa-solid fa-star"></i> ${formattedRating.slice(0, -3)}
                    </span>
                </h4>
                <div class="movie-details-short">
                    <p>${Runtime}</p>
                    <p>${Genre}</p>
                    <i data-watchlist=${imdbID} class="fa-solid fa-circle-plus"></i> 
                    <p>Watchlist</p>
                </div>
                <p>${Plot}</p>
            </div>
        </div>
        `
    searchTerm.value = ""
}

function addToWatchlist(movieId) {
    const targetMovieObj = movieList.filter(function(movie){
        return movieId === movie.imdbID
    })
    localStorage.setItem(targetMovieObj[0].imdbID, JSON.stringify(targetMovieObj))
    renderWatchlist(movieId)
}

function renderWatchlist() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        console.log(JSON.parse(localStorage.getItem(key)))
    }
}