import React, { Component } from 'react';
import { Content, Text, View, Button, Toast, Container, Root, } from 'native-base';
import { strings } from '../../Localization'
import { createStackNavigator } from 'react-navigation-stack';

import { createAppContainer } from 'react-navigation';
import Login from './login';
import Register from './register';
import Active from '../Tab4/Active';
import NavigationService from '../../navigation/NavigationService';

const Navigator = createAppContainer(createStackNavigator(
    {
        Login: {
            screen: props => <Login {...props} onclickbook={props.screenProps.onclickbook} goToProfile = {props.screenProps.goToProfile} />,
            navigationOptions: {
                header: null
            }
        },
        Register: {
            screen: props => <Register {...props} goToAuthPhone={props.screenProps.goToAuthPhone} />,
            navigationOptions: {
                header: null
            }
        },
    },
    {
        transitionConfig: () => ({
          transitionSpec: {
            duration: 0,  // Set the animation duration time as 0 !!
          },
        }),
    },
    {
        initialRouteName: 'Login',
    }
));


export default class Auth extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: 1,
            title: strings.auth
        }
    }


    selectedClick = (selected) => {
        console.log('select', selected)
        if (selected === 1) {
            this.setState({
                selected: 1,
                title: strings.auth
            });
            NavigationService.navigate('Login');
        } else {
            this.setState({
                selected: 2,
                title: strings.register
            });
            NavigationService.navigate('Register');
        }
    }


  
    onResetPressedHandler = () => {
       
        this.props.navigation.navigate('Reset')
    }


    goToAuthPhone = (phone) => {
       
        this.props.navigation.navigate('AuthPhone', {phone})
    }


    goToProfile = () => {
       
        this.props.navigation.replace('Profile')
    }


    render() {

        const { tabs, selected, title } = this.state
        return (
            <Root>
                <Container>
                    <View style={{
                        marginBottom: 5, width: "100%", height: 56, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
                        shadowOpacity: 0.5, shadowRadius: 5, elevation: 3, shadowColor: '#E1E2E0', shadowOffset: { height: 0, width: 0 },
                    }}>
                        <Text style={{ fontSize: 20, color: 'black' }}>{title}</Text>
                    </View>


                    <View style={{ flex: 1 }}>

                        {
                            selected === 1 ?
                                <View style={{ margin: 16, borderRadius: 8, height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5' }}>
                                    <View style={{ flex: 1, borderRadius: 8, height: 32, margin: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 16, color: 'black', }}>{strings.login}</Text>
                                    </View>
                                    <Button transparent style={{ flex: 1, height: 32, alignItems: 'center', justifyContent: 'center', }}
                                        onPress={() => this.selectedClick(2)} >
                                        <Text style={{ fontSize: 15, color: 'black', }}>{strings.register}</Text>
                                    </Button>

                                </View>
                                :
                                <View style={{ margin: 16, borderRadius: 8, height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5' }}>
                                    <Button transparent style={{ flex: 1, height: 32, alignItems: 'center', justifyContent: 'center', }}
                                        onPress={() => this.selectedClick(1)} >
                                        <Text style={{ fontSize: 15, color: 'black', }}>{strings.login}</Text>
                                    </Button>
                                    <View style={{ flex: 1, borderRadius: 8, height: 32, margin: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 16, color: 'black', }}>{strings.register}</Text>
                                    </View>

                                </View>
                        }





                        <Navigator
                            ref={navigatorRef => {
                                NavigationService.setTopLevelNavigator(navigatorRef);
                            }}
                            screenProps={{  onclickbook: this.onResetPressedHandler , goToAuthPhone: this.goToAuthPhone, goToProfile: this.goToProfile }} />


                    </View>

                </Container>
            </Root>





        )
    }
}