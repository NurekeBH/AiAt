
import React, { Component } from 'react';
import { AsyncStorage, View, TouchableWithoutFeedback, RefreshControl } from 'react-native';

import { Container, Text, Content, List, Button, Item, Icon, Root,Toast } from 'native-base';
import { strings } from '../../Localization';
import axios from 'axios';
import Loader from '../../component/Loader'
import FastImage from 'react-native-fast-image'


export default class Tab2Screen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            responseData: [],
            isRefreshing: false,
            selected: 1
        };
    }

    componentDidMount() {
       
        AsyncStorage.getItem("lang").then((value) => {
            console.log('value lang - ', value)
            if (value !== null && value === 'ru') {
                this.setState({
                    selected: 2,
                });
            }
        });

        this.loadJSONData();
    }


    loadJSONData = () => {
        axios.get('/api/genre')
            .then(response => {
                console.log(response.data);
                this.setState({
                    responseData: response.data.data,
                    is_loading: false
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    refreshList = () => {
        this.setState({
            responseData: [],
            is_loading: true
        });

        this.loadJSONData();
    }

    onCurrentCatalogPressedHandler(item) {
        this.props.navigation.navigate('BookByCatalog', { item: item })
    }


    selectedClick = (selected) => {

        if (selected === 1) {
            AsyncStorage.setItem('lang', "kz", () => {
                axios.defaults.headers.common['lang'] = 'kz'
                this.setState({
                    selected: 1,
                    responseData: [],
                    is_loading: true
                });
                this.loadJSONData();
            });
        } else {
            AsyncStorage.setItem('lang', "ru", () => {
                axios.defaults.headers.common['lang'] = 'ru'
                this.setState({
                    selected: 2,
                    responseData: [],
                    is_loading: true
                });
                this.loadJSONData();
            });
        }


    }



    render() {
        const { is_loading, responseData, selected } = this.state
        console.log(responseData);
        if (is_loading) {
            return (
                <Loader />
            );
        } else {
            return (
                <Root>
 <Container >

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
>
    <View style={{ backgroundColor: 'white' }}>

        {
            selected === 1 ?
                <View style={{ margin: 16, borderRadius: 8, height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5' }}>
                    <View style={{ flex: 1, borderRadius: 8, height: 32, margin: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontSize: 16, color: 'black', }}>{strings.lang_kz}</Text>
                    </View>
                    <Button transparent style={{ flex: 1, height: 32, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => this.selectedClick(2)} >
                        <Text style={{ fontSize: 15, color: 'black', }}>{strings.lang_ru}</Text>
                    </Button>

                </View>
                :
                <View style={{ margin: 16, borderRadius: 8, height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5' }}>
                    <Button transparent style={{ flex: 1, height: 32, alignItems: 'center', justifyContent: 'center', }}
                        onPress={() => this.selectedClick(1)} >
                        <Text style={{ fontSize: 15, color: 'black', }}>{strings.lang_kz}</Text>
                    </Button>
                    <View style={{ flex: 1, borderRadius: 8, height: 32, margin: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
                        <Text style={{ fontSize: 16, color: 'black', }}>{strings.lang_ru}</Text>
                    </View>

                </View>
        }

        <List>
            {responseData.map((item, position) => (

                <TouchableWithoutFeedback onPress={() => this.onCurrentCatalogPressedHandler(item)} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <View>
                        <FastImage source={{ uri: item.genre_image }} style={{ width: '100%', height: 80, resizeMode: 'cover' }}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: '#fff' }}>{item.genre_name}</Text>
                            </View>
                        </FastImage>
                    </View>
                </TouchableWithoutFeedback>


            ))
            }
        </List>
    </View>
</Content>
</Container>
                </Root>
               
            );
        }
    }

}
