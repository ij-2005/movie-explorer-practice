// start
document.getElementById('backUp').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

//api

const apiKey = "3b54d384";

//variables

const popupMovie = document.querySelector(".popupMovie");
const overlay = document.querySelector('.popupOverlay');
const movieContainer = document.querySelector('.movieList');


//buttons

const closeBtn = document.getElementById("closePopup");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("inputMovie");
const favoriteBtn = document.getElementById("favBtn");


//array 
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
console.log(`current favorites : ${favorites}`);
//functions

function showFavorites(){
    movieContainer.innerHTML = "";

    if (favorites.length === 0){
        movieContainer.innerHTML = "<p>There are currently no favorites!</p>";
    }else{
        let html = "";
        favorites.forEach(item =>{
            html += `<div class="movie">
                    <img src="${item.img}" alt="${item.title} poster" />
                    <h3>${item.title}</h3>
                    <h3>Release: ${item.date}</h3>
                    <p class="hidden">${item.desc}</p>
                    <div class="buttons">
                    <button class="toggleDetails">Details</button>
                    <button class="favoriteBtn"><i class="fa-solid fa-heart" style="color: #f40101;"></i></button>
                    </div>
                </div>`
        });
        movieContainer.innerHTML = html;
    }
}

const isFavorite = (title) =>{
    return favorites.some(movie => movie.title === title);
}

const addFavorites = (title, date, img, desc) => {
    favorites.push({title, date, img, desc});
    console.log(favorites);
}

const fetchInfo = () => {

    const searchInfo = searchInput.value.trim();
    if(searchInfo === "") return;

    movieContainer.innerHTML = "<h1>Searching..</h1>";
    console.log(searchInfo);
    loading.classList.remove('hidden');
    overlay.style.display = 'block';

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInfo}`)
    .then(response => response.json())
    .then(data => {
        movieContainer.innerHTML = "";
        if (data.Response === "True") {
                console.log(data.Search); // Array of movie results
                data.Search.forEach(updateMovies);
            } else {
                movieContainer.innerHTML = "No results found.";
                // TODO: show 'no results' message to user
            }
    })
    .catch((e) => {
        console.error("Fetch error:", e);
        alert("Something went wrong. Please try again later.");
    })
    .finally(() => {
        overlay.style.display = 'none';
        loading.classList.add('hidden');
    });
    searchInput.value = "";
};

function updateMovies(data){
    const isFave = isFavorite(data.Title);
    const heartIcon = isFave ? '<i class="fa-solid fa-heart" style="color: #f40101;"></i>' : '<i class="fa-regular fa-heart"></i>';
    const posterImg = data.Poster !== "N/A" ? data.Poster : "https://i.imgflip.com/893yt7.png";

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${data.imdbID}&plot=full`)
        .then(res => res.json())
        .then(fullData => {
            movieContainer.innerHTML += 
                `<div class="movie">
                    <img src="${posterImg}" alt="${data.Title} poster" />
                    <h3>${data.Title}</h3>
                    <h3>Release: ${data.Year}</h3>
                    <p class="hidden">${fullData.Plot}</p>
                    <div class="buttons">
                    <button class="toggleDetails">Details</button>
                    <button class="favoriteBtn">${heartIcon}</button>
                    </div>
                </div>`;
        });

}

function popupUpdate(movieInfo){
    const title = movieInfo.querySelector("h3").textContent;
    const date = movieInfo.querySelectorAll("h3")[1].textContent;
    const img = movieInfo.querySelector("img").src;
    const alt = movieInfo.querySelector("img").alt;
    const desc = movieInfo.querySelector("p").textContent;

    popupMovie.querySelector("h3").textContent = title;
    popupMovie.querySelector("h4").textContent = date;
    popupMovie.querySelector("img").src = img;
    popupMovie.querySelector("img").alt = alt;
    popupMovie.querySelector("p").textContent = desc;
}


//listeners

favoriteBtn.addEventListener('click', () => {
    showFavorites();
});

searchBtn.addEventListener('click',()=>{
    fetchInfo();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchInfo();
  }
});

closeBtn.addEventListener('click',()=>{
    overlay.style.display = 'none';
    popupMovie.classList.toggle("hidden");
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.style.display = 'none';
        popupMovie.classList.add('hidden');
    }
});

movieContainer.addEventListener('click', (e)=>{
    if (e.target.classList.contains('toggleDetails')){
        const movieInfo = e.target.closest('.movie');
        popupUpdate(movieInfo);
        overlay.style.display = 'block';
        popupMovie.classList.remove('hidden');
        return;
    } else if (e.target.closest('.favoriteBtn')){

        const movieInfo = e.target.closest('.movie');
        const title = movieInfo.querySelector("h3").textContent;
        const date = movieInfo.querySelectorAll("h3")[1].textContent;
        const img = movieInfo.querySelector("img").src;
        const desc = movieInfo.querySelector("p").textContent;

        if (isFavorite(title)){ //if true
            favorites = favorites.filter(movie => movie.title !== title);
            movieInfo.querySelector('.favoriteBtn').innerHTML = '<i class="fa-regular fa-heart"></i>';
            console.log(favorites);
        } else {
            movieInfo.querySelector('.favoriteBtn').innerHTML = '<i class="fa-solid fa-heart" style="color: #f40101;"></i>';
            addFavorites(title, date, img, desc);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        return;
    }


});