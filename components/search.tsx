import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, usePathname, router } from "expo-router";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
  initialQuery?: string;
  onQueryChange?: (query: string) => void;
}

const Search = ({ initialQuery = "", onQueryChange }: SearchProps) => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(initialQuery || params.query || "");
  const [isFocused, setIsFocused] = useState(false);

  // Sync with params changes
  useEffect(() => {
    const currentQuery = params.query || initialQuery || "";
    setSearch(currentQuery);
  }, [params.query, initialQuery]);

  const debouncedSearch = useDebouncedCallback((text: string) => {
    router.setParams({ query: text });
    onQueryChange?.(text);
  }, 500);

  const handleSearch = (text: string) => {
    setSearch(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearch("");
    router.setParams({ query: "" });
    onQueryChange?.("");
  };

  return (
    <View
      className="flex flex-row items-center justify-between px-4 rounded-2xl border mt-5 py-3"
      style={{ borderColor: isFocused ? "#BA1D84" : "#8C8E98" }}
    >
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" style={{ tintColor: isFocused ? "#BA1D84" : "#000000" }} />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder="Search Products"
          placeholderTextColor="#999999"
          className="text-sm font-poppins text-black-300 ml-2 flex-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {search && search.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="ml-2">
            <Image
              source={icons.close}
              className="size-5"
              style={{ tintColor: "#BA1D84" }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Search;
