function createAutoComplete(config) {
  // Destructure the individual properties of config.
  const { root, renderOption, onOptionSelect } = config
  const { inputValue, fetchData } = config

  root.innerHTML = `
  <label><b>Search</b></label>
  <input type="text" class="input"/>
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`

  // Get a reference to the html input element.
  const input = root.querySelector('.input')

  // Get a reference to the html element with
  // the class of dropdown and results.
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  // Setup a custom callback function for the input event.
  async function onInput(event) {
    // Fetch the list of movies.
    const items = await fetchData(event.target.value)

    // If there are no movies, remove the is-active
    // class in the dropdown.
    if (!items.length) {
      dropdown.classList.remove('is-active')
      return
    }

    // Clear any existing html code inside the
    // results wrapper element.
    resultsWrapper.innerHTML = ''

    // Add an is-active class to the dropdown element.
    dropdown.classList.add('is-active')

    for (let item of items) {
      // Create an html anchor element.
      const option = document.createElement('a')
      option.classList.add('dropdown-item')
      option.innerHTML = renderOption(item)

      // Add a click event listener whenever the user
      // clicks on a movie.
      option.addEventListener('click', function () {
        dropdown.classList.remove('is-active')

        // Update the text value of the input element
        // to whatever was the title of the clicked movie.
        input.value = inputValue(item)
        onOptionSelect(item)
      })

      resultsWrapper.appendChild(option)
    }
  }

  // Assign an input event listener to the html input element.
  input.addEventListener('input', debounce(onInput, 1000))

  // Assign a click event handler whenever the user
  // clicks anywhere in the page.
  document.addEventListener('click', function (event) {
    // If the element that was clicked is not inside
    // or contained within the root html element, then
    // remove the is-active class in the dropdown.
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
}
