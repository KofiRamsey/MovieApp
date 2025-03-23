import { useState, useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { Movie, TVShow, Person, SearchResult } from '@/types/content';

import useFetch from "@/services/usefetch";
import { fetchContent } from "@/services/api";

import SearchBar from "@/components/SearchBar";
import MovieDisplayCard from "@/components/MovieCard";
import TVShowCard from "@/components/TVShowCard";
import PersonCard from "@/components/PersonCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contentType, setContentType] = useState<'movie' | 'tv' | 'person'>('movie');
  const searchInputRef = useRef<TextInput>(null);

  const {
    data: searchResults = [] as SearchResult[],
    loading,
    error,
    refetch: loadContent,
    reset,
  } = useFetch(() => fetchContent({ query: searchQuery, type: contentType }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      reset();
    }
  };

  const handleContentTypeChange = (type: typeof contentType) => {
    setContentType(type);
    // Keep focus on the search input after changing content type
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        loadContent();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, contentType]);

  const renderContent = ({ item }: { item: SearchResult }) => {
    if ('name' in item && 'first_air_date' in item && contentType === 'tv') {
      return <TVShowCard {...(item as TVShow)} />;
    }
    if ('name' in item && 'known_for_department' in item && contentType === 'person') {
      return <PersonCard {...(item as Person)} />;
    }
    if ('title' in item && contentType === 'movie') {
      return <MovieDisplayCard {...(item as Movie)} />;
    }
    return null;
  };

  const renderHeader = () => (
    <>
      <View className="w-full flex-row justify-center mt-20 items-center">
        <Image source={icons.logo} className="w-12 h-10" />
      </View>

      <View className="my-5">
        <SearchBar
          ref={searchInputRef}
          placeholder={`Search for ${
            contentType === 'tv' ? 'a TV show' : contentType === 'person' ? 'a person' : 'a movie'
          }`}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View className="flex-row justify-center space-x-4 my-3">
        {['movie', 'tv', 'person'].map((type) => (
          <TouchableOpacity
            key={type}
            onPress={() => handleContentTypeChange(type as typeof contentType)}
            className={`px-4 py-2 rounded-full ${
              contentType === type ? 'bg-accent' : 'bg-dark-100'
            }`}
          >
            <Text className="text-white capitalize">
              {type === 'tv' ? 'TV Shows' : `${type}s`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && <ActivityIndicator size="large" color="#fff" className="my-3" />}

      {error && (
        <Text className="text-red-500 px-5 my-3">
          Error: {error instanceof Error ? error.message : 'Something went wrong'}
        </Text>
      )}

      {!loading && !error && searchQuery.trim() && searchResults && searchResults.length > 0 && (
        <Text className="text-xl text-white font-bold px-5">
          Search Results for <Text className="text-accent">{searchQuery}</Text>
        </Text>
      )}
    </>
  );

  const EmptyListComponent = () => {
    if (loading || error) return null;
    
    return (
      <View className="mt-10 px-5">
        <Text className="text-center text-gray-500">
          {searchQuery.trim() ? "No results found" : "Start typing to search"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderContent}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={EmptyListComponent}
      />
    </SafeAreaView>
  );
};

export default Search;
