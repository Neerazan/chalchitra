import { Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const PersonCard = ({ profile_path, character, original_name, id  }: Credits) => {
  return (
    <Link href={`/person/${id}`} asChild>
      <TouchableOpacity className='w-32'>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${profile_path}` }}
          className='w-32 h-48 rounded-lg'
          resizeMode='cover'
        />
        <Text className='text-sm font-bold mt-2 text-light-200'>
          {original_name}
        </Text>
        <Text className='text-xs font-medium text-light-300 uppercase'>
          {character}
        </Text>
      </TouchableOpacity>
    </Link>
  )
}

export default PersonCard