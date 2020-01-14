import React from 'react';
import 'react-native-gesture-handler'
import { Image } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationActions, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import SplashScreen from '../screens/SplashScreen'
import Tab1Screen from '../screens/Tab1/Tab1Screen';
import Comment from '../screens/Comment';
import HomeScreen from '../screens/HomeScreen'
import DetailBook from '../screens/detailBook'
import Collection from '../screens/Collection';
import Tab2Screen from '../screens/Tab2/Tab2Screen';
import BookByCatalog from '../screens/Tab2/bookByCatalog';
import { strings } from '../Localization'
import index4 from './index4';
import Auth from '../screens/Tab5/auth';
import ResetPassword from '../screens/Tab5/resetPassword';
import AuthPhone from '../screens/Tab5/authPhone';
import Profile from '../screens/Tab5/profile';
import AboutApp from '../screens/Tab5/AboutApp';
import Report from '../screens/Tab5/report';
import History from '../screens/Tab5/History';
import SubscriptionList from '../screens/Tab5/subscriptionList';
import WalletOne from '../screens/Tab5/walletone';
import ChangeProfile from '../screens/Tab5/changeProfile';
import Player from '../screens/Tab3/player'
import Subscript from '../screens/subscript';
import SearchBook from '../screens/searchBook';
import { Toast, Root } from 'native-base';



const AppNavigator = createStackNavigator(
  {

    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        header: null
      },
    },
    Tab: {
      screen: createBottomTabNavigator(
        {
          Home: {
            screen: createStackNavigator(
              {
                Tab1: {
                  screen: Tab1Screen,
                  navigationOptions: {
                    header: null
                  }
                },

                Detail: {
                  screen: DetailBook,
                  navigationOptions: {
                    header: null
                  }
                },

                Collection: {
                  screen: Collection,
                  navigationOptions: {
                    header: null
                  }
                },

                SearchBook: {
                  screen: SearchBook,
                  navigationOptions: {
                    header: null
                  }
                }
              },
              {
                initialRouteName: 'Tab1',
              }
            ),
            navigationOptions: ({ navigation, navigationOptions }) => ({
              title: strings.tab1,
              tabBarIcon: (({ tintColor }) => (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: tintColor }}
                  source={require('../img/maintab1.png')}
                />
              ))
            }),
            
          },
          Catalog: {
            screen: createStackNavigator(
              {
                Tab2: {
                  screen: Tab2Screen,
                  navigationOptions: {
                    header: null
                  }
                },
                SearchBook: {
                  screen: SearchBook,
                  navigationOptions: {
                    header: null
                  }
                },
                BookByCatalog: {
                  screen: BookByCatalog,
                  navigationOptions: {
                    header: null
                  }
                },

                Detail: {
                  screen: DetailBook,
                  navigationOptions: {
                    header: null
                  }
                },
              },
              {
                initialRouteName: 'Tab2',
              }
            ),
            navigationOptions: ({ navigation, navigationOptions }) => ({
              title: strings.tab2,
              tabBarIcon: (({ tintColor }) => (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: tintColor }}
                  source={require('../img/maintab2.png')}
                />
              ))
            }),
          },
          Player: {
            screen: Player,
            
            navigationOptions: ({ navigation, navigationOptions }) => ({
              title: strings.tab3,
              tabBarIcon: (({ tintColor }) => (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: tintColor }}
                  source={require('../img/maintab3.png')}
                />
              )),
              tabBarOnPress: ({ navigation, defaultHandler }) => {

                AsyncStorage.getItem("book_id").then((book_id) => {

                  if (book_id !== null) {
                    navigation.navigate('OpenPlayer', { play: false, book_id: book_id });
                  } else {
                    navigation.navigate('Catalog',);
                    Toast.show({ text: strings.no_active_book, buttonText: "OK", duration: 3000, position: 'top' })
                  }

                })
              }
            })
          },
          Mybook: {
            screen: createStackNavigator(
              {
                index4: {
                  screen: index4,
                  navigationOptions: {
                    header: null
                  }
                },
                SearchBook: {
                  screen: SearchBook,
                  navigationOptions: {
                    header: null
                  }
                },



                Detail: {
                  screen: DetailBook,
                  navigationOptions: {
                    header: null
                  }
                },
              },
              {
                initialRouteName: 'index4',
              }
            ),
            
            navigationOptions: ({ navigation, navigationOptions }) => ({
              title: strings.tab4,
              tabBarIcon: (({ tintColor }) => (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: tintColor }}
                  source={require('../img/maintab4.png')}
                />
              ))
            })
          },
          Profile: {
            screen: createStackNavigator(
              {
                Profile: {
                  screen: Profile,
                  navigationOptions: {
                    header: null
                  }
                },
                AboutApp: {
                  screen: AboutApp,
                  navigationOptions: {
                    header: null
                  }
                },
                Report: {
                  screen: Report,
                  navigationOptions: {
                    header: null
                  }
                },
                History: {
                  screen: History,
                  navigationOptions: {
                    header: null
                  }
                },
                SubscriptionList: {
                  screen: SubscriptionList,
                  navigationOptions: {
                    header: null
                  }
                },
                WalletOne: {
                  screen: WalletOne,
                  navigationOptions: {
                    header: null
                  }
                },
                ChangeProfile: {
                  screen: ChangeProfile,
                  navigationOptions: {
                    header: null
                  }
                },

                Auth: {
                  screen: Auth,
                  navigationOptions: {
                    header: null
                  }
                },
                Reset: {
                  screen: ResetPassword,
                  navigationOptions: {
                    header: null
                  }
                },
                AuthPhone: {
                  screen: AuthPhone,
                  navigationOptions: {
                    header: null
                  }
                },
              },
              {
                initialRouteName: 'Profile',
              }
            ),
            navigationOptions: ({ navigation, navigationOptions }) => ({
              title: strings.tab5,
              tabBarIcon: (({ tintColor }) => (
                <Image
                  style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: tintColor }}
                  source={require('../img/maintab5.png')}
                />
              )),
              tabBarOnPress: ({ navigation, defaultHandler }) => {
                AsyncStorage.getItem("token").then((value) => {
                  console.log("tokentokenvalue", value)
                  if (value !== null) {
                    navigation.replace('Profile');
                  } else {
                    navigation.replace('Auth');
                  }

                })
              }
            })
          },

        },
        {
          tabBarOptions: {
            activeTintColor: '#ffcc15',
            labelStyle: {
              fontSize: 10,
            },
            style: {
              backgroundColor: 'white',
            },
          }
        },

      ),
      navigationOptions: {
        header: null
      }
    },
    Comment: {
      screen: Comment,
      navigationOptions: {
        header: null
      }
    },
    Subscript: {
      screen: Subscript,
      navigationOptions: {
        header: null
      }
    },
    OpenPlayer: {
      screen: Player,
      navigationOptions: {
        header: null
      }
    },
  },

  {
    initialRouteName: 'Splash',
  }
);

export default createAppContainer(AppNavigator);