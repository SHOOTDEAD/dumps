import 'url-search-params-polyfill';
import {
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPhotos, setPhotos} from './cacheing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export default function Album({route, navigation}) {
  const {Tag} = route.params;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: Tag,
      headerBackVisible: false,
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'whitesmoke',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation]);

  const dispatch = useDispatch();
  const photos = useSelector(state => state.photos);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    loadPhotos();
  }, [dispatch, Tag]);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = image => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.navBarText}>Home</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.photoGrid}>
          {loading && (
            <FlatList
              data={photos}
              keyExtractor={(_, index) => index.toString()}
              numColumns={2}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => openImageModal(item)}
                  style={styles.photoButton}>
                  <Image
                    key={index}
                    source={{uri: item}}
                    style={styles.photos}
                  />
                </TouchableOpacity>
              )}
            />
          )}

          <Modal visible={selectedImage !== null} transparent={true}>
            <View style={styles.modalContainer}>
              <Image source={{uri: selectedImage}} style={styles.modalImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeImageModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
  },
  photoButton: {
    width: '46%',
    aspectRatio: 1,
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  photos: {
    width: '100%',
    aspectRatio: 1,
  },
  photoGrid: {
    flex: 1,
    backgroundColor: 'white',
  },
  navBar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  navBarText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalImage: {
    width: '80%',
    aspectRatio: 1,
  },
  closeButton: {
    position: 'absolute',
    top: '80%',
    width: '20%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
  },
});
