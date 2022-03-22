import React, {useCallback} from 'react';
import {Alert, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
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

  return (
    <ScrollView>
      {orders.map(v => (
        <Container>
          <CellContainer onPress={toggleDetail}>
            <Title style={{fontSize: 20, color: 'black'}}>{v.orderId}</Title>
          </CellContainer>
        </Container>
      ))}
    </ScrollView>
  );
};

export default Orders;
