import IonIcon from 'react-native-vector-icons/Ionicons';
import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import {MainTabParamList, RootStackparamList} from '../../navigations/Types';
// HTTP
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MenuModal, SettingModal} from '../../components';
import {clearToken} from '../../apis/service/client';
import authStorage from '../../apis/storages/authStorage';
//Redux
import {useAuthActions} from '../../hooks/useAuthActions';
import {useUser} from '../../hooks/useUser';
import authStateStorage from '../../apis/storages/authStateStorage';
import {setConstantValue} from 'typescript';

const HeaderIconView = styled.View`
  flex-direction: row;
  width: 54px;
  justify-content: space-between;
  justify-items: center;
  /* background-color: lightblue; */
  margin-right: 8px;
`;

//Header UI
const HeaderView = styled.View`
  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: flex-start;
  background-color: ${props => props.theme.color.bg};
`;

const AnimatedViewHeader = Animated.createAnimatedComponent(HeaderView);

const ProfileImage = styled.Image`
  width: 110px;
  height: 110px;
  border-radius: 75px;
  align-self: flex-start;
  border-width: 0.5px;
  border-color: lightgray;
  margin-left: 20px;
`;

const UserTopInfoContainer = styled.View`
  flex-direction: row;
`;

const UserInfoColumnWrapper = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const UserInfoWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  /* background-color: lightblue; */
  padding-left: 8px;
  padding-top: 6px;
  margin-left: 20px;
  margin-right: 20px;
`;

const UserInfoSubWrapper = styled.View`
  flex-direction: column;
  align-items: center;
  /* background-color: lightgoldenrodyellow; */
`;

const TopInfo = styled.Text`
  font-size: 16px;
  font-weight: 500;
  /* background-color: lightcoral; */
`;

const DownInfo = styled.Text`
  font-size: 16px;
  font-weight: 400;
  /* background-color: lightcyan; */
  margin-top: 10px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
  padding-left: 60px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 10px;
  /* background-color: lightgray; */
`;

const UserButton = styled.TouchableOpacity`
  flex: 1;
  height: 32px;
  border-width: 1px;
  border-color: lightgray;
  background-color: ${prop => prop.theme.color.bg};
  border-radius: 6px;
  margin-left: 6px;
  justify-content: center;
`;

const ButtonText = styled.Text`
  align-self: center;
  font-size: 16px;
  font-weight: 500;
`;

const BodySection = styled.View`
  flex: 1;
  background-color: lightgray;
`;

const windowWidth = Dimensions.get('window').width;
const titleSize = windowWidth / 3;

const TitleImage = styled.View`
  width: ${titleSize * 2}px;
  height: ${titleSize * 2}px;
  background-color: lightgray;
`;

const SubImage1 = styled.View``;

const imageSource = require('../../assets/images/profileDefault.jpeg');

interface ProfileProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackparamList>
  >;
}

const userName = 'Giriboy';

const Profile: React.FC<ProfileProps> = ({navigation}) => {
  //Redux + hook
  const {logout} = useAuthActions();
  const {user} = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [settingModalVisible, setSettingModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const PostingModal = () => {
      navigation.navigate('Upload');
      setModalVisible(false);
    };

    navigation.setOptions({
      headerTitle: userName,
      headerRight: () => {
        return (
          <HeaderIconView>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <IonIcon name="add" size={24} color="black" />
              <MenuModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                firstFunction={() => PostingModal()}
                secondFunction={() => PostingModal()}
                thirdFunction={() => PostingModal()}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSettingModalVisible(true)}>
              <IonIcon name="ellipsis-vertical-sharp" size={24} color="black" />
              <SettingModal
                modalVisible={settingModalVisible}
                setModalVisible={setSettingModalVisible}
                firstFunction={() => PostingModal()}
                secondFunction={() => PostingModal()}
                thirdFunction={() => PostingModal()}
              />
            </TouchableOpacity>
          </HeaderIconView>
        );
      },
    });
  }, [modalVisible, navigation, settingModalVisible]);

  const userLogout = () => {
    logout();
    clearToken();
    authStorage.clear();
    authStateStorage.setFalse();
    console.log('Logout Succeed');
    navigation.navigate('AuthStack');
  };

  console.log(user?.thumbnailUrl);

  const parseData = user?.thumbnailUrl;
  const imgData = JSON.stringify(parseData);
  return (
    <>
      <AnimatedViewHeader>
        <UserTopInfoContainer>
          <ProfileImage source={user?.thumbnailUrl ? imgData : imageSource} />
          <UserInfoColumnWrapper>
            <UserInfoWrapper>
              <UserInfoSubWrapper>
                <TopInfo>MBTI</TopInfo>
                <DownInfo>ENFJ</DownInfo>
              </UserInfoSubWrapper>
              <UserInfoSubWrapper>
                <TopInfo>Follwer</TopInfo>
                <DownInfo>20</DownInfo>
              </UserInfoSubWrapper>
              <UserInfoSubWrapper>
                <TopInfo>Following</TopInfo>
                <DownInfo>17</DownInfo>
              </UserInfoSubWrapper>
            </UserInfoWrapper>
            <ButtonWrapper>
              <UserButton
                onPress={() =>
                  navigation.navigate('EditProfile', {
                    name: userName,
                    imageSource: imageSource,
                  })
                }>
                <ButtonText>Edit</ButtonText>
              </UserButton>
            </ButtonWrapper>
          </UserInfoColumnWrapper>
        </UserTopInfoContainer>
      </AnimatedViewHeader>
      <BodySection>
        <TitleImage></TitleImage>
      </BodySection>
    </>
  );
};

export default Profile;

/*
// Button Wrapper 

      <UserButtonWrapper>
        <UserButton
          onPress={() =>
            navigation.navigate('EditProfile', {
              name: '',
              imageSource: imageSource,
            })
          }>
          <UserButtonText>Edit Profile</UserButtonText>
        </UserButton>
        <UserButton onPress={() => navigation.navigate('Message')}>
          <UserButtonText>결제하기</UserButtonText>
        </UserButton>
        <UserButton onPress={() => userLogout()}>
          <UserButtonText>로그아웃</UserButtonText>
        </UserButton>
      </UserButtonWrapper>

*/