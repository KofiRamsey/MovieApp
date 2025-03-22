import { useState, useEffect } from "react";
import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";

import { icons } from "@/constants/icons";
import { saveMovie, unsaveMovie, isMovieSaved } from "@/services/appwrite";

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

const MovieCard = ({ id, title, poster_path, vote_average, release_date }: MovieCardProps) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, [id]);

  const checkSavedStatus = async () => {
    const status = await isMovieSaved(id);
    setSaved(status);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (saved) {
        await unsaveMovie(id);
      } else {
        await saveMovie({
          id,
          title,
          poster_path,
          vote_average,
          release_date,
        });
      }
      setSaved(!saved);
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-[30%] relative">
      <Link href={`/movie/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Link>

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
      >
        <Image
          source={icons.save}
          className="size-4"
          tintColor={saved ? "#AB8BFF" : "#fff"}
        />
      </TouchableOpacity>

      <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
        {title}
      </Text>

      <View className="flex-row items-center justify-start gap-x-1">
        <Image source={icons.star} className="size-4" />
        <Text className="text-xs text-white font-bold uppercase">
          {Math.round(vote_average / 2)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-light-300 font-medium mt-1">
          {release_date?.split("-")[0]}
        </Text>
        <Text className="text-xs font-medium text-light-300 uppercase">
          Movie
        </Text>
      </View>
    </View>
  );
};

export default MovieCard;
