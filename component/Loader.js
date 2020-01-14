import React from 'react'
import {Container,Content, View} from 'native-base'
import {LinesLoader} from 'react-native-indicator';

export default () => {
  return (
    <Container>      
      <Content>
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <LinesLoader color='#ffcc15'  />
        </View>
       
      </Content>
    </Container>
  )
 
}
