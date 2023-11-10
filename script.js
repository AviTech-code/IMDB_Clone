
const mainContainer = document.querySelector('.mainContainer');
const my_items = document.querySelector('.cardContainer');
const my_fav_items = document.querySelector('.favContainer');
const searchMovies = document.getElementById('search-Movie');
const url = 'https://api.themoviedb.org/3/movie/157336?api_key=d38c44868c7ca917b9b10951b794493b';
const url2 = 'https://api.themoviedb.org/3/search/movie?query=rab%20ne&include_adult=false&language=en-US&page=1';
const imgContainer = document.querySelectorAll('.imgContainer');
const movieTitle = document.querySelectorAll('.title');
const img = Array.from(document.querySelectorAll('.my-image'));
const favIcon = document.querySelectorAll('.fa-heart');
const favButton = document.querySelector('.favButton');
const trendingUrl = 'https://api.themoviedb.org/3/trending/movie/day?api_key=d38c44868c7ca917b9b10951b794493b&language=en-US&append_to_response=videos';
let movieId = [];
//This is a Menu Bar
$('.fa-bars').click(function () {
    $('#menuBar').toggle("slide");
});
//This will display the list of trending movies
async function trendingMovies() {
    try {
        const response = await fetch(`${trendingUrl}`);
        const data = await response.json();
        displayMovieList(data.results);
        // console.log(data.results);

    } catch (err) {
        alert(`Error: ${err}`)
    };
}
trendingMovies();

// This is a search event listener whenever user presses key on searchBar 
searchMovies.addEventListener('keyup', () => {
    let movieItem = (searchMovies.value).trim();
 //   console.log(movieItem);
    if (movieItem.length != 0) {
        apiCall(movieItem);
    } else {
        // deleteChild(my_items);
        trendingMovies();
    }

});


//This is an api Call for the movie according to the search
async function apiCall(searchTerm) {
    try {
        const URL = `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=d38c44868c7ca917b9b10951b794493b&language=en-US&page=1&include_adult=false&append_to_response=videos,images`;
        const res = await fetch(`${URL}`);
        const data = await res.json();
        // console.log(data);

        if (data.results.length > 0)
            displayMovieList(data.results);
    }
    catch (error) {
        console.error(error);
    }
}

// This is function that will display the list of movies
function displayMovieList(movie) {

    my_items.innerHTML = '';
    for (let i = 0; i < movie.length; i++) {
        const movieCard = document.createElement('div');

        let mediaType = movie[i].media_type;

        if (movie[i].poster_path != null && movie[i].media_type === 'movie') {

            movieCard.classList.add('card');
            movieCard.setAttribute('id', `${movie[i].id}`);
        //     console.log(movieCard.getAttribute('id'));
             let movieID = movieCard.getAttribute('id');
             // let movies = "movies";
            movieCard.innerHTML = `
            <div id="${movie[i].id}" class="imgContainer" onclick="getMovieInDetail(${movieID}, 'movie')">
            <img src="https://image.tmdb.org/t/p/w500${movie[i].poster_path}" alt="Image Not Available" class="my-image">
        </div>
        <div class="titleContainer">
            <p class="title">${movie[i].title}</p>
            <i class="fa-regular fa-heart" onclick = "favouriteMovie(this.parentElement.parentElement)"></i>
        </div>
            `
        }
        if (movie[i].poster_path != null && movie[i].media_type === 'tv') {
            movieCard.classList.add('card');
            movieCard.setAttribute('id', `${movie[i].id}`);
            let movieID = movieCard.getAttribute('id');
            movieCard.innerHTML = `
            <div id="${movie[i].id}" class="imgContainer" onclick="getMovieInDetail(${movieID}, 'tv')">
            <img src="https://image.tmdb.org/t/p/w500${movie[i].poster_path}" alt="Image Not Available" class="my-image">
        </div>
        <div class="titleContainer">
            <p class="title">${movie[i].name}</p>
            <i class="fa-regular fa-heart" onclick = "favouriteMovie(this.parentElement.parentElement)"></i>
        </div>
            `
        }
        // console.log(movieCard);
        // console.log(mediaType);
        my_items.append(movieCard);
        // movieCard.addEventListener('click', () => {
        //     getMovieInDetail(movieCard, mediaType);
        // });

    }


}
//get the detail of a specific movies from API and display it in DOM
//This function is called when user clicks on particular movie card
async function getMovieInDetail(movieID, mediaType) {

console.log(movieID + " " + mediaType);
    //if the mediaType is movie then movie details will get called
    if (mediaType === 'movie') {
        try {

            const URl = `https://api.themoviedb.org/3/movie/${movieID}?api_key=d38c44868c7ca917b9b10951b794493b&language=en-US`;
            const res = await fetch(`${URl}`);
            const data = await res.json();
            // console.log(data);
            renderMovieInDetail(data);
        }
        catch (error) {
            console.error(error);
        }
    }
    // If the mediaType is TV seires then TV details will get called
    else {
        try {

            const URl = `https://api.themoviedb.org/3/tv/${movieID}?api_key=d38c44868c7ca917b9b10951b794493b&language=en-US`;
            const res = await fetch(`${URl}`);
            const data = await res.json();
            // console.log(data);
            renderMovieInDetail(data);
        }
        catch (error) {
            console.error(error);
        }
    }

}

// This will display the movie details 
function renderMovieInDetail(movie) {
    console.log(movie);
    my_items.innerHTML = '';
    let movieDetailCard = document.createElement('div');
    movieDetailCard.classList.add('detail-movie-card');

    //This is for movie data
    if (movie.runtime >= 0) {
        movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
		<div class="detail-movie-title">
			<span>${movie.title}</span>
			<div class="detail-movie-rating">
				<img src="favorite-153144_640.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
        <div class="videoBtn">
        <button onclick='playVideo(${movie.id},"${movie.status}")'><i class="fa-solid fa-play" style="color : white; font-size:1.3rem"></i> <span> Trailer<span></button>
            
        </div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>Runtime : ${movie.runtime} minutes</p>
			<p>Tagline : ${movie.tagline}</p>
		</div>
	`;
    }

    // This is for tv series data
    else {
        movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
		<div class="detail-movie-title">
			<span>${movie.name}</span>
			<div class="detail-movie-rating">
				<img src="favorite-153144_640.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
        <div class="videoBtn">
        <button onclick='playVideo(${movie.id},"${movie.status}")'><i class="fa-solid fa-play" style="color : white; font-size:1.3rem"></i> <span> Trailer<span></button>
            
        </div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.first_air_date}</p>
			<p>Episodes : ${movie.number_of_episodes}</p>
			<p>Tagline : ${movie.tagline}</p>
		</div>
	`;
    }
    my_items.append(movieDetailCard);
}


async function playVideo(movieId, mediaStatus) {
    var videoPlayer = document.createElement('div');
    videoPlayer.classList.add('myVideo');

    // console.log(mediaStatus)
    if (mediaStatus == "Released" || mediaStatus == "Post Production") {
        var response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=d38c44868c7ca917b9b10951b794493b&language=en-US`);
        var data = await response.json();
        // console.log(data.results);
    }
    else {
        var response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}/videos?api_key=d38c44868c7ca917b9b10951b794493b&language=en-US`);
        var data = await response.json();
        // console.log(data.results.length);
    }

    if (data.results.length > 0) {
        try {
            data.results.forEach(element => {
                if (element.type === "Trailer") {
                    // console.log(element);
                    const videoUrl = `https://www.youtube.com/embed/${element.key}`;
                    videoPlayer.innerHTML = `
                    <h2 class="videoStop" onclick="stopTrailer()"><span>X</span></h2>
                <iframe src="${videoUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
              `;
                }
            });
        } catch (error) {
            console.error(error);
        }
        my_items.innerHTML = '';
        my_items.append(videoPlayer);

    }
    else {
        alert("No Trailers Found");
    }
}


function stopTrailer() {
    my_items.innerHTML = '';
    trendingMovies();

}

//To add movies on Favourite list

function favouriteMovie(movieItem) {
//console.log(movieItem);
    let child1 = movieItem.children[0].children[0].currentSrc;
    let child2 = movieItem.children[1].children[0].innerHTML;

    // console.log(movieItem);
    // console.log(child1);
    // console.log(child2);
    movieId.push(movieItem.getAttribute('id'));
    let boolVal = new Set(movieId).size !== movieId.length;
    console.log(boolVal);
    if (!boolVal) {
        const favouriteItem = document.createElement('div');
        favouriteItem.setAttribute('id', movieItem.getAttribute('id'));
        favouriteItem.classList.add('favItems');
        favouriteItem.innerHTML = ` <span class="movieImg">
    <img src="${child1}" alt="Image Not Available">
</span><span class="movieTitle">
    <p class="title">${child2}</p>
</span>
<span class="deleteIcon">
    <i class="fa-solid fa-trash" style="color: #e4ff1a;" onclick="deleteMyItem(this.parentElement.parentElement, ${favouriteItem.getAttribute('id')})"></i>
</span>`

        my_fav_items.append(favouriteItem);
        // console.log(my_fav_items.children);
        // console.log(favouriteItem);
       // movieId = movieItem.getAttribute('id');
    }
    else {
        alert('This movie is already added');
        movieId.pop(movieItem.getAttribute('id'));
    }

}

favButton.addEventListener('click', (element) => {
    console.log(element.target.id);
    console.log(element);
    if (element.target.id == "") {
        my_fav_items.style.display = 'block';
        my_fav_items.style.width = '100%';
        mainContainer.innerHTML = "";
        mainContainer.append(my_fav_items);
        element.target.id = "1";
    }
    else {
        my_fav_items.style.display = 'none';
        mainContainer.append(my_items);
        element.target.id = "";
    }
});


//To delete items from favourite list

function deleteMyItem(element, id) {
     console.log(id);
    console.log(movieId);
    element.remove();
    movieId = movieId.filter((item) => item != id);
    console.log(movieId);
}


function deleteChild(element) {
    element.innerHTML = "";
}


