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

//functionsh

const addFavorites = () => {
    console.log("whats up")
}

const fetchInfo = () => {

    const searchInfo = searchInput.value.trim();
    if(searchInfo === "") return;

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
                    <button class="favoriteBtn"><i class="fa-regular fa-heart"></i></button>
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

searchBtn.addEventListener('click',()=>{
    fetchInfo();
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
        console.log("whats up");
        return;
    }


})