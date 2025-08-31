import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import MaskedView from '@react-native-masked-view/masked-view';
import { images } from '@/constants/images';


const TrendingCard = ({ movie: { movieId, movieTitle, posterUrl }, index }: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movieId}`} asChild>
      <TouchableOpacity className='w-32 h-48 rounded-lg'>
        <Image
          source={{ uri: posterUrl }}
          className='w-32 h-48 rounded-lg'
          resizeMode='cover'
        />

        <View className='abosolute bottom-9 -left-3.5 px-2 py-1 rounded-full'>
          <MaskedView maskElement={
            <Text className='text-white text-6xl'>
              {index + 1}
            </Text>
          }>
            <Image
              source={images.rankingGradient}
              className='size-14'
              resizeMode='cover'
            />
          </MaskedView>
        </View>

        <Text className='text-sm font-bold mt-2 text-light-200' numberOfLines={2}>{movieTitle}</Text>
      </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard