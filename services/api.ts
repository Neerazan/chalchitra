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


// export const fetchMovies = async ({ query } : { query: string }) => {

// }
// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMWEzZmRlMjUwY2UzMDE0NTBiODM0MDRmNDA3NGNhMCIsIm5iZiI6MTc1NjU0ODAwNS45NzEsInN1YiI6IjY4YjJjYmE1ZjdlNDQzOTlhZTM5NzRmYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ueo1WpM1ql9F9DnXb6y7B7jeWqRNekeORCesc-Ag9pw'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));