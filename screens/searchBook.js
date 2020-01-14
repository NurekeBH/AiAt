
import React, { Component } from 'react';
import { FlatList, ImageBackground, StatusBar, View, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Container, Button, Icon, Text, Content, List, ListItem, Item, Input, } from 'native-base';
import axios from 'axios';
import Loader from '../component/Loader'
import FastImage from 'react-native-fast-image';
import { strings } from '../Localization';

export default class SearchBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loadingBook: false,
            bookData: [],
            is_search: true,
            text:''
        };
    }



    _renderBookItem = ({ item }) => (
        <TouchableWithoutFeedback
            onPress={() => this.onCurrentBookPressedHandler(item)}
        >
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <FastImage source={{ uri: item.book_image }} style={{ height: 140, width: 110, margin: 16, borderColor:'#E1E2E0', borderWidth:1 }}  />
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



    loadBookData = () => {
        console.log('ttttt', this.state.text)
        axios.get('/api/book?search=' + this.state.text)
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


    refreshList = () => {
        this.setState({
            is_loadingBook: true,
            bookData: [],
        });

        this.loadBookData();
    }



    render() {
        const { is_loadingBook, bookData,text, is_search } = this.state


        return (
            <Container>

                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', height: 70 }}>

                    <Item regular style={{ width: '90%', height: 48, borderRadius: 5 }}  >
                        <Icon name="ios-search" />
                        <Input
                            returnKeyType={'search'} value={text} numberOfLines={1} placeholder={strings.search} onSubmitEditing={() => {this.setState({is_loadingBook:true}); this.loadBookData()}}
                            autoFocus={true}
                            onChangeText={(text) =>
                                this.setState({
                                    is_search: true,
                                    text,
                                })}
                        />
                        {
                            is_search ?
                                <Button transparent onPress={() => {
                                    this.props.navigation.goBack()
                                }}>
                                    <Icon name="md-close" />
                                </Button>
                                :
                                null
                        }
                    </Item>
                </View>


                {
                    is_loadingBook ?
                        <Loader />
                        :
                        <View style={{ backgroundColor: 'white' }}>
                            <FlatList
                                data={bookData}
                                renderItem={this._renderBookItem}
                            />
                        </View>
                }




            </Container>
        );

    }

}
