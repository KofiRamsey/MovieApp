import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

interface TVShowCardProps {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
}

const TVShowCard = ({ id, name, poster_path, first_air_date, vote_average }: TVShowCardProps) => {
  return (
    <View className="w-[30%] relative">
      <Link href={`/tv/${id}`} asChild>
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

      <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
        {name}
      </Text>

      <View className="flex-row items-center justify-start gap-x-1">
        <Image source={icons.star} className="size-4" />
        <Text className="text-xs text-white font-bold uppercase">
          {Math.round(vote_average / 2)}
        </Text>
      </View>

      <Text className="text-xs text-light-300 font-medium mt-1">
        {first_air_date?.split("-")[0]}
      </Text>
    </View>
  );
};

export default TVShowCard;