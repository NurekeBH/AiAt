import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { ImageBackground, Platform, Dimensions, Image, StyleSheet, Text, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Container, Body, Content, Button, Icon } from 'native-base';
import { strings } from '../Localization';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import Loader from '../component/Loader'
import Share from 'react-native-share';

isAndroid = Platform.OS === 'android'

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + " час " : "";
  var mDisplay = m > 0 ? m + " минут " : "";
  var sDisplay = s > 0 ? s + " секунд" : "";
  return hDisplay + mDisplay + sDisplay;
}

export default class DetailBook extends Component {


  constructor(props) {
    super(props);
    this.book_id = this.props.navigation.getParam('book_id', '')
    this.state = {
      is_loadingDetailBook: true,
      is_loadingBook: true,

      bookData: [],

      is_favorite: "0",

    };

  }



  componentDidMount() {
    this.loadDetailBookData();
  }


  loadDetailBookData = () => {
    AsyncStorage.getItem("token").then((value) => {
      if (value !== null) {
        console.log("value", value);

        const AuthStr = 'Bearer '.concat(value);
        axios.get('/api/book/' + this.book_id, { headers: { Authorization: AuthStr } })
          .then(response => {
            console.log(response.data);
            this.setState({
              detailBook: response.data.data,
              is_loadingDetailBook: false,
              is_favorite: response.data.data.book.is_favorite
            });
            console.log("is_favorite1", response.data.data.book.is_favorite)

            this.loadBookData();
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        axios.get('/api/book/' + this.book_id)
          .then(response => {
            console.log(response.data);
            this.setState({
              detailBook: response.data.data,
              is_loadingDetailBook: false,
              is_favorite: response.data.data.book.is_favorite
            });

            this.loadBookData();
          })
          .catch(error => {
            console.log(error);
          });
      }
    });



  }



  loadBookData = () => {
    axios.get('/api/book')
      .then(response => {
        console.log(response.data);
        this.setState({
          bookData: response.data.data,
          is_loadingBook: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  PlayBook = () => {
    const _navigation = this.props.navigation;
    AsyncStorage.getItem("token").then((value) => {
      if (value !== null) {
        const AuthStr = 'Bearer '.concat(value);
        axios.get('/api/book/' + this.book_id + '/audio', { headers: { Authorization: AuthStr } })
          .then(response => {
            console.log('PlayBook', response.data);
            if (response.data.status) {
              this.props.navigation.navigate('OpenPlayer', { play: true, book_id: this.book_id })
            } else {
              axios.get('/api/get-status')
                .then(response2 => {
                  console.log('PlayBook2', response2.data);

                  if (response2.data.version == 8 && Platform.OS === 'ios') {

                    _navigation.navigate('OpenPlayer', { play: true, book_id: this.book_id, token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjhkYzUxZjRlMzBhODA5ZjEwNTFmNmFjMmZlN2YyNmI2ZmQyNGQwMmNmY2U4YzFkMDM3N2MyYjJkYjMxMjZiMmVjYjc3NDI5ODY2YzMyMzQ4In0.eyJhdWQiOiIxIiwianRpIjoiOGRjNTFmNGUzMGE4MDlmMTA1MWY2YWMyZmU3ZjI2YjZmZDI0ZDAyY2ZjZThjMWQwMzc3YzJiMmRiMzEyNmIyZWNiNzc0Mjk4NjZjMzIzNDgiLCJpYXQiOjE1NzEyODY2NjcsIm5iZiI6MTU3MTI4NjY2NywiZXhwIjoxNjAyOTA5MDY3LCJzdWIiOiI0Iiwic2NvcGVzIjpbXX0.AnfYzQhR7QeyLdYQAIpGdRB4zHs2LJub1GEu4kNtzR0J8appQMQ-dYi8fz5W3X4eiE3OSVtcJxcyQGcfQGOYPBlleZfNMKJsMWqQu2z-LgAM0FSlJkyvLfunqymzyttrI3daRrThi7owlb7blNWCMLxkHu5suiiCGYOUd-gjnlp1wR-j3zs8jBlifVpljv3NE4VRNG_DPcnLTiZCj90hbHg5RRbMFvg4k7ccomhCsSIUcbHcpOIi5hveuLAgnAKG2Quc9OMR7k-JZs2FXurAGEDls2PrLdbOQ7kFI9JJxok2gRIWmoj86S3cuXrX_lGJhctla13OqhCuKYM6Oj0WUpkZCx0U-jz81Lirg5ARb4PhdKDyBIWWCpC81uPL1lFJmW-KZfWpibX33Zb1iIBkajOxlTRibpPZ2stmnlr_ptkVtmdO0yLQzjwMT0n8cIWHYMzZ43SFtD_FK46mZNmsODbmNvNyptUCzYP4VOdlcswFqxdbqalvO2JssHwPog0r-W9cf6oUmp2uAPpNuuvhyHDrEUhSmqryV2iD1rm5rT8d1SLPdlji5ahTEfSaxaEcs5i-_KMvjhri6lOrVuiKm2riq90_bFw9c7hwbUi09AepEzEwqf4gMqM5K7erElB4ds5SW-nHA9AttIEkbI0sTDxYhWBRnsB0gh53L5yb0LY' })



                  } else {
                    if (response.data.is_trial) {
                      _navigation.navigate('SubscriptionList', { left_day: 0 });
                    } else {
                      _navigation.navigate('Subscript', { book_id: this.book_id, book_image: this.state.detailBook.book.book_image });
                    }
                  }


                })
                .catch(error => {
                });


            }

          })

      } else {
        this.props.navigation.navigate('Auth');
      }
    });





  }

  saveFavorite() {
    AsyncStorage.getItem("token").then((value) => {
      if (value !== null) {
        console.log('saveFavorite', this.state.is_favorite)
        let type = "add"
        if (this.state.is_favorite === "1") {
          type = "delete"
        } else {
          type = "add"
        }
        console.log("  type  " + type + "book_id" + this.book_id);

        const AuthStr = 'Bearer '.concat(value);
        axios.post('/api/book/favorite_book', { 'book_id': this.book_id, "type": type }, { headers: { Authorization: AuthStr } })
          .then(response => {
            console.log('saveFavorite', response.data);
            if (response.data.succses) {
              if (this.state.is_favorite === "1") {
                this.setState({
                  is_favorite: "0"
                });
              } else {
                this.setState({
                  is_favorite: "1"
                });
              }


            }
          })

      } else {
        this.props.navigation.navigate('Auth');
      }
    });


  }

  shareToSocial = () => {


    const shareOptions = {
      title: strings.share_title,
      message: 'AiAt audio book',
      url: 'http://aiat.adekta.kz/share',
      subject: " "
    };

    Share.open(shareOptions);
  }



  _renderBookItem = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => this.onCurrentBookPressedHandler(item)}
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, flexDirection: 'row', }}>
          <FastImage source={{ uri: item.book_image }} style={{ height: 140, width: 110, margin: 16, borderColor: '#E1E2E0', borderWidth: 1 }} />
          <View style={{ flex: 1, marginTop: 16 }}>
            <Text style={{ fontSize: 15, color: 'grey' }}>{item.author}</Text>
            <Text style={{ fontSize: 17, color: 'black' }}>{item.book_name}</Text>
          </View>

        </View>
        <View style={{ width: "100%", height: 1, backgroundColor: '#E1E2E0' }} />
      </View>
    </TouchableWithoutFeedback>

  );


  onCurrentBookPressedHandler(item) {
    this.props.navigation.push('Detail', { book_id: item.book_id })
  }





  render() {
    const dimensions = Dimensions.get('window');
    const imageWidth = dimensions.width;
    const { is_favorite, is_loadingDetailBook, is_loadingBook, bookData } = this.state;
    if (is_loadingDetailBook) {
      return (
        <Loader />
      );
    } else {
      const book = this.state.detailBook.book

      return (
        <Container >
          <Content style={{ backgroundColor: '#F2F3EF' }}>
            <View style={{ flexDirection: 'row', flex: 1, height: imageWidth, width: imageWidth }}>
              <ImageBackground style={{ width: imageWidth, height: imageWidth - 40, resizeMode: 'cover' }} source={{ uri: book.book_image }}>
                <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}></View>



                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white', fontSize: 15 }}>{book.author}</Text>
                  <Text style={{ color: 'white', fontSize: 20, margin: 16, textAlign: 'center', }}>{book.book_name}</Text>
                  <View style={{ width: 48, height: 1, backgroundColor: 'white' }} />
                  <Text style={{ color: 'white', margin: 16, fontSize: 13 }}>{strings.read + book.read_person}</Text>

                </View>

                <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                  <Icon name='arrow-back' style={{ fontSize: 32, color: 'white' }} />
                </Button>

                <Button transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, right: 0 }}
                  onPress={() => this.saveFavorite()}>
                  {
                    is_favorite === "1" ?
                      <Icon name='heart' style={{ fontSize: 26, color: '#FF5005' }} />
                      :
                      <Icon name='heart-empty' style={{ fontSize: 26, color: 'white' }} />
                  }

                </Button>
              </ImageBackground>

              <View style={{ flexDirection: 'row', position: 'absolute', left: 0, right: 0, bottom: 0, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button rounded style={{ width: 64, height: 64, backgroundColor: 'white' }}
                  onPress={this.shareToSocial.bind(this)} >
                  <View style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <SvgUri source={require('./img/book_share.svg')} /> */}
                    <Image source={require('../img/book_share.png')} style={{ width: 21, height: 26 }} />

                  </View>

                </Button>
                <Button rounded onPress={this.PlayBook}
                  style={{ marginLeft: 32, marginRight: 32, width: 80, height: 80, backgroundColor: '#ffcc15' }}>
                  <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                    {/* {this.isAndroid ?
                    //  <SvgUri  svgXmlData={require('./img/book_play.svg')} />
                     :
                    //  <SvgUri  svgXmlData={require('./img/book_play.svg')} />
                    } */}
                    <Image source={require('../img/book_play.png')} style={{ width: 26, height: 30 }} />

                  </View>
                </Button>
                <Button rounded style={{ width: 64, height: 64, backgroundColor: 'white' }}>
                  <View style={{ width: 64, height: 64, justifyContent: 'center', alignItems: 'center' }}>
                    {/* <SvgUri source={require('./img/book_download.svg')} /> */}
                    <Image source={require('../img/book_download.png')} style={{ width: 27, height: 26 }} />

                  </View>
                </Button>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'center', margin: 24 }}>
              <Text style={{ color: 'black', fontSize: 20, }}>О КНИГЕ</Text>
            </View>
            <View style={{ marginLeft: 32, marginRight: 32, marginBottom: 32 }}>
              <Text style={{ color: '#8c6903', fontSize: 14 }}>{book.copyright}</Text>
              {/* <Text style={{ marginTop: 4, color: '#777777', fontSize: 14 }}>{secondsToHms(book.audio_length) + ', ' + book.audio_size + ' мб'}</Text> */}
              <Text style={{ marginTop: 4, color: '#777777', fontSize: 14 }}>{strings.read} <Text style={{ color: '#8c6903', fontSize: 14 }}>{" " + book.read_person}</Text></Text>
              <Text style={{ marginTop: 4, color: 'black', marginTop: 24, fontSize: 16, lineHeight: 24 }}>{book.book_description}</Text>
            </View>

            <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0' }} />

            {
              is_loadingBook ? null :
                <View style={{ marginTop: 24, backgroundColor: 'white' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ fontSize: 28, color: '#333333', margin: 16, textAlign: 'center' }}>{strings.together_listining}</Text>
                  </View>
                  <FlatList
                    data={bookData}
                    renderItem={this._renderBookItem}
                  />
                </View>
            }

          </Content>
        </Container>
      );
    }

  }
}
