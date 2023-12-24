import {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Immersive from 'react-native-immersive';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

EStyleSheet.build({$rem: Dimensions.get('window').width / 380});

export default function ProfileScreen({route, navigation}) {
  const {userData, authToken} = route.params;
  const [Statistics, setStatistics] = useState([]);
  const [Task, setTask] = useState('');
  const [Number, setNumber] = useState('');
  const [Add, setAdd] = useState(false);
  const [Permission, setPermission] = useState(false);
  const [City, setCity] = useState('');
  const handleLogout = () => {
    navigation.navigate('Login');
  };
  const handlePermission = async () => {
    const requestPermission = await request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (requestPermission === RESULTS.GRANTED) {
      setPermission(false);
    }
    Geolocation.getCurrentPosition(
          async position => {
            const {latitude, longitude} = position.coords;
            try {
              const apiKey = 'Your google api key';
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
              );
              if (!response.ok) {
                throw new Error(
                  'Failed to fetch location data from Google Maps API',
                );
              }
              const data = await response.json();
              if (data.results.length > 0) {
                const cityName =
                  data.results[0]['address_components'][2]['long_name'];
                setCity(cityName);
              } else {
                console.log('City not found');
              }
            } catch (error) {
              console.error('Error getting location data:', error);
            }
            const data = {
              coordinates: {
                latitude: latitude,
                longitude: longitude,
              },
            };

            fetch(
              'https://api.apptask.thekaspertech.com/api/users/addCoordinates',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': authToken,
                },
                body: JSON.stringify(data),
              },
            )
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });
          },
          error => {
            console.error('Error getting location:', error);
          },
          {enableHighAccuracy: false, maximumAge: 10000},
        );
      }
  
  const handleCancel = () => {
    setAdd(false);
  };
  const handleAdd = () => {
    let temp = Statistics;
    temp.push([Task, Number]);
    setStatistics(temp);
    setAdd(false);
    setTask('');
    setNumber('');
  };
  useEffect(() => {
    Immersive.on();
    return () => {
      Immersive.off();
    };
  }, []);
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const isPermissionGranted = await check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (isPermissionGranted !== RESULTS.GRANTED) {
          setPermission(true);
        } else {
          Geolocation.getCurrentPosition(
            async position => {
              const {latitude, longitude} = position.coords;
              try {
                const apiKey = 'Your google api key';
                const response = await fetch(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
                );
                if (!response.ok) {
                  throw new Error(
                    'Failed to fetch location data from Google Maps API',
                  );
                }
                const data = await response.json();
                if (data.results.length > 0) {
                  const cityName =
                    data.results[0]['address_components'][2]['long_name'];
                  setCity(cityName);
                } else {
                  console.log('City not found');
                }
              } catch (error) {
                console.error('Error getting location data:', error);
              }
              const data = {
                coordinates: {
                  latitude: latitude,
                  longitude: longitude,
                },
              };

              fetch(
                'https://api.apptask.thekaspertech.com/api/users/addCoordinates',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': authToken,
                  },
                  body: JSON.stringify(data),
                },
              )
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                });
            },
            error => {
              console.error('Error getting location:', error);
            },
            {enableHighAccuracy: false, maximumAge: 10000},
          );
        }
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    };

    requestLocationPermission();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <Image
            source={{uri: userData['image_url']}}
            style={styles.userPhoto}
          />
          <Text style={styles.userName}>{userData['name']}</Text>
          <View style={styles.locationContainer}>
            <Image
              source={require('../assets/paperplane.png')}
              style={styles.symbol}
            />
            <Text style={styles.location}>{City}</Text>
          </View>

          <View style={styles.mailageOuterContainer}>
            <View style={styles.mailageInnerContainer}>
              <View style={styles.mailContainer}>
                <Text style={styles.email}>{userData['email']}</Text>
                <Text style={styles.emailText}>Email</Text>
              </View>
              <Text style={styles.age}>
                {userData['age']}
                {'\n'}Age
              </Text>
            </View>
          </View>
          <Text style={styles.statisticsHeadText}>General Statistics</Text>
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticsLogoContainer}>
              <Image
                source={require('../assets/tick.png')}
                style={styles.statisticsLogo}
              />
            </View>
            <Text style={styles.statistics}>Places Visited</Text>
            <View style={styles.statisticsNumberContainer}>
              <Text style={styles.statisticsNumber}>5</Text>
            </View>
          </View>
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticsLogoContainer}>
              <Image
                source={require('../assets/clock.png')}
                style={styles.statisticsLogo}
              />
            </View>
            <Text style={styles.statistics}>Hours Travelled</Text>
            <View style={styles.statisticsNumberContainer}>
              <Text style={styles.statisticsNumber}>14</Text>
            </View>
          </View>
          <View style={styles.statisticsContainer}>
            <View style={styles.statisticsLogoContainer}>
              <Image
                source={require('../assets/badge.png')}
                style={styles.statisticsLogo}
              />
            </View>
            <Text style={styles.statistics}>Surveys Completed</Text>
            <View style={styles.statisticsNumberContainer}>
              <Text style={styles.statisticsNumber}>24</Text>
            </View>
          </View>
          {Statistics.map((item, _) => (
            <View style={styles.statisticsContainer}>
              <View style={styles.statisticsLogoContainer}>
                <Image
                  source={require('../assets/stat.png')}
                  style={styles.statisticsLogo}
                />
              </View>
              <Text style={styles.statistics}>{item[0]}</Text>
              <View style={styles.statisticsNumberContainer}>
                <Text style={styles.statisticsNumber}>{item[1]}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Image source={require('../assets/dot.png')} style={styles.footerDot} />
        <TouchableOpacity
          style={styles.addFooterButton}
          onPress={() => setAdd(true)}>
          <Image
            source={require('../assets/plus.png')}
            style={styles.addLogo}
          />
        </TouchableOpacity>
        <Image source={require('../assets/dot.png')} style={styles.footerDot} />
      </View>
      <Modal visible={Permission} transparent={true}>
        <View style={styles.permissionOuterContainer}>
          <View style={styles.permissionInnerContainer}>
            <Text style={styles.permissionHeadText}>
              Location Permission Required
            </Text>
            <Text style={styles.permissionText}>
              You need to allow the app to fetch your location to use
              Loco,otherwise you will be logged out!
            </Text>
            <View style={styles.permissionButtonContainer}>
              <TouchableOpacity
                style={styles.permissionButtonAllow}
                onPress={() => handlePermission()}>
                <Image
                  source={require('../assets/settings.png')}
                  style={styles.permissionLogo}
                />
                <Text style={styles.permissionButtonText}>Allow Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.permissionButtonLogout}
                onPress={() => handleLogout()}>
                <Image
                  source={require('../assets/logout.png')}
                  style={styles.permissionLogo}
                />
                <Text style={styles.permissionButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={Add} transparent={true}>
        <View style={styles.addOuterContainer}>
          <View style={styles.addInnerContainer}>
            <Text style={styles.addText}>Task</Text>
            <TextInput
              style={styles.addInput}
              placeholder="Task"
              placeholderTextColor="grey"
              onChangeText={task => setTask(task)}
              value={Task}
            />
            <TextInput
              style={styles.addInput}
              placeholder="Number"
              placeholderTextColor="grey"
              onChangeText={number => setNumber(number)}
              value={Number}
            />
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleCancel()}>
                <Text style={styles.addButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAdd()}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 9,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    height: '65rem',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    elevation: 8,
  },
  headerText: {
    fontSize: '20rem',
    color: 'black',
  },
  footer: {
    width: '100%',
    height: '80rem',
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footerDot: {
    width: '15%',
    aspectRatio: 1,
  },
  addFooterButton: {
    width: '60rem',
    height: '60rem',
    backgroundColor: '#DD8716',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: '10rem',
  },
  addLogo: {
    width: '20rem',
    height: '20rem',
  },
  userPhoto: {
    width: '190rem',
    height: '190rem',
    marginBottom: '10rem',
    marginTop: '20rem',
    borderRadius: 100,
  },
  userName: {
    fontSize: '30rem',
    color: 'black',
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '25rem',
  },
  symbol: {
    width: '10rem',
    height: '10rem',
    marginRight: '5rem',
  },
  location: {
    fontSize: '12rem',
    color: 'black',
    fontWeight: 'bold',
  },
  mailageOuterContainer: {
    width: '80%',
    height: '100rem',
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20rem',
  },
  mailageInnerContainer: {
    width: '95%',
    height: '90rem',
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mailContainer: {
    flex: 5,
    marginLeft: '15rem',
    paddingTop: '15rem',
  },
  email: {
    flex: 1.1,
    fontSize: '20rem',
    color: 'black',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  emailText: {
    flex: 2,
    fontSize: '20rem',
    color: 'black',
  },
  age: {
    flex: 1,
    fontSize: '20rem',
    color: 'black',
    marginRight: '30rem',
  },
  statisticsHeadText: {
    fontSize: '12rem',
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '40rem',
    marginBottom: '15rem',
  },
  statisticsContainer: {
    width: '80%',
    height: '65rem',
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '12rem',
  },
  statisticsLogoContainer: {
    flex: 0.7,
  },
  statisticsLogo: {
    width: '30rem',
    height: '30rem',
    marginLeft: '10rem',
  },
  statistics: {
    flex: 2.3,
    fontSize: '16rem',
    color: 'black',
    fontWeight: 'bold',
    marginLeft: '20rem',
  },
  statisticsNumberContainer: {
    flex: 1,
    width: '20%',
    aspectRatio: 1.5,
    borderRadius: 40,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '20rem',
  },
  statisticsNumber: {
    fontSize: '16rem',
    color: 'black',
    fontWeight: 'bold',
  },
  permissionOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF90',
  },
  permissionInnerContainer: {
    width: '85%',
    height: '160rem',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    elevation: 8,
    paddingHorizontal: '20rem',
    // paddingTop:"20rem"
  },
  permissionHeadText: {
    fontSize: '17rem',
    color: 'red',
  },
  permissionText: {
    fontSize: '14rem',
    color: 'black',
  },
  permissionButtonContainer: {
    flexDirection: 'row',
    // justifyContent:"space-between",
    // alignItems:"space-between"
  },
  permissionButtonAllow: {
    width: '45%',
    height: '35rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#dd8716ff',
    marginTop: '20rem',
    marginRight: '50rem',
    flexDirection: 'row',
  },
  permissionButtonLogout: {
    width: '30%',
    height: '35rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#DA0408',
    marginTop: '20rem',
    flexDirection: 'row',
  },
  permissionButtonText: {
    fontSize: '12rem',
    color: 'white',
    marginRight: '5rem',
  },
  permissionLogo: {
    width: '25rem',
    height: '25rem',
    marginRight: '4rem',
  },
  addOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF90',
  },
  addInnerContainer: {
    width: '85%',
    height: '250rem',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    elevation: 8,
  },
  addText: {
    fontSize: '17rem',
    color: 'black',
    marginBottom: '20rem',
    marginTop: '10rem',
  },
  addInput: {
    width: '80%',
    aspectRatio: 5,
    backgroundColor: 'white',
    borderRadius: 40,
    marginBottom: '10rem',
    color: 'black',
    paddingLeft: '20rem',
    shadowColor: '#000',
    elevation: 5,
  },
  addButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '20rem',
  },
  addButton: {
    width: '30%',
    height: '40rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#dd8716ff',
    marginRight: '20rem',
  },
  addButtonText: {
    fontSize: '17rem',
    color: 'black',
  },
});
