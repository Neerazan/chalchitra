import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from "react-native";

import { icons } from "@/constants/icons";
import useFetch from "@/hooks/useFetch";
import { fetchPersonDetails, fetchPersonMovieCredits } from "@/services/api";
import MovieCreditCard from "@/components/MovieCreditCard";

interface InfoRowProps {
  label: string;
  value?: string | string[] | null;
  icon?: keyof typeof icons;
  lastItem?: boolean;
}

const InfoRow = ({ label, value, icon, lastItem = false }: InfoRowProps) => (
  <View className={`flex-row items-start py-4 ${!lastItem ? 'border-b border-dark-100' : ''}`}>
    <View className="w-10 h-10 rounded-full bg-dark-200 items-center justify-center">
      {icon && (
        <Image
          source={icons[icon]}
          className="w-5 h-5"
          tintColor="#ffff"
        />
      )}
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-light-200 font-medium text-sm mb-1">{label}</Text>
      <Text className="text-white font-normal text-base">
        {Array.isArray(value) 
          ? value.length > 0 
            ? value.join(" • ") 
            : "N/A"
          : value || "N/A"}
      </Text>
    </View>
  </View>
);

const MAX_BIO_LENGTH = 400;

const PersonDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showFullBio, setShowFullBio] = React.useState(false);

  const { data: person, isLoading } = useFetch(() =>
    fetchPersonDetails(id as string)
  );

  const { data: movieCredits, isLoading: movieCreditsLoading, error: movieCreditsError } = useFetch(() =>
    fetchPersonMovieCredits(id as string)
  );

  if (isLoading)
    return (
      <View className="bg-primary flex-1">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${person?.profile_path}`,
            }}
            className="w-full h-[650px]"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
          <View className="absolute bottom-4 left-4">
            <Text className="text-white font-bold text-3xl">{person?.name}</Text>
            <Text className="text-light-200 text-lg mt-1">
              {person?.known_for_department}
            </Text>
          </View>
        </View>

        <View className="px-4 mt-6">
          {person?.biography && (
            <View className="mb-6">
              <Text className="text-white font-bold text-xl mb-2">Biography</Text>
              <Text className="text-light-200 leading-6">
                {showFullBio 
                  ? person.biography
                  : person.biography.length > MAX_BIO_LENGTH
                    ? person.biography.substring(0, MAX_BIO_LENGTH) + "..."
                    : person.biography
                }
              </Text>
              {person.biography.length > MAX_BIO_LENGTH && (
                <TouchableOpacity 
                  onPress={() => setShowFullBio(!showFullBio)}
                  className="mt-2"
                >
                  <Text className="text-accent font-medium">
                    {showFullBio ? "Show Less" : "Read More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View className="bg-dark-100 rounded-xl p-4">
            <Text className="text-white font-bold text-lg mb-2">Personal Information</Text>
            
            <InfoRow 
              icon="cake"
              label="Birthday" 
              value={person?.birthday} 
            />
            
            {person?.deathday && (
              <InfoRow 
                icon="grave"
                label="Died" 
                value={person?.deathday} 
              />
            )}
            
            <InfoRow 
              icon="home"
              label="Place of Birth" 
              value={person?.place_of_birth} 
            />
            
            <InfoRow 
              icon="person"
              label="Also Known As" 
              value={person?.also_known_as}
            />
            
            <InfoRow
              icon="star"
              label="Popularity"
              value={person?.popularity ? `${Math.round(person.popularity)} points` : null}
              lastItem={true}
            />
          </View>
        </View>

        {
          !movieCreditsLoading && !movieCreditsError && (
            <View className="my-5 px-5">
              <Text className="text-lg text-white font-bold mb-3">Movie Credits</Text>
              <View className="rounded-lg p-4 border-primary border-2 align-center justify-center bg-[#0f0d23]">
                <FlatList
                  horizontal
                  data={movieCredits}
                  renderItem={({ item }: { item: MovieCredits }) => (
                    <MovieCreditCard
                      {...item}
                    />
                  )}
                  keyExtractor={(item: MovieCredits) => item.credit_id.toString()}
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
        className="absolute bottom-10 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center"
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

export default PersonDetails;