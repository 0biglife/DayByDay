import React, {useCallback, useState} from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {Order} from '../redux/slices/order';

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
  flex-direction: row;
  background-color: lightblue;
  justify-content: center;
  align-items: center;
`;

const TouchButton = styled.TouchableOpacity``;

const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
`;

const OrderCell = ({item}: {item: Order}) => {
  const [detail, setDetail] = useState<boolean>(false);
  const toggleDetail = useCallback(() => {
    setDetail(prev => !prev);
  }, []);

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
            <TouchButton>
              <ButtonText>Accept</ButtonText>
            </TouchButton>
            <TouchButton>
              <ButtonText>Reject</ButtonText>
            </TouchButton>
          </ButtonWrapper>
        </DetailView>
      ) : null}
    </Container>
  );
};

export default OrderCell;
