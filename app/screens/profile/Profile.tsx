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
  height: 220px;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${props => props.theme.color.bg};
  /* background-color: lightskyblue; */
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;

const AnimatedViewHeader = Animated.createAnimatedComponent(HeaderView);

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 75px;
  align-self: flex-start;
  border-width: 0.5px;
  border-color: lightgray;
`;

const UserTopInfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const UserInfoWrapper = styled.View`
  flex: 3;
  flex-direction: row;
  justify-content: space-around;
  align-self: center;
  padding-left: 10px;
`;

const UserInfoItem = styled.View`
  align-items: center;
  /* justify-content: center; */
`;

const UserInfoTitle = styled.Text`
  font-size: 14px;
  padding-top: 2px;
  color: darkgray;
`;

const UserInfoSubTitle = styled.Text`
  font-weight: 600;
  font-size: 16px;
`;

const InfoContainer = styled.View`
  padding: 4px;
  width: 100%;
`;

const UserName = styled.Text`
  font-size: 16px;
  padding-top: 10px;
  font-weight: 500;
`;

const UserDescription = styled.Text`
  font-size: 14px;
  padding-top: 4px;
`;

const UserButtonWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding-top: 4px;
`;

const UserButton = styled.TouchableOpacity`
  width: 30%;
  height: 32px;
  border-width: 1px;
  border-color: lightgray;
  background-color: ${prop => prop.theme.color.bg};
  border-radius: 6px;
  justify-content: center;
`;

const UserButtonText = styled.Text`
  padding: 6px;
  font-size: 14px;
  align-self: center;
`;

const imageSource = require('../../assets/images/profileDefault.jpeg');

interface ProfileProps {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Profile'>,
    NativeStackNavigationProp<RootStackparamList>
  >;
}

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
    <AnimatedViewHeader>
      <UserTopInfoContainer>
        <ProfileImage source={user?.thumbnailUrl ? imgData : imageSource} />
        <UserInfoWrapper>
          <UserInfoItem>
            <UserInfoSubTitle>273</UserInfoSubTitle>
            <UserInfoTitle>Post</UserInfoTitle>
          </UserInfoItem>
          <UserInfoItem>
            <UserInfoSubTitle>10.2M</UserInfoSubTitle>
            <UserInfoTitle>Follower</UserInfoTitle>
          </UserInfoItem>
          <UserInfoItem>
            <UserInfoSubTitle>821</UserInfoSubTitle>
            <UserInfoTitle>Following</UserInfoTitle>
          </UserInfoItem>
        </UserInfoWrapper>
      </UserTopInfoContainer>
      <InfoContainer>
        <UserName>{user ? user.username : '로그인 필요'}</UserName>
        <UserDescription>JustMusic Company, WYBH</UserDescription>
      </InfoContainer>
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
    </AnimatedViewHeader>
  );
};

export default Profile;
