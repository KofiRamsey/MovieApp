import React, { forwardRef } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';

interface SearchBarProps extends TextInputProps {}

const SearchBar = forwardRef<TextInput, SearchBarProps>((props, ref) => {
  return (
    <View className="flex-row items-center bg-dark-100 rounded-lg px-4 py-3">
      <TextInput
        ref={ref}
        className="flex-1 text-white text-base"
        placeholderTextColor="#666"
        autoCapitalize="none"
        returnKeyType="search"
        {...props}
      />
    </View>
  );
});

export default SearchBar;
