const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []

const dataPanel = document.querySelector('#data-panel')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
  <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL}${item.image}"
              class="card-img-top" alt="Movie Poster" />
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}" > More </button>
              <button class="btn btn-info btn-add-favorite">+</button>
            </div>
          </div>
        </div>
      </div>`
  });
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      movieTitle.innerText = data.title
      movieDate.innerText = data.release_date
      movieDescription.innerText = data.description
      movieImage.innerHTML = `<img src="${POSTER_URL}${data.image}" alt="movie-poster"
                class="img-fluid">`
    })


}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  let target = event.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  }
})

axios.get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    console.log(movies)
    renderMovieList(movies)
  })
  .catch((err) => console.log(err))


//testt12331