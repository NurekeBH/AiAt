import React from 'react';
import { View, Text,  } from 'react-native';
import TrackPlayer, { ProgressComponent } from 'react-native-track-player';
import AsyncStorage from '@react-native-community/async-storage';

// import Sliders from 'react-native-slider'
import Sliders from '@react-native-community/slider';

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
  
    var hDisplay;
    if (h > 0) { if (h < 10) { hDisplay = "0" + h; } else { hDisplay = h; } } else { hDisplay = "00"; }
    var mDisplay;
    if (m > 0) { if (m < 10) { mDisplay = "0" + m; } else { mDisplay = m; } } else { mDisplay = "00"; }
    var sDisplay;
    if (s > 0) { if (s < 10) { sDisplay = "0" + s; } else { sDisplay = s; } } else { sDisplay = "00"; }
    return hDisplay + ":" + mDisplay + ":" + sDisplay;
  }


class ProgressBar extends ProgressComponent {

    render() {
        const position = Math.floor(this.state.position);
        const duration = Math.floor(this.state.duration);
       
        
        if(position%2==0 && position!==0){
            AsyncStorage.setItem('book_time', position+"");
        }

        return (
           <View style={{ flex: 1, width: '100%', position: 'absolute', bottom: 0, padding: 16 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', fontSize: 13 }}>{secondsToHms(position)}</Text>
                    <Text style={{ color: 'white', fontSize: 13 }}>{secondsToHms(duration)}</Text>
                
                </View>
                <Sliders
                    maximumValue={duration}
                    value={position}
                    onValueChange={(val) => {TrackPlayer.seekTo(val); TrackPlayer.play()}}
                    minimumTrackTintColor='#ffcc15'
                    trackStyle={{
                    height: 4,
                    borderRadius: 5,
                    backgroundColor: '#d0d0d0',
                    }}
                    thumbStyle={{
                    width: 5,
                    height: 20,
                    borderRadius: 5,
                    backgroundColor: 'white',
                    }}
                />
            </View>
        );
    }

}


module.exports = ProgressBar;