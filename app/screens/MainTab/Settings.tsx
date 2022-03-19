import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import {Alert} from 'react-native';
//API + Storage
import axios, {AxiosError} from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
//Redux
import {useAppDispatch} from '../../redux/store/index';
import userSlice from '../../redux/slices/user';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/reducers';

const Container = styled.View`
  //
`;

const ButtonContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: lightcoral;
  height: 48px;
  border-radius: 8px;
  margin: 20px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: white;
`;

function Settings() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const dispatch = useAppDispatch();

  const onLogout = useCallback(async () => {
    try {
      await axios.post(
        `${Config.API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      Alert.alert('알림', '로그아웃 되었습니다.');
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      );
      await EncryptedStorage.removeItem('refreshToken');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      console.error(errorResponse);
    }
  }, [accessToken, dispatch]);

  return (
    <Container>
      <ButtonContainer onPress={onLogout}>
        <ButtonText>Log Out</ButtonText>
      </ButtonContainer>
    </Container>
  );
}

export default Settings;
