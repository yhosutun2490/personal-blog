<template>
    <div>
      <h1>Color mode: {{ $colorMode.value }}</h1>
    </div>
  </template>
  <script setup>
  const colorMode = useColorMode()
  
  console.log(colorMode.preference)
//   definePageMeta({
//     colorMode: 'light',
//  })
  </script>
  
