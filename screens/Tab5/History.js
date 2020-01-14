import React, {Component} from 'react';
import {ActivityIndicator,TouchableWithoutFeedback, FlatList } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content,Text, View, Button,  Icon,  } from 'native-base';
import { strings } from '../../Localization'
import axios from 'axios';
import Loader from '../../component/Loader';


export default class History extends Component{

    constructor(props){
        super(props);
        this.state = {
            is_loading:true,
            subscriptData: [],
        
        };
    }

    componentDidMount() {
       this.GetList()
    }


    GetList(){
        AsyncStorage.getItem("token").then((value) => {
            if (value !== null) {
                const AuthStr = 'Bearer '.concat(value); 
             
        axios.get('/api/subscription/user', { headers: { Authorization: AuthStr } })
        .then(response => {
            console.log(response.data);


            if (response.data.status) {
                this.setState({
                    subscriptData:response.data.data,
                    is_loading:false ,
                     });
            }
           
        })
        .catch(error => {
          console.log(error);
        });
    }else{
               
        this.props.navigation.goBack()
    }
});

        
    }
     


    




    render() {
       
        const {is_loading,  subscriptData} = this.state
        return (
            <Container >
            <View style={{flexDirection:'row', marginBottom:5, width:"100%", height:56,justifyContent:'center', alignItems:'center' ,backgroundColor:'white',
            shadowOpacity: 0.5,shadowRadius: 5, elevation:3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
            }}>
                  <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                    <Text style={{  fontSize:20,color:'black'}}>{strings.history_subscript}</Text>        
                </View>
            <Content  style={{backgroundColor:'white'}}>
                {
                    is_loading?
                    <Loader/>  
                    : 
                    <View style={{justifyContent:'center', }}>
                        
                        <FlatList
                            data={subscriptData}
                            renderItem={({item, index, separators}) => (
                                <View style={{backgroundColor:'white',paddingLeft:16, paddingRight:16,paddingTop:16}}>     
                                <View style={{ flex: 1,flexDirection: 'row', justifyContent:'space-between'}}>
                                    <Text style={{ fontSize:17, color:'black'}}>{item.sub_name}</Text>
                                    <Text style={{ fontSize:17, color:'grey'}}>{item.us_final_date}</Text>      
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-between', marginTop:4}}>
                                    <Text style={{ fontSize:15, color:'grey'}}>{item.sub_cost+' ₸'}</Text>
                                    {
                                        item.us_active===0?
                                        <Text style={{ fontSize:17, color:'grye'}}>{strings.no_active}</Text> 
                                        :
                                        <Text style={{ fontSize:17, color:'#108B1C'}}>{strings.left+item.day_left+strings.day}</Text> 
                                    }
                                      
                                </View>
                                <View style={{width:"100%", height:1, backgroundColor:"#E1E2E0", marginTop:16}}/>
                            </View>   
                              )}
                            /> 

                       
                    </View>
                    
                }
              
            </Content>

        </Container>
        )
    }    
}