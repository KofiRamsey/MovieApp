import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

interface PersonCardProps {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

const PersonCard = ({ id, name, profile_path, known_for_department }: PersonCardProps) => {
  return (
    <View className="w-[30%] relative">
      <Link href={`/people/${id}`} asChild>
        <TouchableOpacity>
          <Image
            source={{
              uri: profile_path
                ? `https://image.tmdb.org/t/p/w500${profile_path}`
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

      <Text className="text-xs text-light-300 font-medium mt-1">
        {known_for_department}
      </Text>
    </View>
  );
};

export default PersonCard;