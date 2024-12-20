import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MonthOverview from './MonthOverview';
import { monthlyData } from '../../data/monthlyData';

const OverviewScreen = () => {
  return (
    <FlatList
      data={monthlyData}
      renderItem={({ item }) => <MonthOverview data={item} />}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default OverviewScreen;
