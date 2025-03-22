import { useState, useEffect } from "react";
import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";
import MovieCard from "@/components/MovieCard";

interface SavedMovie {
  $id: string;
  movie_id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedMovies();
  }, []);

  const loadSavedMovies = async () => {
    try {
      setLoading(true);
      const movies = await getSavedMovies();
      setSavedMovies(movies.map(doc => ({
        $id: doc.$id,
        movie_id: doc.movie_id,
        title: doc.title,
        poster_path: doc.poster_path,
        vote_average: doc.vote_average,
        release_date: doc.release_date
      })));
    } catch (err) {
      setError("Failed to load saved movies");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-5">
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-5">
        <Text className="text-red-500 text-center mt-10">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-5">
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-white text-xl font-bold">Saved Movies</Text>
        <Image source={icons.save} className="w-6 h-6" tintColor="#fff" />
      </View>

      {savedMovies.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-base">No saved movies yet</Text>
        </View>
      ) : (
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => (
            <MovieCard
              id={item.movie_id}
              title={item.title}
              poster_path={item.poster_path}
              vote_average={item.vote_average}
              release_date={item.release_date}
            />
          )}
          keyExtractor={(item) => item.$id}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 16,
            marginBottom: 16,
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Save;
