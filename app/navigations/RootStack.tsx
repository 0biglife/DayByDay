import React from 'react';
//View Module Stacks
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {login} from '../apis/service/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RootStack = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={login} />
    </Stack.Navigator>
  );
};

export default RootStack;
