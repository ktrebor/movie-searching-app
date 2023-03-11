const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search-button')
const searchResults = document.getElementById('search-results')
const watchlistEl = document.getElementById('movie-list')
const messageUserEl = document.getElementById('message-user')
let movieList = []

document.addEventListener('click', function (e) {
    if (e.target.dataset.watchlist){
        addToWatchlist(e.target.dataset.watchlist)
    } else if (e.target.dataset.remove) {
        removeFromWatchlist(e.target.dataset.remove)
    }
})

searchBtn.addEventListener('click', getMovies)

function getMovies(e) {
    e.preventDefault()
    fetch(`https://www.omdbapi.com/?apikey=b5227d92&s=${searchTerm.value}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "False") {
                searchResults.innerHTML = `<p>Unable to find what you're looking for. Please try another search.</p>`
                searchTerm.value = ""
            } else {
                searchResults.innerHTML = ""
                searchResults.style.padding = "0 var(--top-bottom-movie-padding)"
                searchResults.style.textAlign = "left"
                getMoviesDetail(data.Search)
            }
        })
}

function getMoviesDetail(movies) {
    for (const movie of movies) {
        fetch(`https://www.omdbapi.com/?apikey=b5227d92&t=${movie.Title}`)
            .then(res => res.json())
            .then(data => {
                movieList.push(data)
                renderHomePage(data)
        })
    }
}

function renderHomePage(movie) {
    if (movie === undefined) {
        searchResults.innerHTML = `
            <i class="fa-solid fa-film"></i>
            <h3>Start exploring</h3>   
        `
    } else {
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
   
}

function addToWatchlist(movieId) {
    const targetMovieObj = movieList.filter(function(movie){
        return movieId === movie.imdbID
    })
    messageMovieAdded(targetMovieObj[0].Title)
    localStorage.setItem(targetMovieObj[0].imdbID, JSON.stringify(targetMovieObj))
}

function messageMovieAdded(movie) {
    messageUserEl.innerHTML = ""
    messageUserEl.innerHTML = `
        <p>${movie} was added to your watchlist</p>
    `
    messageUserEl.style.display = "block"
    setTimeout(function(){
        messageUserEl.style.display = "none"
    }, 2500)
}

function renderWatchlist() {
    if (localStorage.length === 0) {
        watchlistEl.innerHTML = `
            <h3>Your watchlist is looking a little empty...</h3>
            <div class="add-movies">
                <a href="./index.html">
                    <i class="fa-solid fa-circle-plus" ></i>
                    <p>Let's add some movies</p>
                </a>
            </div>`
    } else {
        watchlistEl.innerHTML = ""
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const movieLocal = JSON.parse(localStorage.getItem(key))
            let formattedRating = movieLocal[0].Ratings[0].Value
            
            watchlistEl.style.padding = "0 var(--top-bottom-movie-padding)"
            watchlistEl.style.textAlign = "left"

            watchlistEl.innerHTML += `
            <div id=${movieLocal[0].imdbID} class="movie-results">
                <img class="movie-poster" src="${movieLocal[0].Poster}">
                <div class="movie-details">
                    <h4>${movieLocal[0].Title}
                        <span> 
                            <i class="fa-solid fa-star"></i> ${formattedRating.slice(0, -3)}
                        </span>
                    </h4>
                    <div class="movie-details-short">
                        <p>${movieLocal[0].Runtime}</p>
                        <p>${movieLocal[0].Genre}</p>
                        <i data-remove=${movieLocal[0].imdbID} class="fa-solid fa-circle-minus"></i> 
                        <p>Remove</p>
                    </div>
                    <p>${movieLocal[0].Plot}</p>
                </div>
            </div>
            
            `
        }
    }
}

function removeFromWatchlist(movieId) {
    localStorage.removeItem(movieId)
    renderWatchlist()
}

if (searchResults) {
    renderHomePage()
}

if (watchlistEl) {
    renderWatchlist()
}
