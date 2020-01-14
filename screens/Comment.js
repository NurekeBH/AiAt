import React, { Component } from 'react';
import { View, } from 'react-native';
import { Item, Input, Button, Icon, Text } from 'native-base';
import { strings } from '../Localization'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Active from './Tab4/Active';

const Tab = ({ name, searchValue , onclickbook}) => (
  <View style={{ flex: 1 }}>
    <Text>{name}</Text>
    <Text>{`Searching: ${searchValue || '...'}`}</Text>
    <Button transparent onPress={() => {
      
      onclickbook(17);

    }}>
      <Icon name="md-close" />
    </Button>
  </View>
);

const Wines = (props) => (<Active name="Wines Page" searchValue={props.screenProps.searchValue} onclickbook = {props.screenProps.onclickbook} />);
const Stores = (props) => (<Tab name="Stores Page" searchValue={props.screenProps.searchValue} onclickbook = {props.screenProps.onclickbook} />);
const Vineyards = (props) => (<Tab name="Vineyards Page" searchValue={props.screenProps.searchValue} onclickbook = {props.screenProps.onclickbook} />);
const Restaurants = (props) => (<Tab name="Restaurants Page" searchValue={props.screenProps.searchValue} onclickbook = {props.screenProps.onclickbook} />);

const Navigator = createAppContainer(createMaterialTopTabNavigator({
  Wines,
  Stores,
  Vineyards,
  Restaurants
}));





export default class Comment extends Component {
  state = {
    text: ''
  }

  _onSearch = () => {

  };

  onCurrentBookPressedHandler = (item) => {
    console.log('cccccc',item)
    this.props.navigation.navigate('Detail', { book_id: item })
  }



  render() {
    const { is_search, text } = this.state

    return (
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 70 }}>

          <Item regular style={{ width: '90%', height: 48, borderRadius: 5 }}>
            <Icon name="ios-search" />
            <Input
              returnKeyType={'search'} value={text} numberOfLines={1} placeholder={strings.search} onSubmitEditing={() => this._onSearch()}
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
        <Navigator screenProps={{ searchValue: this.state.text, onclickbook : this.onCurrentBookPressedHandler }} />
      </View>
    );
  }
}