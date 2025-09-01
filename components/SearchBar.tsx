import { View, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

interface Props {
  onPress?: () => void
  onChangeText?: (text:string) => void
  placeholder: string
  value?: string
  searchInputRef?: any
}

const SearchBar = ({ onPress, onChangeText, placeholder, value, searchInputRef } : Props) => {
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
        value={value}
        onChangeText={onChangeText}
        className='flex-1 ml-2 text-white'
        ref={searchInputRef}
      />
    </View>
  )
}

export default SearchBar