import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'native-base';
import { strings } from '../Localization'
import TrackPlayer from 'react-native-track-player';



export default class SplashScreen extends Component {


  componentDidMount() {


    TrackPlayer.setupPlayer();
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_STOP
      ]

    });

  

    setTimeout(() => {
      // 45784
      this.props.navigation.replace('Tab')
       }, 2500);

  }


  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffcc15' }}>
        <Button transparent onPress={() => { this.props.navigation.navigate('Tab') }}>
          <Image source={require('../img/logo.png')} style={{ height: 180, width: 180, }} />

        </Button>

      </View>
    );
  }
}
