import React, { Component } from 'react';
import { ActivityIndicator, TouchableWithoutFeedback, FlatList } from 'react-native'
import { Container, Content, Text, View, Button, Icon, } from 'native-base';
import FastImage from 'react-native-fast-image';
import { strings } from '../../Localization';
import axios from 'axios';
import Loader from '../../component/Loader';


export default class SubscriptionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            subscriptData: [],
            text0: '',
            text1: '',
            selected: 0
        };
    }

    componentDidMount() {
        this.GetList()
    }


    GetList() {
        axios.get('/api/subscription')
            .then(response => {
                console.log(response.data);


                if (response.data.status) {
                    this.setState({
                        subscriptData: response.data.data,
                        text0: response.data.text0,
                        text1: response.data.text1,
                        is_loading: false,

                    });
                }

            })
            .catch(error => {
                console.log(error);
            });

    }



    sendDataToServer = () => {
        const { selected, subscriptData } = this.state
        console.log('selected is ', subscriptData[selected].sub_name)
        this.props.navigation.navigate('WalletOne', { sub_name: subscriptData[selected].sub_name, sub_cost: subscriptData[selected].sub_cost, subscription_id: subscriptData[selected].subscription_id })
    }





    SampleFunction = (index) => {
        this.setState({
            selected: index

        });
    }




    render() {

        const { is_loading, selected, text1, subscriptData } = this.state
        console.log('selected111  ', selected)
        return (
            <Container >
                <View style={{
                    flexDirection: 'row', marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                    shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                }}>
                    <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                    <Text style={{ fontSize: 20, color: 'black' }}>{strings.subscript}</Text>
                </View>
                <Content style={{ backgroundColor: 'white' }}>
                    {
                        is_loading ?
                            <Loader />
                            :
                            <View style={{ justifyContent: 'center', }}>
                                {
                                    this.props.navigation.getParam('left_day') == 0 ?
                                        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', margin: 16, lineHeight: 24, fontWeight: 'bold' }}>{strings.no_subscription} </Text>
                                        :
                                        <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', margin: 16, lineHeight: 24, fontWeight: 'bold' }}>{strings.left1 + this.props.navigation.getParam('left_day') + strings.day} </Text>

                                }
                                <Text style={{ textAlign: 'center', fontSize: 17, color: 'black', margin: 16, lineHeight: 20 }}>{text1.text} </Text>

                                {
                                    subscriptData.map((item, position) => (
                                        <View>
                                            {!item.is_free?
                                            <TouchableWithoutFeedback
                                                onPress={this.SampleFunction.bind(this, position)}
                                            >
                                                {
                                                    selected === position ?
                                                        <View style={{ backgroundColor: 'white', borderColor: '#ff5005', borderWidth: 2, marginLeft: 16, marginRight: 16, marginTop: 10, padding: 16 }}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 17, color: 'black' }}>{item.sub_name}</Text>
                                                                <Text style={{ fontSize: 17, color: 'black' }}>{item.sub_cost}</Text>
                                                            </View>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                                                <Text style={{ fontSize: 13, color: '#A8A8A8' }}></Text>
                                                                {
                                                                    item.sub_discount == null ?
                                                                        <Text style={{ fontSize: 13, color: '#A8A8A8' }}></Text>
                                                                        :
                                                                        <Text style={{ fontSize: 13, color: '#A8A8A8' }}>{strings.discount1 + item.sub_discount + strings.discount2}</Text>
                                                                }

                                                            </View>
                                                        </View>
                                                        :
                                                        <View style={{ backgroundColor: 'white', borderColor: '#ffcc15', borderWidth: 2, marginLeft: 16, marginRight: 16, marginTop: 10, padding: 16 }}>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={{ fontSize: 17, color: 'black' }}>{item.sub_name}</Text>
                                                                <Text style={{ fontSize: 17, color: 'black' }}>{item.sub_cost}</Text>
                                                            </View>
                                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                                                <Text style={{ fontSize: 13, color: '#A8A8A8' }}></Text>
                                                                {
                                                                    item.sub_discount == null ?
                                                                        <Text style={{ fontSize: 13, color: '#A8A8A8' }}></Text>
                                                                        :
                                                                        <Text style={{ fontSize: 13, color: '#A8A8A8' }}>{strings.discount1 + item.sub_discount + strings.discount2}</Text>

                                                                }

                                                            </View>
                                                        </View>
                                                }



                                            </TouchableWithoutFeedback>
                                            :
                                            null
    }
                                        </View>

                                    ))
                                }

                                {/* <FlatList
                            data={subscriptData}
                            renderItem={({item, index, separators}) => (
                                    <TouchableWithoutFeedback  
                                    onPress={ this.SampleFunction.bind(this, index)} 
                                >
                                    
                                        

                                    
                                        <View style={{backgroundColor:'white', borderColor:'#ffcc15', borderWidth:2,margin:16, padding:16}}>
                                            {
                                                selected===index?
                                                <Text style={{ fontSize:17, color:'black'}}>selected</Text>
                                                : 
                                                null
                                            }
                                        <View style={{ flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                                            <Text style={{ fontSize:17, color:'black'}}>{item.sub_name}</Text>
                                            <Text style={{ fontSize:17, color:'black'}}>{item.sub_cost}</Text>      
                                        </View>
                                        <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', marginTop:4}}>
                                            <Text style={{ fontSize:13, color:'#A8A8A8'}}></Text>
                                            {
                                                item.sub_discount==null?
                                                    <Text style={{ fontSize:13, color:'#A8A8A8'}}></Text>
                                                    :
                                                    <Text style={{ fontSize:13, color:'#A8A8A8'}}>{item.sub_discount +'%'}</Text>
                                            }
                                                  
                                        </View>
                                    </View>
                                    
                                    
                                    </TouchableWithoutFeedback>
                              )}
                            /> */}

                                <Button onPress={this.sendDataToServer}
                                    style={{ height: 54, flex: 1, marginLeft: 25, marginRight: 25, marginTop: 16, marginBottom: 16, backgroundColor: '#ffcc15', borderRadius: 3, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 20, color: 'black' }}>{strings.next}</Text>
                                </Button>

                            </View>

                    }

                </Content>

            </Container>
        )
    }
}