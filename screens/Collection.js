
import React, { Component } from 'react';
import { ActivityIndicator, ImageBackground, FlatList, View, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Container, Button, Icon, Text, Content } from 'native-base';
import axios from 'axios';
import Loader from '../component/Loader'
import FastImage from 'react-native-fast-image';


export default class Collection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loadingBook: true,
            bookData: [],
        };
    }


    componentDidMount() {
        this.loadBookData();
    }


    loadBookData = () => {
        axios.get('/api/book?collection_id=' + this.props.navigation.getParam('item').collection_id)
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


    _renderBookItem = ({ item }) => (
        <TouchableWithoutFeedback
            onPress={() => this.onCurrentBookPressedHandler(item)}
        >
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>
                    <FastImage source={{ uri: item.book_image }} style={{ height: 140, width: 110, margin: 16, borderColor:'#E1E2E0', borderWidth:1 }} />
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

    render() {
        const { is_search, is_loadingBook, bookData } = this.state


        return (
            <Container>

                <View style={{ flexDirection: 'row', width: '100%', backgroundColor: "white", height: 56, justifyContent: 'center', alignItems: 'center' }} >
                   
                    <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32,color: '#A8A8A8' }} />
                    </Button>
                </View>

                <Content style={{ backgroundColor: '#E5E5E5' }}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefreshing}
                            onRefresh={this.refreshList.bind(this)}
                        />
                    }
                >


                    {
                        is_loadingBook ?
                            <Loader />
                            :
                            <View style={{ backgroundColor: 'white' }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                                    <Text style={{ fontSize: 28, color: '#333333', margin: 16 }}>{this.props.navigation.getParam('item').collection_name}</Text>
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
