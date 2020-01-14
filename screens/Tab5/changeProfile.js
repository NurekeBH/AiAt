import React, {Component} from 'react';
import {ActivityIndicator, Platform, TextInput, Image, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import {Root, Content,Text, View, Button,Toast, Container, Icon  } from 'native-base';
import {strings} from '../../Localization'
import ImagePicker from 'react-native-image-picker';
//////  Picker IOs kosu kerek
import {LinesLoader} from 'react-native-indicator';


const options = {
  title: 'Сурет таңдаңыз',
  storageOptions: {
    skipBackup: true,
    path: 'images',
    
  },
};

export default class ChangeProfile extends Component{

  
    constructor(props) {
        super(props);
        
        this.state = {
          password:'',
          re_password:'',
          name:this.props.navigation.getParam('user_name'),
          is_loading:false,
          is_image:false
          
        }
      }
     


      sendDataToServer = () => {
        this.setState({
          is_loading: true,
        });
        AsyncStorage.getItem("token").then((value) => {
          if (value !== null) {
        console.log('value',value);

            const AuthStr = 'Bearer '.concat(value); 
            
        const {is_image, name,  password, re_password, path, uri, type, fileName} = this.state
        const formData1 = new FormData()
        if(is_image){
         formData1.append('avatar', {
                uri: Platform.OS === 'android' ? `file://${path}` : uri,
                type,
                name: fileName
              })
           
        }
      
      
        if (name === '') {
          this.setState({
            is_loading: false,
          });
            Toast.show({text: "Введите имя", buttonText: "OK",duration: 2500, position:'top'})
        }else if(password === '' || re_password === '' || password != re_password){
          this.setState({
            is_loading: false,
          });
            Toast.show({text: "Пароль и его подтверждение не совпадают. Повторите!", buttonText: "OK",duration: 2500, position:'top'})
        }else{
          formData1.append('user_name',name);
          formData1.append('password',password);
          formData1.append('password_confirmation',re_password);


        console.log('user_name',name);
        console.log('password',password);
        console.log('password_confirmation',re_password);
        console.log('formData',formData1);

          fetch('http://aiat.adekta.kz/api/user_change',
              { method: 'POST',headers:{  
                  'Accept': 'application/json',
                  'Content-Type': 'multipart/form-data',
                  'Authorization': AuthStr
                  } , body :formData1} )   
            .then(response => response.json())
            .then(responseJson => {
            console.log("responseJson",responseJson)
            if(responseJson.status){
              this.props.navigation.navigate('Profile')
            }
            this.setState({
              is_loading: false,
            });
            });

        }
      }else{
        this.props.navigation.goBack()
      }
    })
      }

      _UploadImage =() =>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
               
             
              const { path, uri, type, fileName } = response
    
              const source = { uri: Platform.OS === 'android' ? `file://${path}` : uri };
             
              const formData = new FormData()
              formData.append('avatar', {
                uri: Platform.OS === 'android' ? `file://${path}` : uri,
                type,
                name: fileName
              })
           
              this.setState({
                is_image:true,
                news_image: source,
                formData:formData,
                path, uri, type, fileName
                
              });
            }
          });
      };

      
    render() {
      const {news_image, is_loading } = this.state
      
        return (
          <Root>
            
          <Container >
            <View style={{flexDirection:'row', marginBottom:5, width:"100%", height:56,justifyContent:'center', alignItems:'center' ,backgroundColor:'white',
                  shadowOpacity: 0.5,shadowRadius: 5, elevation:3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                  }}>
                      <Button onPress={() => { this.props.navigation.goBack() }} transparent style={{ width: 56, height: 56, position: 'absolute', top: 0, left: 0 }}>
                        <Icon name='arrow-back' style={{ fontSize: 32, color: '#A8A8A8' }} />
                    </Button>
                          <Text style={{  fontSize:20,color:'black'}}>{strings.changeprofile}</Text>        
                      </View>
             <Content>
                        {
                           is_loading?
                           <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                              <LinesLoader color='#ffcc15'  />
                           </View>
                           :
                           null
                        }
                        <View style={{ width:'100%',height:120, }}>
                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                              <Image source={news_image} style={{ width:80,  borderRadius:40, height:80,borderColor:'grey',borderWidth:1}}></Image>

                            </View>
                            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                              
                            <TouchableOpacity transparent  style={{   width:40, height:40, backgroundColor:'#0075EB', borderRadius:24, justifyContent: 'center',alignItems: 'center'}} 
                              onPress ={() => this._UploadImage()}>
                                <Icon name='image-plus' type='MaterialCommunityIcons'   style={{color: 'white',fontSize: 24,}} />
                              </TouchableOpacity>
                              </View>
                        </View>
                       
                        
                        <View style={{width:'100%', height:1, backgroundColor:'#E1E2E0', marginTop:20}}  />
                        
                        <View style={{marginLeft:16, marginRight:16, borderBottomColor: '#F5FCFF',backgroundColor: '#FFFFFF',height:45, flexDirection: 'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:17,color:'#A8A8A8' }}>{strings.name}</Text>
                            </View>
                            <View style={{flex:3}}>
                                <TextInput style={{color:'#000', height:45,borderBottomColor: '#FFFFFF',flex:1,}}
                                    value={this.state.name}
                                    placeholderTextColor = "#A8A8A8"
                                    placeholder="Aiat"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(name) => this.setState({name})}/>
                            </View>
                        </View>

                        <View style={{width:'100%', height:1, backgroundColor:'#E1E2E0',}}  />

                        <View style={{marginLeft:16, marginRight:16, borderBottomColor: '#F5FCFF',backgroundColor: '#FFFFFF',height:45, flexDirection: 'row',alignItems:'center'}}>
                            <View style={{flex:1}}>
                                <Text style={{fontSize:17,color:'#A8A8A8' }}>{strings.password}</Text>
                            </View>
                            <View style={{flex:3}}>
                                <TextInput style={{color:'black', height:45, borderBottomColor: '#FFFFFF',flex:1,}}
                                  
                                    placeholderTextColor = "#A8A8A8"
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
                            <View style={{flex:3}}>
                                <TextInput style={{color:'black', height:45, borderBottomColor: '#FFFFFF',flex:1,}}
                                    placeholder="******"
                                    placeholderTextColor = "#A8A8A8"
                                    secureTextEntry={true}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(re_password) => this.setState({re_password})}/>
                            </View>
                        </View>
                        
                        <View style={{width:'100%', height:1, backgroundColor:'#E1E2E0'}}  />

                        <Button 
                        onPress={this.sendDataToServer} 
                        style={{height:54, flex:1, marginLeft:25, marginRight:25, marginTop:16, backgroundColor:'#ffcc15', borderRadius:3, justifyContent:'center'}}>
                            <Text style={{fontSize:20,color:'black'}}>{strings.save}</Text>
                        </Button>

                        

                    </Content>
                    </Container>
            
          </Root>
           
                    

        )
    }    
}