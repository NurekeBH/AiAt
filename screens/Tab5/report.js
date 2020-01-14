import React, { Component } from 'react';
import { TextInput } from 'react-native'
import { Container, Content, Text, View, Button, Icon, Root } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage';
import NavigationServiceRepro from '../../navigation/NavigationServiceRepro';


export default class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: '',
        }
        NavigationServiceRepro.setTopLevelNavigator(this.props.navigation);
    }


    sendDataToServer = () => {

        const { message } = this.state


        if (message === '') {
            Toast.show({ text: "Введите имя", buttonText: "OK", duration: 2500, position: 'top' })
        } else {
            AsyncStorage.getItem("token").then((value) => {
                if (value !== null) {
                    const AuthStr = 'Bearer '.concat(value);
                    axios.post('/api/problem', {
                        problem_text: message,
                    }, { headers: { Authorization: AuthStr } })
                        .then(function (response) {
                            console.log(response);
                            NavigationServiceRepro.goBack() 
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    NavigationServiceRepro.goBack() 
                }
            });
        }
    }




    render() {
        return (
            <Root>
 <Container >
                <View style={{
                    flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                    shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                }}>

                    <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                    <Text style={{ fontSize: 20, color: 'black' }}>{strings.message}</Text>
                </View>
                <Content style={{ backgroundColor: '#E5E5E5' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, fontSize: 17, height: 150, backgroundColor: 'white' }}>
                            <TextInput style={{ padding: 16, borderBottomColor: '#FFFFFF', }}
                                placeholder={strings.message_et}
                                numberOfLines={5}
                                multiline
                                underlineColorAndroid='transparent'
                                onChangeText={(message) => this.setState({ message })} />
                        </View>

                        <Button onPress={this.sendDataToServer}
                            style={{ height: 54, flex: 1, marginLeft: 25, marginRight: 25, marginTop: 32, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 20, color: 'black' }}>{strings.send}</Text>
                        </Button>

                    </View>



                </Content>

            </Container>
            </Root>
           




        )
    }
}