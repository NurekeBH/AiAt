import React, { Component } from 'react';
import { ActivityIndicator, Image, TouchableWithoutFeedback, Linking } from 'react-native'
import { Container, Content, Text, View, Button, Item, Left, Body, Right, Icon, } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios';
import Loader from '../../component/Loader';


export default class AboutApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            about_text: ''
        };
    }

    componentDidMount() {
        this.loadAboutData();
    }

    loadAboutData = () => {
        axios.get('/api/text')
            .then(response => {
                console.log(response.data);
                const newFile = response.data.data.map((item, index) => {
                    if (item.text_id === 4) {
                        this.setState({
                            about_text: item.text,
                            is_loading: false
                        });

                    }
                });

            })
            .catch(error => {
                console.log(error);
            });
    }

    _handleOpenWithLinking = () => {
        Linking.openURL('https://buginsoft.kz/');
    }


    render() {
        const { is_loading, about_text } = this.state;
        return (
            <Container >
                <View style={{
                    flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                    shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                }}>

                    <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                    <Text style={{ fontSize: 20, color: 'black' }}>{strings.about}</Text>
                </View>
                <Content style={{ backgroundColor: 'white' }}>
                    {
                        is_loading ?
                            <Loader />
                            :
                            <Text style={{ fontSize: 15, color: 'black', margin: 16, lineHeight: 24 }}>{about_text} </Text>
                    }
                    <TouchableWithoutFeedback onPress={this._handleOpenWithLinking}>
                        <View>
                            <Text style={{ margin: 16, color: '#A9ADB1' }}>Дизайн и разработка</Text>
                            <Image source={require('../../img/buginsoft.png')} style={{ marginLeft: 16, marginBottom: 16, width: 100, height: 22 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </Content>

            </Container>




        )
    }
}