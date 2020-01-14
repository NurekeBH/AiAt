import React, { Component, useState } from 'react';
import { Platform, Dimensions, ActivityIndicator, Image, FlatList, ImageBackground, TouchableWithoutFeedback, View, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Text, Toast, Left, Button, Icon, Body, Right, Header, Footer, Root } from 'native-base';

import TrackPlayer, {  useTrackPlayerProgress } from 'react-native-track-player';

import SystemSetting from 'react-native-system-setting'
import Slider from '@react-native-community/slider';
import ProgressBar from './ProgressBar'
import Loader from '../../component/Loader';
import { strings } from '../../Localization';

import Share from 'react-native-share';

isPlaying = false;
isAndroid = Platform.OS === 'android'
volumeListener = null


export default class Player extends Component {

  constructor(props) {
    super(props);
    this.state = {
      volume: 0.5,
      time: 0,
      book_name: '',
      author: '',
      audio_file: '',
      book_image: '',
      is_loading: true,
      audio_length: "100",
      position: 0,
      duration: 0,
      modalVisible: false,
      chaptersBook: [],
      speed: 1,
    };

    this.book_id = this.props.navigation.getParam('book_id', '')
    this.play = this.props.navigation.getParam('play')

  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  async componentDidMount() {

    this.setState({
      volume: await SystemSetting.getVolume(this.state.volType)
    })

    this.getData();

    this._changeSliderNativeVol(this.sliderVol, this.state.volume)
  }
  volumeListener = SystemSetting.addVolumeListener((data) => {
    const volume = this.isAndroid ? data['music'] : data.value
    this._changeSliderNativeVol(this.sliderVol, volume)
    this.setState({
      volume: volume
    })
  })

  // getData() {
  //   if(this.props.play){

  //   }else{

  //   }




  // }

  getData() {


    AsyncStorage.getItem("token").then((value) => {
      if (value !== null) {



        AsyncStorage.getItem("book_id").then((book_id) => {
          if (book_id !== null) {

            if (book_id !== this.book_id) {
              AsyncStorage.setItem('book_id', this.book_id, () => { console.log('yes') });
              book_id = this.book_id;
            }

            console.log("ccccccc000", book_id)
            const AuthStr = 'Bearer '.concat(value);
            axios.get('/api/book/' + book_id + '/audio', { headers: { Authorization: AuthStr } })
              .then(response => {
                var data = response.data.data;

                console.log('data', data);
                var book_image = encodeURI(data.book_image);
                var audio_file = encodeURI(data.audio_file);


                console.log("ccccccc222", this.book_id)




                TrackPlayer.reset()
                TrackPlayer.add({

                  id: "1",
                  url: audio_file,
                  title: data.book_name,
                  artist: data.author,
                  artwork: book_image

                 
                });
                TrackPlayer.setRate(this.state.speed);
                TrackPlayer.play();

                isPlaying = true;




                // SystemSetting.setVolume(0.5, {
                //   type: 'music'
                // })
                this.setState({
                  volume: 0.5
                })
                this.setState({
                  book_name: data.book_name,
                  author: data.author,
                  book_image: data.book_image,
                  audio_length: data.audio_length,
                  is_loading: false
                });



                this.getChapter(book_id);
              }).catch(error => {
                console.log(error);
              });
          } else {
            Toast.show({ text: "Активные книги нет", buttonText: "OK", duration: 2500, position: 'top' })

            this.props.navigation.goBack();
          }
        });
      } else {
        this.props.navigation.navigate('Auth');
      }
    });

  }

  getChapter(book_id) {
    axios.get('/api/book/' + book_id + '/chapters')
      .then(response => {
        console.log('chapters', response);
        this.setState({
          chaptersBook: response.data.data
        });

      })
      .catch(error => {
        console.log(error);
      });
  }




  changeTime(time) {
    this.setState(() => {
      return {
        time: parseFloat(time),
      };
    });
  }


  _changeSliderNativeVol(slider, value) {
    slider.setNativeProps({
      value: value
    })
  }


  componentWillUnmount() {
    SystemSetting.removeListener(this.volumeListener)
  }

  _changeVol(value) {
    SystemSetting.setVolume(value, {
      type: 'music'
    })
    this.setState({
      volume: value
    })
  }


  playFunction = async () => {

    if (isPlaying) {
      isPlaying = false
      this.setState({
      })
      await TrackPlayer.pause();

    } else {
      isPlaying = true
      this.setState({
      })
      await TrackPlayer.play()
    }

  };

  playSeekTo = async (secs) => {
    TrackPlayer.getDuration().then((duration) => {
      TrackPlayer.getPosition().then((position) => {
        const finalPosition = position + secs
        if (finalPosition <= 1) {
          TrackPlayer.seekTo(1)
        } else if (finalPosition >= duration) {
          TrackPlayer.seekTo(duration - 1)
        } else {
          TrackPlayer.seekTo(finalPosition)
        }
      }, (error) => {
      })
    })

  };


  _renderchaptersBookItem = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => this.onCurrentСhaptersPressedHandler(item)}
    >
      <View style={{ backgroundColor: 'white' }}>
        <View style={{ flex: 1, padding: 16, flexDirection: 'row', justifyContent: 'space-between', }}>
          <Text style={{ width: '80%', fontSize: 15, color: 'black' }}>{item.chapter_name}</Text>
          <Text style={{ width: '20%', width: 80, fontSize: 15, color: '#A8A8A8' }}>{item.chapter_time}</Text>
        </View>

        <View style={{ width: "100%", height: 1, backgroundColor: '#E1E2E0' }} />
      </View>
    </TouchableWithoutFeedback>

  );

  onCurrentСhaptersPressedHandler(item) {
    const fields = item.chapter_time.split(':');
    const sec = (parseInt(fields[0], 10) * 60 + parseInt(fields[1], 10)) * 60 + parseInt(fields[2]);

    TrackPlayer.seekTo(sec);
    this.setModalVisible(!this.state.modalVisible);
    if (!isPlaying) {
      isPlaying = true;
      TrackPlayer.play();
    }
  }



  shareToSocial = () => {


    const shareOptions = {
      title: strings.share_title,
      message: 'AiAt audiobook',
      url: 'http://aiat.adekta.kz/share',
      subject: " "
    };

    Share.open(shareOptions);
  }

  playSpeedTo = async () => {
    switch (this.state.speed) {
      case 0.5: this.setState({ speed: 0.75 }); await TrackPlayer.setRate(0.75); break;
      case 0.75: this.setState({ speed: 1 }); await TrackPlayer.setRate(1); break;
      case 1: this.setState({ speed: 1.25 }); await TrackPlayer.setRate(1.25); break;
      case 1.25: this.setState({ speed: 1.5 }); await TrackPlayer.setRate(1.5); break;
      case 1.5: this.setState({ speed: 2 }); await TrackPlayer.setRate(2); break;
      case 2: this.setState({ speed: 2.5 }); await TrackPlayer.setRate(2.5); break;
      case 2.5: this.setState({ speed: 3 }); await TrackPlayer.setRate(3); break;
      case 3: this.setState({ speed: 0.5 }); await TrackPlayer.setRate(0.6); break;
    }
  };





  render() {



    const { chaptersBook, volume, is_loading, book_image } = this.state;
    const dimensions = Dimensions.get('window');
    const imageWidth = dimensions.width;
    const imageHeight = this.isAndroid ? dimensions.width : dimensions.width - 60;



    return (

      <Root>

        <Container >
          <Modal
         
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View  style={{flex:1}}>
              <View style={{ backgroundColor: "white", height: 56, width: '100%', marginTop: 50 }} >

                <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', }}>
                  <Text style={{ fontSize: 20, color: 'black' }}>{strings.content}</Text>
                </View>

                <Button transparent style={{ width: 56, height: 56, position: 'absolute', justifyContent: 'center', left: 0, padding: 8 }} onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                  <Icon name='arrow-back' style={{ color: '#A8A8A8' }} />
                </Button>

                <View style={{ position: 'absolute', bottom: 4, width: '100%', height: 1, backgroundColor: '#E1E2E0' }} />
              </View>
              <FlatList
                data={chaptersBook}
                renderItem={this._renderchaptersBookItem}
              />
              
            </View>




          </Modal>







          <View style={{ flexDirection: 'row', backgroundColor: "white", height: 56 }} >
            <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
              <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
            </Button>
            <Button transparent style={{ width: 56, height: 56, position: 'absolute', justifyContent: 'center', right: 0, padding: 8 }} onPress={() => { this.setModalVisible(true); }}>
              {/* <SvgUri source={require('../img/union.svg')} /> */}
              <Image source={require('../../img/union.png')} style={{ width: 26, height: 17 }} />

            </Button>

          </View>
          {
            is_loading ?
              <Body>
                <Loader />
              </Body>
              :
              <View style={{ backgroundColor: 'white', flex: 1, }}>
                <ImageBackground style={{ width: imageWidth, height: imageHeight, resizeMode: 'cover' }} source={{ uri: book_image }}>
                  <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}></View>
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 15 }}>{this.state.author}</Text>
                    <Text style={{ color: 'white', fontSize: 20, margin: 16, textAlign: 'center', }}>{this.state.book_name}</Text>
                  </View>

                  <ProgressBar />

                </ImageBackground>


                <View style={{ width: '100%', height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, marginLeft: 8, marginRight: 8 }}>
                  <View style={{ width: 40, height: 40, justifyContent: 'center' }} >
                    <Button transparent onPress={this.playSeekTo.bind(this, -1800)} >
                      {/* <SvgUri source={require('../img/play_left.svg')} /> */}
                      <Image source={require('../../img/play_left.png')} style={{ width: 31, height: 22 }} />

                    </Button>
                  </View>
                  <View style={{ width: 40, height: 40, justifyContent: 'center' }} >
                    <Button transparent onPress={this.playSeekTo.bind(this, -30)} >
                      {/* <SvgUri source={require('../img/left30.svg')} /> */}
                      <Image source={require('../../img/left30.png')} style={{ width: 32, height: 32 }} />

                    </Button>
                  </View>
                  <View style={{ width: 55, height: 55, justifyContent: 'center' }} >
                    <Button transparent onPress={this.playFunction.bind()} style={{ marginLeft: 8 }}>

                      {isPlaying
                        ?
                        // <SvgUri source={require('../img/pause.svg')} />
                        <Image source={require('../../img/pause.png')} style={{ width: 40, height: 43 }} />
                        :
                        // <SvgUri source={require('../img/play.svg')} />
                        <Image source={require('../../img/play.png')} style={{ width: 42, height: 50 }} />

                      }
                    </Button>
                  </View>
                  <View style={{ width: 40, height: 40, justifyContent: 'center' }} >
                    <Button transparent onPress={this.playSeekTo.bind(this, 30)} >
                      {/* <SvgUri source={require('../img/right30.svg')} /> */}
                      <Image source={require('../../img/right30.png')} style={{ width: 32, height: 32 }} />

                    </Button>

                  </View>
                  <View style={{ width: 40, height: 40, justifyContent: 'center' }} >
                    <Button transparent onPress={this.playSeekTo.bind(this, 1800)} >
                      {/* <SvgUri source={require('../img/play_right.svg')} /> */}
                      <Image source={require('../../img/play_right.png')} style={{ width: 31, height: 22 }} />


                    </Button>

                  </View>

                </View>
                <View style={{ marginLeft: 16, marginRight: 16, marginTop: 24, }}>
                  <View style={{ width: '100%', height: 25, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ width: 15, height: 15, }} >
                      {/* <SvgUri source={require('../img/volumeoff.svg')} /> */}
                      <Image source={require('../../img/volumeoff.png')} style={{ width: 10.5, height: 15.5 }} />

                    </View>
                    <View style={{ width: 25, height: 25, }} >
                      {/* <SvgUri source={require('../img/volumeon.svg')} /> */}
                      <Image source={require('../../img/volumeon.png')} style={{ width: 25.5, height: 22 }} />

                    </View>
                  </View>

                  <Slider
                    step={0.1}
                    minimumValue={0}
                    maximumValue={1}
                    volume={volume}
                    ref={(sliderVol) => this.sliderVol = sliderVol}
                    onValueChange={(val) => this._changeVol(val)}
                    minimumTrackTintColor='#ffcc15'
                  />
                </View>



              </View>


          }




          <Footer style={{ backgroundColor: 'white' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>

              <Button transparent style={{ width: 80, height: 50, justifyContent: 'center', }}
                onPress={this.playSpeedTo.bind(this)} >
                <Text style={{ fontSize: 16, color: '#777777' }}>{'x' + this.state.speed}</Text>
              </Button>
              <Button transparent style={{ width: 80, height: 50, justifyContent: 'center', }}
                onPress={this.shareToSocial.bind(this)}
              >
                <Image source={require('../../img/book_share.png')} style={{ width: 20, height: 26 }} />
              </Button>
              <Button transparent style={{ width: 80, height: 50, justifyContent: 'center', }}
              >
                <Image source={require('../../img/book_download.png')} style={{ width: 27, height: 26 }} />
              </Button>
            </View>



          </Footer>

        </Container>

      </Root>

    );

  }
}
