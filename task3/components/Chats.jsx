import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {firebase} from '@react-native-firebase/database';
import {useFocusEffect} from '@react-navigation/native';

export default function ChatsScreen({route, navigation}) {
  let {chatsname} = route.params;
  const [chats, setChats] = useState([]);
  const getRecentData = async target => {
    navigation.setOptions({
      headerTitle: chatsname[0],
    });
    let tempy = target.map(i => {
      if (i != 'group') {
        if (chatsname[0] < i) {
          return [i, `${chatsname[0]}-${i}`];
        } else {
          return [i, `${i}-${chatsname[0]}`];
        }
      } else {
        return [i, i];
      }
    });
    tempy = await Promise.all(
      tempy.map(async i => {
        const ref = await firebase
          .app()
          .database(
            'Your firebase realtime db link'
          )
          .ref(`Chats/${i[1]}`)
          .orderByKey()
          .limitToLast(2)
          .once('value');
        let data = ref.val();
        delete data.members;
        return [i[0], data];
      }),
    );
    tempy = tempy.sort(([, a], [, b]) => {
      const A = a[Object.keys(a)[0]]?.timestamp || '' || '0';
      const B = b[Object.keys(b)[0]]?.timestamp || '' || '0';
      return new Date(B) - new Date(A);
    });
    tempy = tempy.map(i => {
      if (Object.keys(i[1]).length !== 0) {
        return [
          i[0],
          Object.values(i[1])[0].text,
          Object.values(i[1])[0].sender,
        ];
      } else {
        return [i[0], undefined, undefined];
      }
    });

    if (tempy.toString() !== chats.toString()) {
      setChats(tempy);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: chatsname[0],

      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'whitesmoke',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
    return () => {
      setChats([]);
    };
  }, [navigation, chatsname]);

  const toChat = target => {
    if (target === 'group') {
      navigation.navigate('Chat', {
        Target: target,
      });
    } else {
      navigation.navigate('Chat', {
        Target: target,
      });
    }
  };
  useEffect(() => {
    setChats([]);
    getRecentData(chatsname[1]);
    const intervalId = setInterval(() => {
      getRecentData(chatsname[1]);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [chatsname]);
  useFocusEffect(
    React.useCallback(() => {
      getRecentData(chatsname[1]);
    }, []),
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        numColumns={1}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity style={styles.chat} onPress={() => toChat(item[0])}>
            <Text style={styles.text}>{item[0]}</Text>
            <Text style={styles.message}>
              {item[2] === chatsname[0] ? 'You:' : ''}
              {item[1]}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 60,
    color: 'black',
  },
  chat: {
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  message: {
    fontSize: 20,
    color: 'black',
  },
});
