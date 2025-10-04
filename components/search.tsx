import { View, Text, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, usePathname, router } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const path = usePathname();
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  const debouncedSearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    500
  );

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  return (
    <View className="flex flex-row items-center justify-between px-4 rounded-2xl border mt-5 py-3" 
    style={{ borderColor: '#C996BD'}}>
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search Products"
          placeholderTextColor="#999999"
          className="text-sm font-poppins text-black-300 ml-2 flex-1"
        />
      </View>
    </View>
  );
};

export default Search;
