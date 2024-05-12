import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/register';
import UserDetails from './components/UserDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'blue',
          },
          headerTintColor: 'white',
          headerLeft:null
        }}
      >
            <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Your Details' component={UserDetails} />
        <Stack.Screen name='Register' component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
