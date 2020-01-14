import TrackPlayer from 'react-native-track-player';

module.exports = async function() {

  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    console.log("ssssssss")
    TrackPlayer.getPosition().then((position) => {
      
      console.log("ssssssss",position)
      TrackPlayer.pause()
    })
   
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious()
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    console.log("ssssssss")
    TrackPlayer.getPosition().then((position) => {
      
      console.log("ssssssss",position)
      
      TrackPlayer.destroy()
    })
  });

  
  TrackPlayer.addEventListener('remote-duck', () => {
    TrackPlayer.setVolume(data.ducking ? 0.5 : 1);
  });

  
  TrackPlayer.addEventListener('playback-error', () => {
    console.log('An error ocurred', data.error)
  });
  
};