import React, { Component } from 'react';
import { Container, Content, Text, View, Button, Left, Root, Right, Icon, Toast } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios';
import { LinesLoader, CirclesLoader } from 'react-native-indicator';
import { TextInputMask } from 'react-native-masked-text'
export default class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: false,
            phone: '',
            is_send: false
        };
    }

    sendDataToServer = () => {

        const _navigation = this.props.navigation

        const { phone } = this.state
        var replaced = phone.replace(/\+/g, '');
        replaced = replaced.replace(/\s/g, '');
        replaced = replaced.replace(/\(/g, '');
        replaced = replaced.replace(/\)/g, '');


        if (replaced === '' || replaced.length !== 11) {
            Toast.show({ text: "Введите Телефон", buttonText: "OK", duration: 2500, position: 'top' })
        } else {
            this.setState({ is_send: true }, () => {
                axios.post('/api/forgot_password', {
                    phone: replaced
                })
                    .then((response) => {
                        console.log('response ащкпуе', response)

                        if (response.data.success.status) {

                            this.setState({
                                is_send: false,
                            });
                            _navigation.navigate('AuthPhone', { phone: replaced })

                        } else {
                            Toast.show({ text: response.data.message, buttonText: "OK", duration: 2500, position: 'top' })
                            this.setState({
                                is_send: false,
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log('error', error);
                    });
            });

        }
    }





    render() {
        const { is_loading } = this.state;
        return (
            <Root>
                <Container >

                    <View style={{
                        flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                        shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                    }}>

                        <Text style={{ fontSize: 20, color: 'black' }}>{strings.reset}</Text>
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

                        <View style={{ marginLeft: 16, marginRight: 16, marginTop: 24, borderBottomColor: '#F5FCFF', backgroundColor: '#FFFFFF', height: 45, flexDirection: 'row', alignItems: 'center' }}>
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


                        <Button disabled={this.state.is_send}
                            onPress={this.sendDataToServer}
                            style={{ height: 54, flex: 1, marginLeft: 25, marginRight: 25, marginTop: 16, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>
                            {
                                this.state.is_send ?
                                    <CirclesLoader color='white' size={30} />
                                    :
                                    <Text style={{ fontSize: 20, color: 'black' }}>{strings.reset_button}</Text>
                            }

                        </Button>




                    </Content>


                </Container>

            </Root>




        )
    }
}