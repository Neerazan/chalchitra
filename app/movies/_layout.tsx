import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="/movies/[id]"
        options={{
          title: 'Movie Details',
          headerShown: false
        }}
      />
    </Stack>
  )
}

export default _layout