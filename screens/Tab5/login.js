import React, { Component } from 'react';
import { TextInput } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { Root, Content, Text, View, Button, Toast, Container, } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios'
import { CirclesLoader } from 'react-native-indicator';


export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            is_send: false
        }
    }

    sendDataToServer = () => {

        const _navigator = this.props
        const { email, password } = this.state

        const expression = /\S+@\S+/
        if (email === '' || !expression.test(email.toLowerCase())) {
            Toast.show({ text: "Введите E-mail", buttonText: "OK", duration: 2500, position: 'top' })
        } else if (password === '') {
            Toast.show({ text: "Введите пароль", buttonText: "OK", duration: 2500, position: 'top' })
        } else {
            this.setState({ is_send: true }, () => {
            axios.post('/api/login', {
                email: email,
                password: password
            })
                .then((response) => {
                    console.log('response', response);
                    if (response.data.status) {
                        console.log('value1', response.data.success.token)

                        AsyncStorage.setItem('token', response.data.success.token, () => {

                            _navigator.goToProfile()

                        });



                    } else {
                        Toast.show({ text: strings.login_error, buttonText: "OK", duration: 2500, position: 'top' })
                      
                    }
                    this.setState({
                        is_send: false,
                      });
                }).catch(function (error) {
                    console.log('error', error);
                });
            });
        }


    }



    render() {
        return (
            <View style={{ flex: 1, marginTop: 16 }}>
                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                <View style={{ marginLeft: 16, marginRight: 16, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, color: '#A8A8A8' }}>E-mail</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <TextInput style={{ color: '#000000', height: 45, borderBottomColor: '#ffffff', flex: 1, }}
                            placeholder="example@aiat.kz"
                            placeholderTextColor="#A8A8A8"
                            keyboardType="email-address"
                            underlineColorAndroid='transparent'
                            onChangeText={(email) => this.setState({ email })} />
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                <View style={{ marginLeft: 16, marginRight: 16, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, color: '#A8A8A8' }}>{strings.password}</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                        <TextInput style={{ color: '#000000', height: 45, borderBottomColor: '#FFFFFF', flex: 1, }}
                            placeholder="******"
                            placeholderTextColor="#A8A8A8"
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                            onChangeText={(password) => this.setState({ password })} />
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0' }} />

                <Button disabled={this.state.is_send} onPress={this.sendDataToServer}
                    style={{ height: 54, marginLeft: 25, marginRight: 25, marginTop: 16, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>

                    {
                        this.state.is_send ?
                            <CirclesLoader color='white' size={30}/>
                            :
                            <Text style={{ fontSize: 20, color: 'black' }}>{strings.login_btn}</Text>
                    }
                </Button>

                <Button transparent onPress={() => this.props.onclickbook()}
                    style={{ height: 40, marginTop: 16, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 15, color: 'black' }}>{strings.reset_btn}</Text>

                </Button>


            </View>

        )
    }
}