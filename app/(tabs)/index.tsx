import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/hooks/useFetch";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  const {
    data: trendingMovies,
    isLoading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(() => getTrendingMovies());

  const {
    data: initialMovies,
    isLoading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies
  } = useFetch(() => fetchMovies({
    query: `page=${page}`
  }), true, false); 

  // Set initial movies when first page loads
  useEffect(() => {
    if (initialMovies && page === 1) {
      setMovies(initialMovies);
    }
  }, [initialMovies, page]);

  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore || !hasMorePages || moviesLoading) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newMovies = await fetchMovies({
        query: `page=${nextPage}`
      });

      if (newMovies && newMovies.length > 0) {
        setMovies(prevMovies => [...prevMovies, ...newMovies]);
        setPage(nextPage);
        
        // TMDB typically returns 20 movies per page
        if (newMovies.length < 20) {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [page, isLoadingMore, hasMorePages, moviesLoading]);

  const handleRefresh = useCallback(async () => {
    setPage(1);
    setHasMorePages(true);
    setMovies([]);
    await refetchMovies('page=1');
  }, [refetchMovies]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard {...item} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <Image
        source={icons.logo}
        className="mx-auto w-12 h-10 mt-20 mb-5"
      />
      
      <SearchBar
        onPress={() => {
          router.push('/search');
        }}
        placeholder="Search movies..."
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

      <Text className="text-white font-bold mt-5 mb-3">
        Latest Movies
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="w-full absolute z-0"
      />
      
      {moviesLoading && page === 1 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color="#0000ff"
          />
        </View>
      ) : moviesError || trendingMoviesError ? (
        <ScrollView className="px-5 flex-1">
          <Image
            source={icons.logo}
            className="mx-auto w-12 h-10 mt-20 mb-5"
          />
          <Text className="text-white text-center mt-20">
            Error: {moviesError?.message || trendingMoviesError?.message}
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item: Movie) => item.id.toString()}
          numColumns={3}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.1}
          refreshing={moviesLoading && page === 1}
          onRefresh={handleRefresh}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
          }}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}