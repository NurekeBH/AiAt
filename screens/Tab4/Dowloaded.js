import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Loader from '../../component/Loader';

import {RefreshControl, Image, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import FastImage from 'react-native-fast-image'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Button, Content } from 'native-base';
import { strings } from '../../Localization';
// import RNFetchBlob from 'react-native-fetch-blob'


export default class Dowloaded extends Component {

    constructor(props) {
        super(props);

        this.state = {
            is_loadingBook: true,
            listViewData: [],

        };

    }


    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow(rowMap, rowKey) {
        AsyncStorage.getItem("token").then((value) => {
            if (value !== null) {
                const AuthStr = 'Bearer '.concat(value);

                axios.post('/api/book/read_remove', { 'book_id': rowKey.book_id, "type": "delete" }, { headers: { Authorization: AuthStr } })
                    .then(response => {
                        console.log('read_remove', response.data);
                        if (response.data.succses) {
                            this.closeRow(rowMap, rowKey.key);
                            const newData = [...this.state.listViewData];
                            const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey.key);
                            newData.splice(prevIndex, 1);
                            this.setState({ listViewData: newData });
                        }
                    }).catch(error => {
                        console.log(error);
                    });


            } else {
                this.props.navigation.navigate('Auth');
            }
        });




    }


    componentDidMount() {

        setTimeout(() => {
            this.setState({
                is_loadingBook: false
            });
        }, 4000);
        // this.loadBookData();
       
    }



    loadBookData = () => {
        AsyncStorage.getItem("token").then((value) => {
            if (value !== null) {
                const AuthStr = 'Bearer '.concat(value);
                axios.get('/api/book/users_read', { headers: { Authorization: AuthStr } })
                    .then(response => {
                        console.log(response.data);
                        const newFile = response.data.data.map((item, index) => {
                            return { key: `${index}`, ...item };
                        });
                        this.setState({
                            listViewData: newFile,
                            is_loadingBook: false
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                this.setState({
                    is_loadingBook: false
                });
            }
        });
    }

    refreshList = () => {
        this.setState({
            is_loadingBook: true
        });
        setTimeout(() => {
            this.setState({
                is_loadingBook: false
            });
        }, 3000);
        // this.loadBookData();
    }



    render() {
        const { is_loadingBook, listViewData } = this.state;

        return (

          
            is_loadingBook ?
                <Loader />
                :
                <View style={styles.container}>

                    {
                        listViewData.length === 0 ?
                            <Content 
                            refreshControl={
                                <RefreshControl refreshing={false}
                                    onRefresh={this.refreshList.bind(this)}
                                    />
                            }
                           >
                                  <Text style={{marginTop:16, textAlign:'center'}}>{strings.no_info}</Text>
                            </Content>

                            :
                            null
                    }


                    <SwipeListView
                        data={this.state.listViewData}
                        refreshControl={
                            <RefreshControl refreshing={false}
                                onRefresh={this.refreshList.bind(this)}
                                />
                        }
                        renderItem={(data, rowMap) => (
                            <TouchableHighlight
                                onPress={() => {
                                     this.props.onclickbook(data.item.book_id);
                                }}
                                style={styles.rowFront}
                                underlayColor={'#AAA'}
                            >
                                <View style={{ flex: 1, flexDirection: 'row', }}>
                                    <FastImage source={{ uri: data.item.book_image }} style={{ height: 140, width: 110, margin: 16, borderColor:'#E1E2E0', borderWidth:1 }}  />
                                    <View style={{ marginTop: 16, flex: 1 }}>
                                        <Text style={{ fontSize: 15, }}>{data.item.author}</Text>
                                        <Text style={{ fontSize: 17, color: 'black' }}>{data.item.book_name}</Text>
                                    </View>

                                    <Button transparent style={{ margin: 16, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../../img/book_download.png')} style={{ width: 27, height: 26 }} />
                                    </Button>



                                </View>
                            </TouchableHighlight>
                        )}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(rowMap, data.item)}>
                                    <Text style={styles.backTextWhite}>{strings.delete}</Text>
                                </TouchableOpacity>

                            </View>
                        )}
                        rightOpenValue={-70}
                        previewRowKey={'0'}
                        previewOpenValue={-40}
                        previewOpenDelay={2000}
                    />


                </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    backTextWhite: {
        color: '#FFF'
    },
    rowFront: {
        backgroundColor: '#fff',
        borderBottomColor: '#E1E2E0',
        borderBottomWidth: 1,
        justifyContent: 'center',
       
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },

    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0
    },
})