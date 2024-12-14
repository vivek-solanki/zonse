import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://reqres.in/api/users?page=2");
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites");
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (item) => {
    const updatedFavorites = favorites.some((fav) => fav.id === item.id)
      ? favorites.filter((fav) => fav.id !== item.id)
      : [...favorites, item];

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      fetchData();
    }, [])
  );

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some((fav) => fav.id === item.id);
    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View>
            <Text
              style={styles.name}
            >{`${item.first_name} ${item.last_name}`}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    color: "#666",
  },
  favoriteIcon: {
    marginLeft: "auto",
    fontSize: 20,
  },
});

export default HomeScreen;
