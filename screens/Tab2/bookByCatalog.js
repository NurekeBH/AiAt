
import React, { Component } from 'react';
import { FlatList, View, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Container, Button, Icon, Text, Content, Item, Input, } from 'native-base';
import { strings } from '../../Localization';
import axios from 'axios';
import Loader from '../../component/Loader'
import FastImage from 'react-native-fast-image';




export default class BookByCatalog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      is_search: false,
      is_loadingBook: true,
      bookData: [],
      tabs: null,
      fetching_from_server: false,
      isFooter: false,
      isListEnd: false
    };
    this.offset = 1;
  }


  componentDidMount() {
    this.loadBookData();
  }




  loadBookData = () => {
    if (!this.state.fetching_from_server && !this.state.isListEnd) {
      this.setState({ fetching_from_server: true }, () => {

        console.log('uuuuuuuu', '/api/book?genre_id=' + this.props.navigation.getParam('item').genre_id + '&page=' + this.offset)
        axios.get('/api/book?genre_id=' + this.props.navigation.getParam('item').genre_id + '&page=' + this.offset)
          .then(response => {
            console.log('BookByCatalog: ', response)
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
            console.log(error);
          });
      })
    }
  }


  refreshList = () => {
    this.setState({
      is_search: false,
      is_loadingBook: true,
      bookData: [],
      tabs: null,
      fetching_from_server: false,
      isFooter: false,
      isListEnd: false,
      isRefreshing: false
    });
    this.offset = 1;
    this.loadBookData();
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



  _onSearch = () => {

  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  render() {
    const { is_search, is_loadingBook, bookData } = this.state


    return (
      <Container>


        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: "white", height: 56 }} >
          <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ fontSize: 20 }}>{this.props.navigation.getParam('item').genre_name}</Text>
          </View>
          <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
            <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
          </Button>


        </View>


        <Content style={{ backgroundColor: '#E5E5E5' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
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
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "white", height: 60 }} >
            <Item regular style={{ width: 343, height: 48, borderRadius: 5 }}>
              <Icon name="ios-search" />
              <Input
                returnKeyType={'search'} numberOfLines={1} placeholder={strings.search} onSubmitEditing={() => this._onSearch()}
                onChangeText={(text) =>
                  this.setState({
                    is_search: true,
                    text,
                  })}
              />
              {
                is_search ?
                  <Button transparent onPress={() => {
                    this.setState({
                      is_search: false,
                      text: '',
                    })
                  }}>
                    <Icon name="md-close" />
                  </Button>
                  :
                  null
              }


            </Item>
          </View>
          {is_search ?
            this.state.tabs :
            <View style={{ flex: 1 }}>

              {
                is_loadingBook ? <Loader /> :
                  <FlatList
                    data={bookData}
                    renderItem={this._renderBookItem}
                  />

              }
            </View>

          }





        </Content>
      </Container>
    );
  }




}
