import React from 'react';
import styled from 'styled-components/native';
import {Keyboard, Platform} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const KeyboardAvoidingCustomView = styled.KeyboardAvoidingView`
  width: 100%;
  height: 100%;
`;

//KeyboardAvoidingView의 behavior는
// iOS : padding
// AOD : positiion 으로 해야 적용이 된다.
const DismissKeyboardView = ({children, ...props}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingCustomView
      {...props}
      behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
      {children}
    </KeyboardAvoidingCustomView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
