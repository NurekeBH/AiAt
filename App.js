import React, { Component, Fragment } from 'react';
import AppNavigator from './navigation/index'
import {
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Root } from 'native-base';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { strings } from './Localization'

export default class App extends Component {


  componentDidMount(){



    axios.defaults.baseURL = 'https://aiat.kz';

    AsyncStorage.getItem("lang").then((value) => {
     console.log('1value lang - ',value)
     
     if (value !== null) 
     { 
       axios.defaults.headers.common['lang'] = value
     }else{
       axios.defaults.headers.common['lang'] = 'kz'
     }
   });
 
   AsyncStorage.getItem("language").then((value) => {
     console.log('value language - ',value)
     if(value!=null){
       strings.setLanguage(value);
   }else{
       strings.setLanguage('kk');
   }
   });

  }

  render() {
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#ffcc15' }} />
        <StatusBar barStyle="light-content" backgroundColor='#ffcc15' />
        <View style={{ flex: 1, }}>
          <Root>
            <AppNavigator  />
          </Root>
        </View>
      </Fragment>


    );
  }
}
