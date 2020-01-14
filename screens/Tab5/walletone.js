import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Text, View, Button, Icon, } from 'native-base';
import { WebView } from 'react-native-webview';
import Loader from '../../component/Loader';


export default class WalletOne extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            htmlData: ''
        };
    }

    componentDidMount() {
        this.GetData()
    }

    GetData() {

        AsyncStorage.getItem("user_id").then((value) => {
            if (value !== null) {

                console.log('user_id', value);
                const bodyFormData = new FormData();
                bodyFormData.append('WMI_MERCHANT_ID', '173132504294');
                bodyFormData.append('WMI_PAYMENT_AMOUNT', this.props.navigation.getParam('sub_cost'));
                bodyFormData.append('WMI_CURRENCY_ID', '398');
                bodyFormData.append('WMI_PTENABLED', 'CreditCardKZT');
                bodyFormData.append('WMI_CULTURE_ID', 'ru-RU');
                bodyFormData.append('WMI_DESCRIPTION', this.props.navigation.getParam('sub_name'));
                bodyFormData.append('WMI_SUCCESS_URL', 'http://aiat.adekta.kz/api/subscription/success?user_id=' + value + '&subscription_id=' + this.props.navigation.getParam('subscription_id'));
                bodyFormData.append('WMI_FAIL_URL', 'http://aiat.adekta.kz/api/subscription/fail');



                fetch('https://wl.walletone.com/checkout/checkout/Index', {
                    method: 'POST',
                    headers: { 'Content-Type': 'multipart/form-data' },
                    body: bodyFormData,
                }).then(response => {

                    console.log(response.url)
                    this.setState({
                        htmlData: response.url,
                        is_loading: false,

                    });
                })
            } else {
                this.props.navigation.goBack()
            }
        })
    }




    render() {

        const { is_loading, htmlData } = this.state

        return (
            <Container >
                <View style={{
                    flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                    shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                }}>
                    <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                    <Text style={{ fontSize: 20, color: 'black' }}>Оплата</Text>
                </View>
                <View style={{ backgroundColor: '#E5E5E5', flex: 1 }}>

                    {is_loading ?
                        <Loader />
                        :
                        <WebView
                            originWhitelist={['*']}
                            javaScriptEnabledAndroid={true}
                            javaScriptEnabled={true}
                            source={{ uri: htmlData }}
                        />
                    }

                </View>

            </Container>




        )
    }
}