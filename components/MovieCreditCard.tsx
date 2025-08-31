import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCreditCard = ({ poster_path, id, title, release_date, popularity, character }: MovieCredits) => {
  const handlePress = () => {
    router.push(`/movie/${id}`);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="mr-4 mb-4 w-[150px]"
    >
      <View className="relative">
        <Image
          source={{ 
            uri: poster_path 
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://via.placeholder.com/150x225'
          }}
          className="w-full h-[225px] rounded-lg"
          resizeMode="cover"
        />
      </View>
      
      <View className="mt-2">
        <Text className="text-white font-semibold text-base" numberOfLines={1}>
          {title}
        </Text>
        
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-gray-400 text-sm">
            {release_date ? new Date(release_date).getFullYear() : 'N/A'}
          </Text>
          
          <View className="flex-row items-center">
            <Image
              source={require('../assets/icons/star.png')}
              className="w-4 h-4 mr-1"
            />
            <Text className="text-gray-400 text-sm">
              {popularity.toFixed(1)}
            </Text>
          </View>
        </View>

        {character && (
          <Text className="text-gray-400 text-sm mt-1 italic" numberOfLines={1}>
            as {character}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MovieCreditCard;
