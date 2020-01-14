import React, { Component } from 'react';
import 'react-native-gesture-handler'
import { View, } from 'react-native';
import { Item, Input, Button, Icon, Text } from 'native-base';
import { strings } from '../Localization'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import Active from '../screens/Tab4/Active';
import Dowloaded from '../screens/Tab4/Dowloaded';
import BookMark from '../screens/Tab4/BookMark';
import AsyncStorage from '@react-native-community/async-storage';



  
const Navigator = createAppContainer(createMaterialTopTabNavigator({

    Active: {
        screen: props => <Active {...props} name="1" searchValue={props.screenProps.searchValue} onclickbook={props.screenProps.onclickbook} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            title: strings.active_tab,
            swipeEnabled:false
        })
    },
    Device: {
        screen: props => <Dowloaded {...props} name="2" searchValue={props.screenProps.searchValue} onclickbook={props.screenProps.onclickbook} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            title: strings.device_tab,
            swipeEnabled:false
        })
    },
    BookMark: {
        screen: props => <BookMark {...props} name="3" searchValue={props.screenProps.searchValue} onclickbook={props.screenProps.onclickbook} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            title: strings.like_tab,
            swipeEnabled:false
        })
    },
},
{
    tabBarOptions: {
      activeTintColor: '#333333',
      inactiveTintColor:'#777777',
      upperCaseLabel:false,
      labelStyle: {
        fontSize: 13,
      },
      style: {
        backgroundColor: 'white',
      },
    }
  }
  ));





export default class Comment extends Component {

   

    state = {
        text: ''
    }

    _onSearch = () => {

    };

    onCurrentBookPressedHandler = (item) => {
        console.log('cccccc', item)
        this.props.navigation.navigate('Detail', { book_id: item })
    }



    render() {
        const { is_search, text } = this.state

        return (
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 70 }}>
                        <Item regular style={{ width: '90%', height: 48, borderRadius: 5 }} onPress={() => this.props.navigation.navigate('SearchBook')} >
                            <Icon name="ios-search" />
                            <Text style={{ color: 'grey' }} >{strings.search}</Text>
                        </Item>
                    </View>
                <Navigator screenProps={{ searchValue: this.state.text, onclickbook: this.onCurrentBookPressedHandler }} />
            </View>
        );
    }
}