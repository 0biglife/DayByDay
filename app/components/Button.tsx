import React from 'react';
// import {TouchableOpacity, TextInput} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const Container = styled.TouchableOpacity`
  background-color: #000;
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 10px;
  border-radius: 24px;
  margin: 10px;
  width: 85%;
  height: 50px;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.color.buttonText};
  font-size: 16px;
  font-weight: 600;
`;

interface Props {
  title: string;
  onPress: () => void;
}

const Button: React.FC<Props> = props => {
  return (
    <Container onPress={props.onPress}>
      <ButtonText>{props.title}</ButtonText>
    </Container>
  );
};

export default Button;
