const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12
const movies = []


const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const dataPanel = document.querySelector('#data-panel')
const paginator = document.querySelector('#paginator')


paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)

  renderMovieList(getMoviesByPage(page))
  console.log(getMoviesByPage(page))
})



searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredMovies = []

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderMovieList(filteredMovies)
})

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

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
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('已加入收藏')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  let target = event.target
  if (target.matches('.btn-show-movie')) {
    showMovieModal(Number(target.dataset.id))
  } else if (target.matches('.btn-add-favorite')) {
    addToFavorite(Number(target.dataset.id))
  }
})

axios.get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    console.log(movies)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))
