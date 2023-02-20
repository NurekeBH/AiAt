import React, { Component } from 'react';
import { RefreshControl, Dimensions, View, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Root, Container, Content, Item, Input, Footer, Button, Icon, Text } from 'native-base';
import axios from 'axios';
import Loader from '../../component/Loader';
import { strings } from '../../Localization';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';

export default class Tab1Screen extends Component {


  constructor(props) {
    super(props);
    this.state = {
      is_search: false,
      text: '',
      is_loading: true,
      is_loadingCollection: true,
      is_loadingBook: true,
      sliderData: [],
      collectionData: [],
      bookData: [],
      currentImage: 0,
      fetching_from_server: false,
      isFooter: false,
      isListEnd: false
    };
    this.offset = 1;
  }

  componentDidMount() {
    this.loadSliderData();
  }


  loadSliderData = () => {
    axios.get('/api/slider')
      .then(response => {
        console.log(response.data);
        this.setState({
          sliderData: response.data.data,
          is_loading: false
        });
        this.loadCollectionData();
      })
      .catch(error => {
        console.log('error', error.response);
      });
  }
  loadCollectionData = () => {
    axios.get('/api/collection')
      .then(response => {
        console.log(response.data);
        this.setState({
          collectionData: response.data.data,
          is_loadingCollection: false
        });
        this.loadBookData();
      })
      .catch(error => {
        console.log('error', error.response);
      });
  }


  loadBookData = () => {
    if (!this.state.fetching_from_server && !this.state.isListEnd) {
      this.setState({ fetching_from_server: true }, () => {

        axios.get('/api/book?page=' + this.offset)
          .then(response => {
            console.log('book', response)
            if (response.data.data.length > 0) {
              this.offset = this.offset + 1;
              this.setState({
                is_loadingBook: false,
                bookData: [...this.state.bookData, ...response.data.data],
                isFooter: false,
                fetching_from_server: false,
              });
            } else {
              this.setState({
                is_loadingBook: false,
                isFooter: false,
                fetching_from_server: false,
                isListEnd: true,
              });
            }


          })
          .catch(error => {
            console.log('error', error.response);
          });
      })
    }
  }



  refreshList = () => {
    this.setState({
      sliderData: [],
      collectionData: [],
      bookData: [],
      is_loading: true,
      is_loadingCollection: true,
      fetching_from_server: false,
      isFooter: false,
      isListEnd: false,
      isRefreshing: false
    });
    this.offset = 1;

    this.loadSliderData();
  }


  _renderItem({ item, index }) {
    return (
      <TouchableWithoutFeedback
        key={index}
        onPress={() => this.onCurrentImagePressedHandler(item)}
      >
        <FastImage
          style={{ width: '100%', height: 200 }}
          source={{ uri: item.slider_image }}
        />
      </TouchableWithoutFeedback>
    );
  }
  onCurrentImagePressedHandler(item) {
    this.props.navigation.navigate('Detail', { book_id: item.slider_book_id })
  }

  get pagination() {
    const { sliderData, currentImage } = this.state;
    return (
      <Pagination
        dotsLength={sliderData.length}
        activeDotIndex={currentImage}
        dotColor={'#FFCC15'}
        inactiveDotColor={'#777777'}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 4,
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
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
    this.props.navigation.navigate('Detail', { book_id: item.book_id })
  }


  _renderHorizontalItem = ({ item }) => (
    <TouchableWithoutFeedback
      onPress={() => this.onCurrentCollectionPressedHandler(item)}
    >
      <View style={{ width: 162, margin: 8, justifyContent: 'center', alignItems: "center" }}>
        <View style={{ height: 176, width: 160, justifyContent: 'center', alignItems: "center", }}>
          <FastImage source={{ uri: item.book_image.image_2 }} style={{ position: 'absolute', bottom: 0, height: 120, width: 120, }} />
          <FastImage source={{ uri: item.book_image.image_1 }} style={{ position: 'absolute', bottom: 8, height: 140, width: 140, }} />
          <FastImage source={{ uri: item.book_image.image_0 }} style={{ position: 'absolute', bottom: 16, height: 160, width: 160, }} />
        </View>

        <Text numberOfLines={2} style={{ lineHeight: 20, marginTop: 16, justifyContent: 'center', alignItems: "center", fontSize: 17, }}>{item.collection_name}</Text>
      </View>
    </TouchableWithoutFeedback>
  );

  onCurrentCollectionPressedHandler(item) {
    this.props.navigation.navigate('Collection', { item: item })
  }





  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };


  render() {
    const { sliderData, is_loading, is_loadingCollection, collectionData, is_loadingBook, bookData } = this.state;
    const dimensions = Dimensions.get('window');
    const imageWidth = dimensions.width;
    return (
      <Root>
        <Container>
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 70 }}>

            <Item regular style={{ width: '90%', height: 48, borderRadius: 5 }} onPress={() => this.props.navigation.navigate('SearchBook')} >
              <Icon name="ios-search" />
              <Text style={{ color: 'grey' }} >{strings.search}</Text>
            </Item>
          </View>

          <Content style={{ backgroundColor: '#E5E5E5' }}
            refreshControl={
              <RefreshControl refreshing={this.state.isRefreshing}
                onRefresh={this.refreshList.bind(this)}
              />
            }
            onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent) && !is_loadingBook) {
                this.setState({
                  isFooter: true
                })
                this.loadBookData();
              }
            }}
          >

            {
              is_loading ?
                <Loader />
                :
                <View  >
                  <Carousel
                    ref={c => (this._ref = c)}
                    data={sliderData}
                    renderItem={item => this._renderItem(item)}
                    onSnapToItem={index => this.setState({ currentImage: index })}
                    layout={'default'}
                    sliderWidth={imageWidth}
                    itemWidth={imageWidth}
                  />

                  {this.pagination}

                </View>
            }

            {
              is_loadingCollection ?
                null :
                <View >
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 28, color: '#333333', margin: 16 }}>{strings.new_collection}</Text>
                  </View>
                  <FlatList
                    data={collectionData}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this._renderHorizontalItem}
                  />
                </View>
            }
            {
              is_loadingBook ? null :
                <View style={{ marginTop: 24, backgroundColor: 'white' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
                    <Text style={{ fontSize: 28, color: '#333333', margin: 16 }}>{strings.now_listining}</Text>
                  </View>
                  <FlatList
                    data={bookData}
                    renderItem={this._renderBookItem}
                  />
                </View>
            }

          </Content>
        </Container>
      </Root>

    );
  }
}
