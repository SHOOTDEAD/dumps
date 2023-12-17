import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {createFlickr} from 'flickr-sdk';

const {flickr} = createFlickr('API_KEY');

const photosReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_PHOTOS':
      return action.payload;
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: combineReducers({
    photos: photosReducer,
  }),
});

export const setPhotos = photos => ({
  type: 'SET_PHOTOS',
  payload: photos,
});

export const fetchPhotos = tag => async dispatch => {
  try {
    const cachedPhotos = await AsyncStorage.getItem(`photos_${tag}`);
    if (cachedPhotos.toString() != '[]') {
      const parsedPhotos = JSON.parse(cachedPhotos);
      dispatch(setPhotos(parsedPhotos));
      return parsedPhotos;
    }
    let res = [];
    if (tag == 'Home') {
      try {
        const res1 = await flickr('flickr.photos.search', {
          tags: 'Dogs',
          per_page: 1,
        });
        const res2 = await flickr('flickr.photos.search', {
          tags: 'Cats',
          per_page: 1,
        });
        const res3 = await flickr('flickr.photos.search', {
          tags: 'Fish',
          per_page: 1,
        });
        res = [
          res1.photos.photo[0],
          res2.photos.photo[0],
          res3.photos.photo[0],
        ];
      } catch (error) {
        console.log(error);
      }
    } else {
      res = await flickr('flickr.photos.search', {
        tags: tag,
        per_page: 30,
      }).photos.photo;
    }

    const temp = [];
    for (const photo of res) {
      const url = `http://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;

      const filePath = `${RNFS.CachesDirectoryPath}/${photo.id}.jpg`;
      await RNFS.downloadFile({fromUrl: url, toFile: filePath}).promise;

      temp.push('file://' + filePath);
    }
    await AsyncStorage.setItem(`photos_${tag}`, JSON.stringify(temp));

    dispatch(setPhotos(temp));
    return temp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
