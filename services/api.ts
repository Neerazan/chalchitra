export const TMDB_CONFIG = {
  BASE_URL: 'https://api.themoviedb.org/3',
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_SECRET}`
  }
}

export const fetchMovies = async ({ query }: { query: string }) => {
  const response = await fetch(`${TMDB_CONFIG.BASE_URL}/discover/movie?${query}`, {
    method: 'GET',
    headers: TMDB_CONFIG.headers
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results;
}

export const searchMovies = async ({ query }: { query: string }) => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/search/movie?query=${query}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.log("Error: ", error)
    throw error
  }
}

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`)
    }

    const data = await response.json()
    return data;
  } catch (error) {
    console.log("Error: ", error)
    throw error
  }
}

export const fetchPersonDetails = async (personId: string): Promise<PersonDetails> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/person/${personId}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch person details: ${response.statusText}`)
    }

    const data = await response.json()
    return data;
  } catch (error) {
    console.log("Error: ", error)
    throw error
  }
}

export const fetchMovieCredits = async (movieId: string): Promise<Credits[]> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movie credits: ${response.statusText}`)
    }

    const data = await response.json()
    return data.cast;
  } catch (error) {
    console.log("Error: ", error)
    throw error
  }
}

export const fetchPersonMovieCredits = async (personId: string): Promise<MovieCredits[]> => {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/person/${personId}/movie_credits`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch person movie credits: ${response.statusText}`)
    }

    const data = await response.json()
    return data.cast
  } catch (error) {
    console.log("Error: ", error)
    throw error
  }
}