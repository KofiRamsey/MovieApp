import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchPersonDetails } from "@/services/api";

const PersonDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: person, loading } = useFetch(() => fetchPersonDetails(id as string));

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator size="large" color="#fff" className="mt-10" />
      </SafeAreaView>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${person?.profile_path}`,
          }}
          className="w-full h-[400px]"
          resizeMode="cover"
        />
        
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-2xl">{person?.name}</Text>
          <Text className="text-light-200 text-sm mt-2">
            {person?.known_for_department}
          </Text>
          
          {person?.birthday && (
            <Text className="text-light-200 text-sm mt-2">
              Born: {person.birthday}
              {person.deathday && ` - Died: ${person.deathday}`}
            </Text>
          )}
          
          {person?.place_of_birth && (
            <Text className="text-light-200 text-sm mt-2">
              From: {person.place_of_birth}
            </Text>
          )}

          <Text className="text-light-100 mt-4">{person?.biography}</Text>

          {person?.known_for && person.known_for.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-xl mb-3">Known For</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {person.known_for.map((work) => (
                  <TouchableOpacity
                    key={work.id}
                    onPress={() => {
                      router.push('title' in work ? `/movie/[id]?id=${work.id}` : `/tv/[id]?id=${work.id}`);
                    }}
                    className="mr-4"
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w200${work.poster_path}`,
                      }}
                      className="w-24 h-36 rounded-lg"
                      resizeMode="cover"
                    />
                    <Text className="text-white text-xs mt-2" numberOfLines={2}>
                      {'title' in work ? work.title : work.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex-row items-center justify-center"
        onPress={router.back}
      >
        <Image source={icons.arrow} className="size-5 rotate-180" tintColor="#fff" />
        <Text className="text-white font-semibold ml-2">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PersonDetails;