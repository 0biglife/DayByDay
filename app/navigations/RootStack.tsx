import React from 'react';
//View Module Stacks
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {login} from '../apis/service/auth';
import {LogIn, SignUp} from '../screens';
import Orders from '../screens/MainTab/Orders';
import Delivery from './DeliveryStack';
import Settings from '../screens/MainTab/Settings';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RootStack = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: '주문 목록'}}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{title: '업무'}}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="LogIn"
        component={LogIn}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
