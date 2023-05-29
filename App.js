
import { StyleSheet, Text, View, TextInput, Button, Platform } from 'react-native';
import  BottomTabs  from './components/BottomTabs';
import {NavigationContainer} from '@react-navigation/native';
import { useEffect } from 'react';


const App = ()=> {

  return (
    <NavigationContainer>
      <BottomTabs/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    margin: 8
  }
});

export default App;