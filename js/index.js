const autocompleteConfig = {
  renderOption,
  inputValue,
  fetchData,
}

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})

createAutoComplete({
  ...autocompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})

function renderOption(movie) {
  // Handling a possible N/A image poster value
  const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
  return `
      <img src="${imgSrc}" alt="poster"/>
      ${movie.Title} (${movie.Year})
    `
}

function inputValue(movie) {
  return movie.Title
}

// Setup function to fetch the data.
async function fetchData(searchTerm) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '9d4bc6f6',
      s: searchTerm,
    },
  })

  if (response.data.Error) {
    return []
  }
  return response.data.Search
}

let leftMovie
let rightMovie

// Setup a function that will fetch the details of a movie.
async function onMovieSelect(movie, summaryElement, side) {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: '9d4bc6f6',
      i: movie.imdbID,
    },
  })

  summaryElement.innerHTML = movieTemplate(response.data)

  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }

  if (leftMovie && rightMovie) {
    runComparison()
  }
}

function runComparison() {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll(
    '#right-summary .notification'
  )

  leftSideStats.forEach(function (leftStat, index) {
    const rightStat = rightSideStats[index]

    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}

// Setup a function that will build the movie template.
function movieTemplate(movieDetail) {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  )
  const metascore = parseInt(movieDetail.Metascore)
  const imdbRating = parseInt(movieDetail.imdbRating)
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
  const awards = movieDetail.Awards.split(' ').reduce(function (prev, word) {
    const value = parseInt(word)
    if (isNaN(value)) {
      return prev
    } else {
      return prev + value
    }
  }, 0)

  const details = [
    { title: 'Awards', subtitle: 'Awards', dataValue: awards },
    { title: 'BoxOffice', subtitle: 'Box Office', dataValue: dollars },
    { title: 'Metascore', subtitle: 'Metascore', dataValue: metascore },
    { title: 'imdbRating', subtitle: 'IMDB Rating', dataValue: imdbRating },
    { title: 'imdbVotes', subtitle: 'IMDB Votes', dataValue: imdbVotes },
  ]

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" alt="poster" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    ${details
      .map(function (detail) {
        return `
        <article data-value=${detail.dataValue} class="notification is-primary">
          <p class="title">${movieDetail[detail.title]}</p>
          <p class="subtitle">${detail.subtitle}</p>
        </article>
      `
      })
      .join('')}
  `
}
