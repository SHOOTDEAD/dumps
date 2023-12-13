import React, { useState } from 'react';
import {StyleSheet,View, Image} from 'react-native';
import Swiper from 'react-native-deck-swiper';

export default function SwiperComponent() {
  const tickImage = require('./assets/image/accept.png');
  const crossImage = require('./assets/image/remove.png');
  const [tick, setTick] = useState([false,false,false,false,false,false,false,false,false]);
  const [cross, setCross] = useState([false,false,false,false,false,false,false,false,false]);
  const [indy, setIndy] = useState(0)
  const getColor = (color:string) => {
    return {
      flex: 0.8,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: "flex-start",
      backgroundColor: color
    };
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={["#B19CD9","#FFD8B1","#001F3F","#000000","#D3D3D3","#4285F4", '#0F9D58', '#F4B400']}
        renderCard={(card,index) => (
          <View style={getColor(card)}>
            
            {tick[index] && <Image source={tickImage} style={styles.tick} />}
            {cross[index] && <Image source={crossImage} style={styles.cross} />}
          </View>
        )}
        onSwiped={() => {
         setIndy(indy+1)
        }}
        onSwiping={(x, y) => {
           if (x > 50) {
            const temp1 = tick
            temp1[indy] = true
            setTick(temp1);
            const temp2 = cross
            temp2[indy] = false
            setCross(temp2);
          } else if(x < -50){
            const temp1 = tick
            temp1[indy] = false
            setTick(temp1);
            const temp2 = cross
            temp2[indy] = true
            setCross(temp2);
          }
        }}
        onSwipedAborted={() =>{
            const temp1 = tick
            temp1[indy] = false
            setTick(temp1);
            const temp2 = cross
            temp2[indy] = false
            setCross(temp2);
        }}
        cardIndex={0}
        backgroundColor={'#FFFFFF'}
        stackSize={3}
        stackScale={1}
        stackSeparation={15}
        disableBottomSwipe={true}
        disableTopSwipe={true}
        verticalThreshold={0}
        verticalSwipe={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tick:{
    height:70,
    width:70,
    opacity:0.8,
  },
  cross:{
    height:70,
    width:70,
    position:"relative",
    left:"80%",
    opacity:0.8,
  }
});
