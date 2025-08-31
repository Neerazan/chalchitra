import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    isLoading: trendingMoviesLoading,
    error: trendingMoviesError
  } = useFetch(() => getTrendingMovies())

  const {
    data: movies,
    isLoading: moviesLoading,
    error: moviesError
  } = useFetch(() => fetchMovies({
    query: ''
  }))

  return (
    <View
      className="flex-1 bg-primary"
    >
      <Image
        source={images.bg}
        className="w-full absolute z-0"
      />
      <ScrollView
        className="px-5 flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: '100%',
          paddingBottom: 10,
        }}
      >
        <Image
          source={icons.logo}
          className="mx-auto w-12 h-10 mt-20 mb-5"
        />

        {moviesLoading || trendingMoviesLoading ? (
          <ActivityIndicator
            size={'large'}
            color={'#0000ff'}
            className="mt-10 self-center"
          />
        ) : moviesError || trendingMoviesError ? (
          <Text>
            Error: {moviesError?.message || trendingMoviesError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => {
                router.push('/search')
              }}
              placeholder='Search movies...'
            />
            

            {trendingMovies && (
              <View className="mt-10">
                    <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                    <FlatList
                      horizontal
                      data={trendingMovies}
                      renderItem={({ item, index }) => (
                        <TrendingCard movie={item} index={index} />
                      )}
                      keyExtractor={(item: TrendingMovie) => item.movieId.toString()}
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                    />
                    
              </View>
            )}

              <>
                <Text className="text-white font-bold mt-5 mb-3">
                  Latest Movies
                </Text>
                <FlatList
                  data={movies}
                  renderItem={({ item }: { item: Movie }) => (
                    <MovieCard
                      {...item}
                    />
                  )}
                  keyExtractor={(item: Movie) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>
        )}
          </ScrollView>
    </View>
  );
}
