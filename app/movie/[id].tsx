import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PersonCard from "@/components/PersonCard";
import { icons } from "@/constants/icons";
import useFetch from "@/hooks/useFetch";
import { fetchMovieCredits, fetchMovieDetails } from "@/services/api";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { toggleBookmark, getSavedMovie } from "@/services/appwrite";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isBoorkmarked, setIsBoorkmarked] = useState(false);

  const { data: movie, isLoading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: credits, isLoading: creditsLoading, error: creditsError } = useFetch(() =>
    fetchMovieCredits(id as string)
  );

  useEffect(() => {
    if (movie) {
      getSavedMovie(movie.id).then(savedMovie => {
        if (savedMovie) {
          setIsBoorkmarked(true)
        }
      })
    }
  }, [movie])

  if (isLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );
  
  const handleBookmark = async () => {
    const response = await toggleBookmark(movie as MovieDetails)
    if (response) {
      setIsBoorkmarked(!isBoorkmarked)
    }
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[650px]"
            resizeMode="cover"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="justify-between flex-row w-full">
            <View>
              <Text className="text-white font-bold text-xl">{movie?.title}</Text>
              <View className="flex-row items-center gap-x-1 mt-2">
                <Text className="text-light-200 text-sm">
                  {movie?.release_date?.split("-")[0]} •
                </Text>
                <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
              </View>

              <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
                <Image source={icons.star} className="size-4" />

                <Text className="text-white font-bold text-sm">
                  {Math.round(movie?.vote_average ?? 0)}/10
                </Text>

                <Text className="text-light-200 text-sm">
                  ({movie?.vote_count} votes)
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity className="flex items-center justify-center" onPress={handleBookmark}>
                <Ionicons
                  name={isBoorkmarked ? 'bookmark' : 'bookmark-outline'}
                  size={34}
                  color="#AB8BFF"
                  className="mt-1"
                />
              </TouchableOpacity>
            </View>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>

        {
          !creditsLoading && !creditsError && (
            <View className="my-5 px-5">
              <Text className="text-lg text-white font-bold mb-3">Top Billed Cast</Text>
              <View className="rounded-lg p-4 border-primary border-2 align-center justify-center bg-[#0f0d23]">
                <FlatList
                  horizontal
                  data={credits as Credits[]}
                  renderItem={({ item }: { item: Credits }) => (
                    <PersonCard
                      {...item}
                    />
                  )}
                  keyExtractor={(item: Credits) => item.credit_id.toString()}
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={
                    <View className="mt-10 px-5">
                      <Text className="text-center text-gray-500">
                        No Credits Found
                      </Text>
                    </View>
                  }

                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            </View>
          )
        }
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;