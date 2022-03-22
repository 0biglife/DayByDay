import axios, {AxiosError} from 'axios';
import React, {useCallback, useState} from 'react';
import {Alert, View} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import orderSlice, {Order} from '../redux/slices/order';
import {useAppDispatch} from '../redux/store';
import {RootState} from '../redux/store/reducers';
import {Config} from 'react-native-config';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainTabParamList} from '../navigations/Types';

const Container = styled.View`
  //
`;

const Title = styled.Text`
  color: black;
  font-size: 18px;
`;

const CellContainer = styled.TouchableOpacity`
  background-color: lightgray;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 16px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 6px;
  margin-top: 6px;
  margin-right: 6px;
`;

const DetailView = styled.View`
  background-color: lightgray;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 16px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: 6px;
  margin-right: 6px;
`;

const ButtonWrapper = styled.View`
  background-color: lightgray;
  border-radius: 10px;
  height: 40px;
  flex-direction: row;
  margin-top: 10px;
  justify-content: space-between;
  justify-content: center;
  align-items: center;
`;

const TouchButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const OrderCell = ({item}: {item: Order}) => {
  //상단 컴포넌트에서 navigation을 인자로 줄 수 있지만 그런 props-dealing은 지양하는게 성능상 좋음(추후 자식 컴포넌트가 생길 것을 고려하여)
  const navigation =
    useNavigation<NativeStackNavigationProp<MainTabParamList>>();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<boolean>(false);
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev);
  }, []);

  const onAccept = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {headers: {Authorization: `Beare ${accessToken}`}},
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      navigation.navigate('Delivery');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      //이미 누가 주문을 잡아간 상태면 백에서 400 에러코드를 보내주고 다시 reject 해준다
      if (errorResponse?.status === 400) {
        Alert.alert(errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }
    } finally {
      setLoading(false);
    }
    dispatch(orderSlice.actions.acceptOrder(item.orderId));
  }, [accessToken, dispatch, item.orderId, navigation]);

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item.orderId]);

  return (
    <Container key={item.orderId}>
      <CellContainer
        activeOpacity={0.8}
        onPress={toggleDetail}
        style={
          !detail
            ? {borderBottomLeftRadius: 10, borderBottomRightRadius: 10}
            : null
        }>
        <Title>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Title>
        <Title>대치동</Title>
        <Title>가락동</Title>
      </CellContainer>
      {detail ? (
        <DetailView>
          <View>
            <Title>데이터 공간</Title>
          </View>
          <ButtonWrapper>
            <TouchButton onPress={onAccept} disabled={loading}>
              <ButtonText>Accept</ButtonText>
            </TouchButton>
            <TouchButton onPress={onReject} disabled={loading}>
              <ButtonText>Reject</ButtonText>
            </TouchButton>
          </ButtonWrapper>
        </DetailView>
      ) : null}
    </Container>
  );
};

export default OrderCell;
