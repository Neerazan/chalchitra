import { Client, ID, Query, TablesDB } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const METRICS_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_TABLE_ID!;
const SAVED_MOVIES_TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_TABLE_ID!;

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client)

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: METRICS_TABLE_ID,
      queries: [
        Query.equal('searchTerm', query),
      ]
    })

    if (result.total > 0) {
      const existingMovie = result.rows[0];
      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: METRICS_TABLE_ID,
        rowId: existingMovie.$id,
        data: {
          count: existingMovie.count + 1,
        }
      })
    } else {
      await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: METRICS_TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          count: 1,
          movieId: movie.id,
          movieTitle: movie.title,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        }
      })
    }
  } catch (error) {
    console.log("Error: ", error)
  }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: METRICS_TABLE_ID,
      queries: [
        Query.orderDesc('count'),
        Query.limit(5)
      ]
    })
    return result.rows as unknown as TrendingMovie[]
  } catch (error) {
    console.log("Error: ", error)
    return undefined
  }
}

export const toggleBookmark = async ({ id, poster_path, title, vote_average, vote_count, release_date }: MovieDetails) => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: SAVED_MOVIES_TABLE_ID,
      queries: [
        Query.equal('id', id)
      ]
    })

    if (result.total > 0) {
      const response = await tablesDB.deleteRow({
        databaseId: DATABASE_ID,
        tableId: SAVED_MOVIES_TABLE_ID,
        rowId: result.rows[0].$id
      })

      return response
    } else {
      const response = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: SAVED_MOVIES_TABLE_ID,
        rowId: ID.unique(),
        data: {
          id,
          poster_path,
          title,
          vote_average,
          vote_count,
          release_date
        }
      })
      return response
    }
  } catch (error) {
    console.log("Error: ", error)
    return undefined
  }
}

export const getSavedMovies = async (query?: string): Promise<Movie[] | undefined> => {
  try {
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(20),
    ];

    if (query) {
      queries.unshift(Query.search('title', query));
    }

    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: SAVED_MOVIES_TABLE_ID,
      queries: queries,
    })

    return result.rows as unknown as Movie[]
  } catch (error) {
    console.log("Error: ", error)
    return undefined
  }
}

export const getSavedMovie = async (id: number): Promise<Movie | undefined> => {
  try {
    const result = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: SAVED_MOVIES_TABLE_ID,
      queries: [
        Query.equal('id', id)
      ]
    })

    return result.rows[0] as unknown as Movie
  } catch (error) {
    console.log("Error: ", error)
    return undefined
  }
}