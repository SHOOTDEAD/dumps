import 'url-search-params-polyfill';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPhotos, setPhotos} from './cacheing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';


export default function Home({navigation}) {
  const Tag = 'Home';
  const tags = ['Dogs', 'Cats', 'Fish'];
  const dispatch = useDispatch();
  const photos = useSelector(state => state.photos);
  const [loading, setLoading] = useState(false);
  const loadPhotos = async () => {
    const netInfoState = await NetInfo.fetch();
    const isConnected = netInfoState.isConnected;

    try {
      const cachedPhotos = await AsyncStorage.getItem(`photos_${Tag}`);
      if (cachedPhotos && isConnected) {
        const parsedPhotos = JSON.parse(cachedPhotos);
        dispatch(setPhotos(parsedPhotos));
      } else {
        const fetchedPhotos = await dispatch(fetchPhotos(Tag));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(true);
    }
  };
  useEffect(() => {
    loadPhotos();
  }, [dispatch, Tag]);
  useFocusEffect(
    React.useCallback(() => {
      loadPhotos();
    }, []),
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <View style={styles.photoGrid}>
        {loading && (
          <FlatList
            data={photos}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            renderItem={({item, index}) => (
              <View style={styles.album}>
                <TouchableOpacity
                  style={styles.albumButton}
                  onPress={() =>
                    navigation.navigate('Albums', {
                      Tag: tags[index],
                    })
                  }>
                  <Image
                    key={index}
                    source={{uri: item}}
                    style={styles.albumPhotos}
                  />
                </TouchableOpacity>
                <Text style={styles.albumText}>{tags[index]}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  album: {
    width: '46%',
    aspectRatio: 1,
    margin: 8,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumButton: {
    height: '80%',
    aspectRatio: 1,
  },
  albumPhotos: {
    width: '100%',
    aspectRatio: 1,
  },
  albumText: {
    color: 'whitesmoke',
    fontSize: 10,
    fontFamily: 'bold',
  },
  photoGrid: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    height: '6%',
    borderColor: 'white',
    borderWidth: 1,
    margin: 8,
  },
});
