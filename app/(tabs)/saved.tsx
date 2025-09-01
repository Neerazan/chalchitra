import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import useFetch from '@/hooks/useFetch'
import { getSavedMovies } from '@/services/appwrite'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data: movies,
    isLoading: moviesLoading,
    error: moviesError,
    refetch: loadMovie,
  } = useFetch(getSavedMovies)

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovie(searchQuery);
      } else {
        loadMovie();
      }
    }, 500)

    return () => clearTimeout(timeoutId);
  }, [searchQuery])

  return (
    <View className='flex-1 bg-primary'>
      <Image
        source={images.bg}
        className='flex-1 absolute w-full z-0'
        resizeMode='cover'
      />

      <FlatList
        className='px-5'
        data={movies as Movie[]}
        renderItem={({ item }: { item: Movie }) => (
          <MovieCard
            {...item}
          />
        )}
        keyExtractor={(item: Movie) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20'>
              <Image
                source={icons.logo}
                className='w-12 h-10'
              />
            </View>
            <View className='my-5'>
              <SearchBar
                placeholder='Search Movies...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size={'large'}
                color={'#0000ff'}
                className='my-3'
              />
            )}

            {moviesError && (
              <Text className='text-red-500 px-5 py-3'>
                Error: {moviesError.message}
              </Text>
            )}

            {
              !moviesLoading &&
              !moviesError &&
              searchQuery.trim() &&
              movies?.length > 0 && (
                <Text className='text-xl text-white font-bold'>
                  Search result for{' '}
                  <Text className='text-accent'>
                    {searchQuery}
                  </Text>
                </Text>
              )
            }
          </>
        }

        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500'>
                No Movie found..
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default Search