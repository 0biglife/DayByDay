import React, {useEffect} from 'react';
//View Module Stacks
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootState} from '../redux/store/reducers';
import {useSelector} from 'react-redux';
import {LogIn, SignUp, Orders, Settings} from '../screens';
import Delivery from './DeliveryStack';
import {useAppDispatch} from '../redux/store';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import userSlice from '../redux/slices/user';
import {Alert} from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const RootStack = () => {
  //!!연산자 : undefined checking : null이나 undefined 면 false 를 반환 !
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  //앱 실행 시 토큰 존재하면 로그인 활성화!
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return; //없으면 탈출
        }
        //있으면 아래 경로로 토큰 쏴주고, 받아온 값을 리덕스로 보관
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.log('RootStack - useEffect - Error : ', error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
    };
    //useEffect는 async 불가기 때문에 별개 함수로 선언하고 호출하는 방식으로 구현
    getTokenAndRefresh();
  }, [dispatch]);

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
        name="Settings"
        component={Settings}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerTitle: '',
        headerTintColor: 'black',
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default RootStack;
