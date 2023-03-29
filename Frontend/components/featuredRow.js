import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import RestaurantCard from './restaurantCard';
import { client } from '../sanity';

const FeaturedRow = ({ id, title, description }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `
       *[_type == "featured" && _id == $id] {
          ...,
          restaurants[]->{
            ...,
            dishes[]->,
            type-> {
              name
            }
          }
        }[0]
       `,
        { id }
      )
      .then((data) => {
        setRestaurants(data?.restaurants);
      });
  }, []);

  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">{title}</Text>
        <ArrowRightIcon color="#00CCBB" />
      </View>
      <Text className="text-xs text-gray-500 px-4">{description}</Text>

      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {/* RestaurantCards */}

        {restaurants.map((restaurant) => {
          // console.log(restaurant.dishes);
          return (
            <RestaurantCard
              key={restaurant._id}
              id={restaurant._id}
              imgUrl={restaurant.image}
              rating={restaurant.rating}
              title={restaurant.name}
              address={restaurant.address}
              short_description={restaurant.short_description}
              dishes={restaurant.dishes}
              genre={restaurant.type?.name}
              long={restaurant.long}
              lat={restaurant.lat}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
