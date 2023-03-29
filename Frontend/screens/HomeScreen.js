import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  UserIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsVerticalIcon,
  MapPinIcon,
} from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import FeaturedRow from '../components/featuredRow';
import { client, urlFor } from '../sanity';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarIcon } from 'react-native-heroicons/solid';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [input, setInput] = useState('');

  const filteredRestaurants = restaurants.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(input.toLowerCase());
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    client
      .fetch(
        `
       *[_type == "featured"] {
        ...,
        restaurants[]->{
          ...,
          dishes[]->
        }
        }
       `
      )
      .then((data) => {
        setFeaturedCategories(data);
      });
    client
      .fetch(
        `
        *[_type == "restaurant"]{
          ...,
          dishes[] ->,
          type-> {
            name
          }
       }
       `
      )
      .then((data) => {
        setRestaurants(data);
      });
  }, []);

  return (
    <SafeAreaView className="bg-white">
      {/* Header */}
      <View className="flex-row pb-3 items-center mx-4 space-x-2">
        <Image
          source={{
            uri: 'https://links.papareact.com/wru',
          }}
          className="h-7 w-7 bg-gray-300 p-4 rounded-full"
        />

        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">Deliver Now!</Text>
          <View className="flex-row items-center">
            <Text className="font-bold text-xl">Current Location</Text>
            <ChevronDownIcon size={20} color="#00CCBB" />
          </View>
        </View>

        <UserIcon size={35} color="#00CCBB" />
      </View>

      {/* Search */}
      <View className="flex-row items-center space-x-2 pb-2 mx-4">
        <View className="flex-row space-x-2 flex-1 bg-gray-200 p-3 items-center">
          <MagnifyingGlassIcon color="gray" size={20} />
          <TextInput
            value={input}
            onChangeText={(event) => setInput(event)}
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>

        <AdjustmentsVerticalIcon color="#00CCBB" />
      </View>

      {/* Body */}
      <ScrollView
        className="bg-gray-100 flex-1"
        contentContainerStyle={{
          paddingBottom: 150,
        }}
      >
        {/* Categories */}
        <Categories />

        {/* Featured Rows */}

        {input.length === 0 &&
          featuredCategories?.map((category) => (
            <FeaturedRow
              key={category._id}
              id={category._id}
              title={category.name}
              description={category.short_description}
            />
          ))}

        {filteredRestaurants.map((restaurant, index) => (
          <View key={index}>
            <TouchableOpacity
              className="bg-white mt-3 p-4 mx-4 flex-row items-center justify-center"
              onPress={() => {
                navigation.navigate('Restaurant', {
                  key: restaurant.__id,
                  id: restaurant._id,
                  rating: restaurant.rating,
                  imgUrl: restaurant.image,
                  title: restaurant.name,
                  address: restaurant.address,
                  short_description: restaurant.short_description,
                  dishes: restaurant.dishes,
                  genre: restaurant.type?.name,
                  long: restaurant.long,
                  lat: restaurant.lat,
                });
              }}
            >
              <Image
                source={{
                  uri: urlFor(restaurant.image).url(),
                }}
                className="h-20 w-20"
              />
              <View className="px-3 pb-4 flex-1">
                <Text className="font-bold text-lg pt-2">
                  {restaurant.name}
                </Text>
                <View className="flex-row items-center space-x-1">
                  <StarIcon color="green" opacity={0.5} size={22} />
                  <Text className="text-xs text-gray-500">
                    <Text className="text-green-700">{restaurant.rating}</Text>{' '}
                    | {restaurant.type?.name}
                  </Text>
                </View>

                <View className="flex-row items-center space-x-1">
                  <MapPinIcon color="gray" opacity={0.4} size={22} />
                  <Text className="text-xs text-gray-500">
                    Nearby | {restaurant.address}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
