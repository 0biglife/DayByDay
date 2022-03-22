import React, {useCallback} from 'react';
import {Alert, FlatList, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {Order} from '../../redux/slices/order';
import {RootState} from '../../redux/store/reducers';

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  color: black;
`;

const CellContainer = styled.TouchableOpacity`
  background-color: lightgray;
  padding: 10px;
  margin-left: 6px;
  margin-top: 6px;
  margin-right: 6px;
`;

const Orders = () => {
  const orders = useSelector((state: RootState) => state.order.orders);

  const toggleDetail = useCallback(() => {
    Alert.alert('test');
  }, []);

  const renderItem = useCallback(({item}: {item: Order}) => {
    return (
      <Container>
        <CellContainer onPress={toggleDetail}>
          <Title style={{fontSize: 20, color: 'black'}}>
            {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Title>
        </CellContainer>
      </Container>
    );
  }, []);

  return (
    //반복문 or 서버 데이터 받을 떄는 ScrollView 보단 FlatList 를 지향
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={renderItem}
    />
  );
};

export default Orders;
