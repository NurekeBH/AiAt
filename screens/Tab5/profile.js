import React, { Component } from 'react';
import { Image, Platform } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Text, View, Button, Icon, ActionSheet, Root } from 'native-base';
import { strings } from '../../Localization'
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import Loader from '../..//component/Loader';
import { StackActions } from 'react-navigation';
import RNRestart from 'react-native-restart';


var LANGUAGES = [strings.lang_kz, strings.lang_ru, strings.back];
var langs = ["kk", "ru"];
export default class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            data: '',
            sub_visible: false
        };
    }


    componentWillMount() {
        console.log('response', 'componentWillMount')

        AsyncStorage.getItem("token").then((value) => {
            if (value !== null) {
                const AuthStr = 'Bearer '.concat(value);

                axios.get('/api/user', { headers: { Authorization: AuthStr } })
                    .then(response => {

                        if (response.data.status) {

                            this.setState({
                                data: response.data.data,
                                is_loading: false
                            });

                            AsyncStorage.setItem('user_id', response.data.data.user_id + "", () => { console.log('yes') });

                        } else {

                            this.props.navigation.navigate('Auth');
                        }


                    })
                    .catch(error => {

                        this.props.navigation.navigate('Auth');
                    });
            } else {

                this.props.navigation.navigate('Auth');
            }
        });




    }


    componentDidMount() {
        ActionSheet.actionsheetInstance = null;
        axios.get('/api/get-status')
            .then(response => {
                if (response.data.version == 9 && Platform.OS === 'ios') {
                    this.setState({
                        sub_visible: false
                    });

                } else {
                    this.setState({
                        sub_visible: true
                    });
                }


            })
            .catch(error => {
            });
    }

    _onLanguageClick = (buttonIndex) => {


        if (buttonIndex == 2) {
            ActionSheet.hide();
        } else {
            AsyncStorage.setItem('lang', langs[buttonIndex], () => {
                AsyncStorage.setItem('language', langs[buttonIndex] + "", () => {
                    strings.setLanguage(langs[buttonIndex]);
                    RNRestart.Restart();
                });
            });
            
        }


    };




    logOut = () => {
        // RNRestart.Restart();
        AsyncStorage.removeItem('token')
        this.props.navigation.replace('Auth');
    }

    render() {
        const { sub_visible, is_loading, data } = this.state;
        return (
            <Root>
                <Container >
                    <View style={{
                        marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                        shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                    }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>{strings.profile}</Text>
                    </View>
                    <Content style={{ backgroundColor: '#E5E5E5' }}>
                        {
                            is_loading ?
                                <Loader />
                                :
                                <View >
                                    <View style={{ flexDirection: 'row', padding: 16, backgroundColor: 'white' }} >
                                        <FastImage
                                            style={{ width: 54, height: 54, borderRadius: 27 }}
                                            source={{ uri: data.avatar }}
                                        />
                                        <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center', }}>
                                            <Text style={{ fontSize: 17, lineHeight: 20, color: 'black' }}>{data.user_name}</Text>
                                            <Text style={{ fontSize: 15, lineHeight: 18, color: '#777777' }}>{data.email}</Text>
                                        </View>

                                        <Button transparent style={{ width: 48, height: 48, justifyContent: 'center' }}
                                            onPress={() => this.props.navigation.navigate('ChangeProfile',{ user_name: data.user_name, avatar: data.avatar})}>
                                           
                                            {/* <SvgUri  source={require('../img/edit.svg')} />    */}
                                            <Image source={require('../../img/edit.png')} style={{ width: 23, height: 23 }} />

                                        </Button>


                                    </View>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    {
                                        sub_visible ?
                                            <View style={{ backgroundColor: 'white' }} >
                                                <Button transparent style={{ height: 70, }} onPress={() => { this.props.navigation.navigate('SubscriptionList',{left_day: data.left_day}) }}>  
                                                    <View style={{ flexDirection: 'row', padding: 16, }} >
                                                        <Image source={require('../../img/music.png')} style={{ width: 16, height: 16 }} />
                                                        <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center', }}>
                                                            <Text style={{ fontSize: 17, lineHeight: 22, color: '#9E7B00' }}>{strings.subscript}</Text>
                                                            {
                                                                data.left_day === 0 ?
                                                                    <Text style={{ fontSize: 15, lineHeight: 20, color: '#777777' }}> </Text>
                                                                    :
                                                                    <Text style={{ fontSize: 15, lineHeight: 20, color: '#777777' }}>{strings.left + data.left_day + strings.day}</Text>
                                                            }
                                                        </View>
                                                        <Icon name="chevron-right" type="Feather" style={{ color: '#A8A8A8' }} />
                                                    </View>
                                                </Button>
                                            </View>
                                            :
                                            null

                                    }



                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <Text style={{ margin: 16, fontSize: 17, lineHeight: 22, fontWeight: 'bold' }}>{strings.navigation}</Text>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <View style={{ backgroundColor: 'white' }} >
                                        <Button transparent onPress={() => { this.props.navigation.navigate('History') }}>
                                            <View style={{ flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }} >
                                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                                    <Text style={{ fontSize: 17, lineHeight: 22, color: 'black' }}>{strings.history_subscript}</Text>
                                                </View>
                                                <Icon name="chevron-right" type="Feather" style={{ color: '#A8A8A8' }} />
                                            </View>
                                        </Button>
                                    </View>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <View style={{ backgroundColor: 'white' }} >
                                        <Button transparent onPress={() =>
                                            ActionSheet.show(
                                                {
                                                    options: LANGUAGES,
                                                    cancelButtonIndex: 2,
                                                    title: strings.lang_select
                                                },
                                                buttonIndex => this._onLanguageClick(buttonIndex)
                                            )}>
                                            <View style={{ flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }} >
                                                <View style={{ flex: 1, justifyContent: 'center', }}>
                                                    <Text style={{ fontSize: 17, lineHeight: 22, color: 'black' }}>{strings.language}</Text>
                                                </View>
                                                <Icon name="chevron-right" type="Feather" style={{ color: '#A8A8A8' }} />
                                            </View>
                                        </Button>
                                    </View>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <Text style={{ margin: 16, fontSize: 17, lineHeight: 22, fontWeight: 'bold' }}>{strings.support}</Text>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <View style={{ backgroundColor: 'white' }} >
                                        <Button transparent onPress={() => { this.props.navigation.navigate('Report') }}>
                                            <View style={{ flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }} >
                                                {/* <SvgUri  source={require('../img/support.svg')} /> */}
                                                <Image source={require('../../img/support.png')} style={{ width: 29, height: 29 }} />

                                                <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center', }}>
                                                    <Text style={{ fontSize: 17, lineHeight: 22, color: 'black' }}>{strings.message}</Text>
                                                </View>
                                                <Icon name="chevron-right" type="Feather" style={{ color: '#A8A8A8' }} />
                                            </View>
                                        </Button>
                                    </View>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <View style={{ backgroundColor: 'white' }} >
                                        <Button transparent onPress={() => { this.props.navigation.navigate('AboutApp') }}>
                                            <View style={{ flexDirection: 'row', paddingLeft: 16, paddingRight: 16 }} >
                                                {/* <SvgUri  source={require('../img/about.svg')} /> */}
                                                <Image source={require('../../img/about.png')} style={{ width: 29, height: 29 }} />

                                                <View style={{ flex: 1, marginLeft: 16, justifyContent: 'center', }}>
                                                    <Text style={{ fontSize: 17, lineHeight: 22, color: 'black' }}>{strings.about}</Text>
                                                </View>
                                                <Icon name="chevron-right" type="Feather" style={{ color: '#A8A8A8' }} />
                                            </View>
                                        </Button>
                                    </View>

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                                    <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', marginTop: 16 }} />

                                    <View style={{ backgroundColor: 'white' }} >
                                        <Button transparent style={{ height: 44, }}
                                            onPress={() => this.logOut()} >
                                            <Text style={{ fontSize: 17, lineHeight: 22, color: '#FF0000' }}>{strings.exit}</Text>
                                        </Button>
                                    </View>

                                </View>
                        }


                    </Content>

                </Container>
            </Root>





        )
    }
}