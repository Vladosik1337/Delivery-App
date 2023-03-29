import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import CategoriesCard from './categoriesCard';
import { client, urlFor } from '../sanity';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    client
      .fetch(
        `
       *[_type == "category"] 
       `
      )
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category) => (
        <CategoriesCard
          key={category._id}
          imgUrl={urlFor(category.image).width(200).url()}
          title={category.name}
        />
      ))}
    </ScrollView>
  );
};

export default Categories;
