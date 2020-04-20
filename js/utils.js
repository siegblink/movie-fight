// Declare a reusable debounce function that will
// delay or rate limit a callback function.
function debounce(func, delay = 1000) {
  // Declare a timeout ID variable.
  let timeoutId
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(function () {
      func.apply(null, args)
    }, delay)
  }
}
