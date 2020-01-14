import React, { Component } from 'react';
import { NavigationActions, StackActions } from 'react-navigation';

import AsyncStorage from '@react-native-community/async-storage';
import { TextInput } from 'react-native'
import { Container, Content, Text, View, Button, Item, Left, Body, Right, Icon, Toast, Root } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios';
import { LinesLoader } from 'react-native-indicator';
import SMSVerifyCode from 'react-native-sms-verifycode'


export default class AuthPhone extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: false,
            sms_code: '',
            timer: null,
            seconds_Counter: '119',
            startDisable: true
        };
    }

    componentDidMount() {
        let timer = setInterval(() => {

            if (Number(this.state.seconds_Counter) == 0) {
                clearInterval(this.state.timer);
                this.setState({ startDisable: false })
            }
            var num = (Number(this.state.seconds_Counter) - 1).toString();



            this.setState({
                seconds_Counter: num
            });
        }, 1000);
        this.setState({ timer });

        this.setState({ startDisable: true })
    }


    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    onInputCompleted = (text) => {


        const _navigator = this.props.navigation

        console.log('text', text)
        this.setState({ is_loading: true })

        axios.post('/api/register/check', {
            phone: this.props.navigation.getParam('phone', ''),
            password: text
            // password_confirmation:re_password
        })
            .then(function (response) {
                console.log('response', response)
                if (response.data.status) {
                    console.log('token', response.data.success.token)

                    AsyncStorage.setItem('token', response.data.success.token, () => {

                        const resetAction = StackActions.reset({ index: 0, key: null, actions: [NavigationActions.navigate({ routeName: 'Tab' })] })
                        _navigator.dispatch(resetAction);


                        // _navigator.replace('Profile')
                        console.log('token', 'dddd444')

                    });
                } else {
                    Toast.show({ text: strings.sms_error, buttonText: "OK", duration: 2500, position: 'top' })

                }

            })
            .catch(function (error) {
                console.log('error', error);
            });

    }
    bindRef = (ref) => { this.verifycode = ref; }



    render() {
        const { is_loading, seconds_Counter, startDisable } = this.state;
        let SEC = parseInt(seconds_Counter % 60);
        SEC = SEC < 10 ? "0" + SEC : SEC;
        let MIN = parseInt(seconds_Counter / 60);
        MIN = MIN < 10 ? "0" + MIN : MIN;
        return (
            <Root>
                <Container >
                    <View style={{
                        flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                        shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                    }}>

                        <Text style={{ fontSize: 20, color: 'black' }}>{strings.auth}</Text>
                        <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                            <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                        </Button>
                    </View>
                    <Content style={{ backgroundColor: 'white' }}>

                        {
                            is_loading ?
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <LinesLoader color='#ffcc15' />
                                </View>
                                :
                                null
                        }

                        <View style={{ flex: 1, padding: 16 }}>
                            <Text style={{ fontSize: 17, color: '#A8A8A8', textAlign: 'center', lineHeight: 24 }}>{strings.sms_info}</Text>
                        </View>



                        <SMSVerifyCode
                            ref={this.bindRef}
                            autoFocus
                            verifyCodeLength={5}
                            containerPaddingVertical={10}
                            containerPaddingHorizontal={50}

                            onInputChangeText={text => {
                                this.setState({
                                    sms_code: text
                                })
                            }}


                            onInputCompleted={this.onInputCompleted}

                        />
                        <Text style={{ alignSelf: 'center' }}>{strings.timer_start + MIN + ' : ' + SEC + strings.timer_end}</Text>

                        {
                            !startDisable ?
                                <Button transparent onPress={() => this.props.navigation.goBack()}
                                style={{ height: 54, marginLeft: 25, marginRight: 25, marginTop: 24, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>
                    
                                    <Text style={{ fontSize: 15, color: 'black' }}>{strings.check_nomer}</Text>
                                </Button>
                                :

                                null
                        }


                    </Content>


                </Container>
            </Root>





        )
    }
}