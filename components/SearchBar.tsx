import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
  onPress?: () => void
  placeholder: string
}

const SearchBar = ({ onPress, placeholder } : Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-2'>
      <Image
        source={icons.search}
        className='size-5'
        tintColor={"#ab8bff"}
        resizeMode='contain'
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        placeholderTextColor={'#ab8bff'}
        value=''
        onChangeText={(text) => { }}
        className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

export default SearchBar