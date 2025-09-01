
// Local storage for favorites and ratings
const LS_KEY = 'srg_user_data_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || { favorites: [], ratings: {} } }
  catch { return { favorites: [], ratings: {} } }
}
function save(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)) }

export function toggleFavorite(id) {
  const data = load()
  if (data.favorites.includes(id)) data.favorites = data.favorites.filter(x => x !== id)
  else data.favorites.push(id)
  save(data); return data
}
export function setRating(id, rating) {
  const data = load()
  data.ratings[id] = rating
  save(data); return data
}
export function getData() { return load() }
export function getFavorites() { return load().favorites }
export function getRatings() { return load().ratings }
