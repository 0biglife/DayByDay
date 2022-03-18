import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Alert, TextInput} from 'react-native';
import styled from 'styled-components/native';
//Redux
import DismissKeyboardView from '../../components/DismissKeyboardView';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthParamList} from '../../navigations/Types';

interface tokenType {
  aud: string;
  auth_time: number;
  c_hash: string;
  email: string;
  email_verified: string;
  exp: number;
  iat: number;
  is_private_email: string;
  iss: string;
  nonce: string;
  nonce_supported: boolean;
  sub: string;
}

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${prop => prop.theme.color.bg};
`;

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const LoginButton = styled.TouchableOpacity`
  min-width: 85%;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 6px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const InputContainer = styled.View`
  background-color: white;
  border-color: lightgray;
  border-width: 1.2px;
  border-radius: 24px;
  min-width: 85%;
  margin-top: 10px;
  align-self: center;
`;

const Input = styled.TextInput`
  padding: 15px;
  height: 48px;
  margin-right: 8px;
`;

type SignUpProps = NativeStackScreenProps<AuthParamList, 'SignUp'>;

const SignUp: React.FC<SignUpProps> = ({navigation}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmed, setPasswordConfirmed] = useState<string>('');
  const nameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const passwordConfirmedRef = useRef<TextInput | null>(null);

  const signUpTapped = () => {
    console.log('SignUp View Navigation');
    navigation.pop();
  };

  const isActiveReady = () => {
    return username.length > 1 &&
      email.includes('@') &&
      password.length > 1 &&
      passwordConfirmed.length > 1
      ? setIsActive(true)
      : setIsActive(false);
  };

  const onChangeName = useCallback(text => {
    setUsername(text.trim());
  }, []);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onChangePasswordConfirmed = useCallback(text => {
    setPasswordConfirmed(text.trim());
  }, []);

  const onSubmit = useCallback(() => {
    if (!username || !username.trim()) {
      return Alert.alert('닉네임을 입력해주세요');
    }
    if (!email || !email.trim()) {
      return Alert.alert('이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력하세요');
    }
    if (!passwordConfirmed || !passwordConfirmed.trim()) {
      return Alert.alert('비밀번호 재입력해주세요');
    }
    if (password !== passwordConfirmed) {
      return Alert.alert('비밀번호가 동일하지 않습니다');
    }
  }, [email, password, passwordConfirmed, username]);

  return (
    <DismissKeyboardView>
      <SafeAreaContainer>
        <Container>
          <InputContainer>
            <Input
              placeholder="닉네임을 입력해주세요"
              onChangeText={text => onChangeName(text)}
              importantForAutofill="yes"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="name-phone-pad"
              value={username}
              returnKeyType="next"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={nameRef}
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              onKeyPress={() => isActiveReady()}
            />
          </InputContainer>
          <InputContainer>
            <Input
              placeholder="이메일을 입력해주세요"
              onChangeText={text => onChangeEmail(text)}
              importantForAutofill="yes"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              value={email}
              returnKeyType="next"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={emailRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              onKeyPress={() => isActiveReady()}
            />
          </InputContainer>
          <InputContainer>
            <Input
              placeholder="비밀번호를 입력해주세요"
              onChangeText={text => onChangePassword(text)}
              importantForAutofill="yes"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry
              value={password}
              returnKeyType="send"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={passwordRef}
              onSubmitEditing={() => passwordConfirmedRef.current?.focus()}
              onKeyPress={() => isActiveReady()}
            />
          </InputContainer>
          <InputContainer>
            <Input
              placeholder="비밀번호를 재입력해주세요"
              onChangeText={text => onChangePasswordConfirmed(text)}
              importantForAutofill="yes"
              autoCompleteType="password"
              textContentType="password"
              secureTextEntry
              value={passwordConfirmed}
              returnKeyType="send"
              clearButtonMode="while-editing"
              autoCapitalize="none"
              ref={passwordConfirmedRef}
              onSubmitEditing={onSubmit}
              onKeyPress={() => isActiveReady()}
            />
          </InputContainer>
          <LoginButton
            style={{
              backgroundColor: isActive === true ? 'gray' : 'lightgray',
            }}
            disabled={!isActive}
            onPress={() => signUpTapped()}>
            <ButtonText>Login</ButtonText>
          </LoginButton>
        </Container>
      </SafeAreaContainer>
    </DismissKeyboardView>
  );
};

export default SignUp;
