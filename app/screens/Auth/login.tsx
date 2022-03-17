import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
//Social Login
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import jwtDecode from 'jwt-decode';

//Token Control
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList, RootStackparamList} from '../../navigations/Types';
import useLogin from '../../hooks/useLogin';
import {CompositeNavigationProp} from '@react-navigation/native';
//Redux
import {useAuthActions} from '../../hooks/useAuthActions';
import {checkMultiple, PERMISSIONS} from 'react-native-permissions';

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

const SocialButtonWrapper = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-top: 10px;
`;

const SocialButton = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: lightgray;
  margin: 10px;
  justify-content: center;
  align-items: center;
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

const SignUpTextView = styled.TouchableOpacity`
  width: 300px;
  height: 20px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const SignUpText = styled.Text`
  font-size: 14px;
  color: lightslategray;
  font-weight: 400;
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

export interface LoginProps {
  navigation: CompositeNavigationProp<
    StackNavigationProp<AuthStackParamList, 'Login'>,
    StackNavigationProp<RootStackparamList>
  >;
}

const loginView: React.FC<LoginProps> = ({navigation}) => {
  const {mutate: login, isLoading: isLoading} = useLogin();
  const [user, setUser] = useState({});
  //login data
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  //redux + hook
  const {authorize} = useAuthActions();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const checkMultiplePermissions = () => {
    checkMultiple([
      PERMISSIONS.IOS.CONTACTS,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
      PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      PERMISSIONS.IOS.MICROPHONE,
    ]).then(response => {
      // console.log('MULTIPLE CHECK RESPONSE : ', response);
      if (response) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
    });
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '21966285335-pd59r4mk54v02nd8v5k2kem3gt1th3fl.apps.googleusercontent.com',
      iosClientId:
        '21966285335-0r4fqc0aoe84encol860j1q7l95mnt1o.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    isSignedIn();
    checkMultiplePermissions();
  }, []);

  const AppleSignIn = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      // performs login request
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    //get user auth
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );
    if (credentialState === appleAuth.State.AUTHORIZED) {
      const {identityToken, email, user} = appleAuthRequestResponse;
      const decodedToken: tokenType = jwtDecode(identityToken!);
      console.log('Apple Login Test!!!');
      console.log('Apple Auth - decodedToken : ', decodedToken);
    }
  };

  const GoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const accessToken = (await GoogleSignin.getTokens()).accessToken;
      //google auth
      console.log('due_______', userInfo);
      console.log('Google Access Token : ', accessToken);
      setUser(userInfo);
    } catch (error) {
      console.log('MESSAGE', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services Not Availbale');
      } else {
        console.log('Some other Error happened');
      }
    }
  };
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userinfo = await GoogleSignin.signInSilently();
      // setUser(userinfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        Alert.alert('User has not signed in yet!');
        console.log('User has not signed in yet!');
      } else {
        //Alert.alert('Something went wrong');
        console.log('Something went wrong');
      }
    }
  };

  const toggleLoginButton = () => {
    if (isLoading) {
      return;
    }
    login({
      identifier,
      password,
    });
  };

  const isActiveReady = () => {
    return identifier.includes('@') && password.length > 1
      ? setIsActive(true)
      : setIsActive(false);
  };

  const onChangeEmail = useCallback(text => {
    setIdentifier(text.trim());
  }, []);

  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(() => {
    if (!identifier || !identifier.trim()) {
      return Alert.alert('이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력하세요');
    }
  }, [identifier, password]);

  return (
    <SafeAreaContainer>
      <Container>
        <InputContainer>
          <Input
            placeholder="이메일을 입력해주세요"
            onChangeText={text => onChangeEmail(text)}
            importantForAutofill="yes"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            value={identifier}
            returnKeyType="next"
            clearButtonMode="while-editing"
            autoCapitalize="none"
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
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
            onSubmitEditing={onSubmit}
          />
        </InputContainer>
        {/* <Input
          placeholder="email"
          onChangeText={text => setIdentifier(text)}
          onKeyPressed={() => isActiveReady()}
        />
        <Input
          placeholder="password"
          onChangeText={text => setPassword(text)}
          onKeyPressed={() => isActiveReady()}
        /> */}
        <LoginButton
          style={{
            backgroundColor: isActive === true ? 'gray' : 'lightgray',
          }}
          disabled={!isActive}
          onPress={() => toggleLoginButton()}>
          <ButtonText>Login</ButtonText>
        </LoginButton>
        <SignUpTextView
          onPress={() =>
            isChecked === true
              ? navigation.navigate('SignUp')
              : navigation.navigate('PermissionAuth')
          }>
          <SignUpText>Sign up here</SignUpText>
        </SignUpTextView>
        <SocialButtonWrapper>
          <SocialButton onPress={() => GoogleSignIn}>
            <ButtonText>G</ButtonText>
          </SocialButton>
          <SocialButton onPress={() => navigation.navigate('MainTab')}>
            <ButtonText>A</ButtonText>
          </SocialButton>
        </SocialButtonWrapper>
      </Container>
    </SafeAreaContainer>
  );
};

export default loginView;
