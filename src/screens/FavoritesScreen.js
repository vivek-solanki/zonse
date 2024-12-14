import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true); // Show loading indicator
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const toggleFavorite = async (item) => {
    // Remove item from favorites
    const updatedFavorites = favorites.filter((fav) => fav.id !== item.id);
    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderItem = ({ item }) => (
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
        <Text style={styles.removeIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No favorites added yet.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
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
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
  },
  removeIcon: {
    marginLeft: 'auto',
    fontSize: 20,
    color: 'red',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default FavoritesScreen;
