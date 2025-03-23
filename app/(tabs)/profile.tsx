import { useState, useEffect } from "react";
import { View, Text, Image, TextInput, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { getSavedMovies, getUserName, saveUserName } from "@/services/appwrite";
import MovieCard from "@/components/MovieCard";

interface SavedMovie {
  $id: string;
  movie_id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const Profile = () => {
  const [name, setName] = useState("");
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userName, movies] = await Promise.all([
        getUserName(),
        getSavedMovies(),
      ]);
      
      if (userName) setName(userName);
      setSavedMovies(movies.map(doc => ({
        $id: doc.$id,
        movie_id: doc.movie_id,
        title: doc.title,
        poster_path: doc.poster_path,
        vote_average: doc.vote_average,
        release_date: doc.release_date
      })));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async (text: string) => {
    setName(text);
    try {
      setSavingName(true);
      await saveUserName(text);
    } catch (error) {
      console.error("Error saving name:", error);
    } finally {
      setSavingName(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="px-5 py-4">
        <View className="flex-row items-center gap-3">
          <Image source={icons.person} className="size-10" tintColor="#fff" />
          <TextInput
            className="flex-1 text-white text-lg p-2 border-b border-gray-600"
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={handleNameChange}
          />
          {savingName && (
            <ActivityIndicator size="small" color="#fff" />
          )}
        </View>

        {name && (
          <Text className="text-white text-xl mt-4">
            Welcome, <Text className="text-accent font-bold">{name}</Text>!
          </Text>
        )}
      </View>

      <View className="flex-1 px-5">
        <Text className="text-white text-lg font-bold mb-4">Your Saved Movies</Text>
        
        {savedMovies.length > 0 ? (
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
        ) : (
          <Text className="text-gray-500 text-center mt-4">
            No saved movies yet
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
