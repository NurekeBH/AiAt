import React, { Component } from 'react';
import { TextInput } from 'react-native'
import { Content, Text, View, Button, Toast, Container, Root } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios';
import { TextInputMask } from 'react-native-masked-text'
import {   CirclesLoader } from 'react-native-indicator';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            phone: '',
            password: '',
            re_password: '',
            name: '',
            is_send: false
        }

    }



    sendDataToServer = () => {

        const _props = this.props


        const { name, email, phone } = this.state
        var replaced = phone.replace(/\+/g, '');
        replaced = replaced.replace(/\s/g, '');
        replaced = replaced.replace(/\(/g, '');
        replaced = replaced.replace(/\)/g, '');


        console.log("phone", phone)
        console.log("replaced", replaced)
        const expression = /\S+@\S+/
        if (name === '') {
            Toast.show({ text: "Введите имя", buttonText: "OK", duration: 2500, position: 'top' })
        } else if (email === '' || !expression.test(email.toLowerCase())) {
            Toast.show({ text: "Введите E-mail", buttonText: "OK", duration: 2500, position: 'top' })
            // }else if(password === '' || re_password === '' || password != re_password){
            //     Toast.show({text: "Пароль и его подтверждение не совпадают. Повторите!", buttonText: "OK",duration: 2500, position:'top'})
        } else if (replaced === '' || replaced.length !== 11) {
            Toast.show({ text: "Введите Телефон", buttonText: "OK", duration: 2500, position: 'top' })
        } else {
            console.log('register response')
            this.setState({ is_send: true }, () => {
                axios.post('/api/register/v2', {
                    user_name: name,
                    email: email,
                    phone: replaced
                    // password: password,
                    // password_confirmation:re_password
                })
                    .then((response)  =>{
                        console.log('register response', response)


                        if (response.data.hasOwnProperty('success') && response.data.success.status) {
                            _props.goToAuthPhone(replaced);
                            this.setState({
                                is_send: false,
                            });
                            return
                        }
                        if (response.data.hasOwnProperty('status') && !response.data.status) {
                            if(response.data.error.hasOwnProperty('phone')){
                                Toast.show({ text: strings.register_error_phone, buttonText: "OK", duration: 3000, position: 'top' })
                            }
                            if(response.data.error.hasOwnProperty('email')){
                                Toast.show({ text: strings.register_error_email, buttonText: "OK", duration: 3000, position: 'top' })
                            
                            }
                            this.setState({
                                is_send: false,
                            });
                            return;
                        }

                    })
                    .catch(function (error) {
                        Toast.show({ text: "ошибка сервера", buttonText: "OK", duration: 2500, position: 'top' })
                        console.log('error', error);
                    });
            })

        }
    }


    render() {
        return (
            <View style={{ flex: 1, marginTop: 16 }}>
                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />





                <View style={{ marginLeft: 16, marginRight: 16, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, color: '#A8A8A8' }}>{strings.name}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <TextInput style={{ color: '#000000', height: 45, borderBottomColor: '#FFFFFF', flex: 1, }}
                            placeholder="Aiat"
                            placeholderTextColor="#A8A8A8"
                            underlineColorAndroid='transparent'
                            onChangeText={(name) => this.setState({ name })} />
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                <View style={{ marginLeft: 16, marginRight: 16, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, color: '#A8A8A8' }}>{strings.phone}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <TextInputMask
                            style={{ color: '#000000', height: 45, borderBottomColor: '#FFFFFF', flex: 1, }}
                            type={'custom'}
                            placeholderTextColor="#A8A8A8"
                            keyboardType="phone-pad"
                            placeholder={"+7 (000) 000 00 00"}
                            options={{
                                mask: '+9 (999) 999 99 99'
                            }}
                            value={this.state.phone}
                            onChangeText={text => {
                                this.setState({
                                    phone: text
                                })
                            }}
                            ref={(ref) => this.phoneField = ref}
                        />
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />
                <View style={{ marginLeft: 16, marginRight: 16, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 17, color: '#A8A8A8' }}>E-mail</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <TextInput style={{ color: '#000000', height: 45, borderBottomColor: '#FFFFFF', flex: 1, }}
                            placeholder="example@aiat.kz"
                            placeholderTextColor="#A8A8A8"
                            keyboardType="email-address"
                            underlineColorAndroid='transparent'
                            onChangeText={(email) => this.setState({ email })} />
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: '#E1E2E0', }} />

                {/* <View style={{marginLeft:16, marginRight:16, borderBottomColor: '#F5FCFF',backgroundColor: '#FFFFFF',height:45, flexDirection: 'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:17,color:'#A8A8A8' }}>{strings.password}</Text>
                            </View>
                            <View style={{flex:2}}>
                                <TextInput style={{ height:45, borderBottomColor: '#FFFFFF',flex:1,}}
                                    placeholder="******"
                                    secureTextEntry={true}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(password) => this.setState({password})}/>
                            </View>
                            
                            
                        </View>

                        <View style={{width:'100%', height:1, backgroundColor:'#E1E2E0',}}  />

                        <View style={{marginLeft:16, marginRight:16, borderBottomColor: '#F5FCFF',backgroundColor: '#FFFFFF',height:45, flexDirection: 'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:17,color:'#A8A8A8' }}>{strings.re_password}</Text>
                            </View>
                            <View style={{flex:2}}>
                                <TextInput style={{ height:45, borderBottomColor: '#FFFFFF',flex:1,}}
                                    placeholder="******"
                                    secureTextEntry={true}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(re_password) => this.setState({re_password})}/>
                            </View>
                        </View>
                        
                        <View style={{width:'100%', height:1, backgroundColor:'#E1E2E0'}}  /> */}

                <Button disabled={this.state.is_send}
                    onPress={this.sendDataToServer}
                    style={{ height: 54, marginLeft: 25, marginRight: 25, marginTop: 24, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>
                    {
                        this.state.is_send ?
                            <CirclesLoader color='white' size={30} />
                            :
                            <Text style={{ fontSize: 20, color: 'black' }}>{strings.register_btn}</Text>
                    }

                </Button>



            </View>




        )
    }
}