import React, { Component } from 'react';
import { RefreshControl, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Content, Text, View, Button, Toast, Container, Root } from 'native-base';
import FastImage from 'react-native-fast-image';
import { strings } from '../Localization';
import axios from 'axios';
import Loader from '../component/Loader';


export default class Subscript extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: 'qqq',
            about_text1: '',
            about_text2: '',
            is_loading: true
        }
    }

    componentDidMount() {
        this.loadTextData();
    }
    loadTextData = () => {
        axios.get('/api/text')
            .then(response => {
                console.log(response.data);
                let about_text1, about_text2;
                response.data.data.map((item, index) => {

                    if (item.text_id === 1) {
                        about_text1 = item.text
                    }
                    if (item.text_id === 3) {
                        about_text2 = item.text
                    }
                    console.log("about_text1", about_text1);
                    console.log("about_text2", about_text2);

                });
                this.setState({
                    about_text1: about_text1,
                    about_text2: about_text2,
                    is_loading: false
                });

            })
            .catch(error => {
                console.log(error);
            });
    }

    FreeStart = () => {
        AsyncStorage.getItem("token").then((value) => {
            if (value !== null) {
                const AuthStr = 'Bearer '.concat(value);
                console.log("AuthStr", value)
                axios.get('/api/subscription/free', { headers: { Authorization: AuthStr } })
                    .then(response => {
                        console.log('response', response.data)
                        this.setState({
                            message: response.data.success
                        })
                        if (response.data.success) {
                            this.props.navigation.goBack()
                        } else {
                            Toast.show({ text: response.data.message, buttonText: "OK", duration: 2500, position: 'top' })
                            console.log('response', 'status false')
                        }
                    })
            } else {
                console.log('else')
                this.props.navigation.navigate('Auth');
            }
        });
    }


    render() {
        const { is_loading, about_text1, about_text2 } = this.state;

        return (
            <Root>
                <Container>
                    {
                        is_loading ?
                            <Loader />
                            :
                            <Content>
                                <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
                                    <FastImage
                                        style={{ width: 279, height: 279, margin: 48 }}
                                        source={{ uri: this.props.navigation.getParam('book_image') }}
                                    />
                                    <Text style={{ fontSize: 17, color: 'black' }}>{about_text1}</Text>

                                    <Text style={{ textAlign: 'center', fontSize: 15, color: 'black', marginLeft: 25, marginRight: 25, marginTop: 16 }}>{about_text2}</Text>

                                    <Button onPress={this.FreeStart}
                                        style={{ height: 54, marginLeft: 25, marginRight: 25, marginTop: 16, backgroundColor: '#ffcc15', borderRadius: 3, }}>
                                        <Text style={{ fontSize: 20, color: 'black' }}>{strings.free}</Text>
                                    </Button>

                                    <Button onPress={() => { this.props.navigation.goBack() }}
                                        transparent style={{ height: 40, marginTop: 8, }}>
                                        <Text style={{ fontSize: 15, color: '#9E7B00' }}>{strings.nonow}</Text>
                                    </Button>

                                </View>
                            </Content>

                    }
                </Container>
            </Root>


        )
    }
}