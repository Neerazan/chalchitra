export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_SECRET}`
  }
}


export const fetchMovies = async ({ query } : { query: string }) => {
  const endpoint = query ?
    `${TMDB_CONFIG.BASE_URL}/search/movie?query=${query}` :
    `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`
  
  const reposne = await fetch(endpoint, {
    method: 'GET',
    headers: TMDB_CONFIG.headers
  })

  if (!reposne.ok) {
    throw new Error(`Failed to fetch movies: ${reposne.statusText}`)
  }

  const data = await reposne.json()
  return data.results;
}
