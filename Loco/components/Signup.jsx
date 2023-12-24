import {
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {useState, useEffect} from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Immersive from 'react-native-immersive';

EStyleSheet.build({$rem: Dimensions.get('window').width / 380});

export default function LoginScreen({navigation}) {
  useEffect(() => {
    Immersive.on();
    return () => {
      Immersive.off();
    };
  }, []);
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Age, setAge] = useState('');
  const [Photo, setPhoto] = useState('');
  const [Error, setError] = useState([false, '']);
  const options = {
    mediaType: 'photo',
    includeBase64: true,
    quality: 1.0,
    presentationStyle: 'FullScreen',
  };
  const fields = {
    Photo: Photo,
    Name: Name,
    Email: Email,
    Password: Password,
    Age: Age,
  };
  const checkEmptyFields = () => {
    for (i in fields) {
      if (i === 'Photo' && fields[i] === '') {
        setError([true, 'Profile Photo is required']);
        return false;
      } else if (i !== 'Photo' && fields[i] === '') {
        setError([true, `${i} Field is required`]);
        return false;
      } else if (i === 'Password') {
        if (fields[i].length < 8) {
          setError([true, 'Password should contain atleast eigth characters']);
          return false;
        }
        let pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
        if (!pattern.test(fields[i])) {
          setError([
            true,
            'Password should contain atleast one uppercase,lowercase alphabet,a special character and a number',
          ]);
          return false;
        }
      } else if (i === 'Email') {
        let pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!pattern.test(fields[i])) {
          setError([true, 'Email is Invalid']);
          return false;
        }
      }
    }
    return true;
  };

  const handleUpload = async () => {
    await launchImageLibrary(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
        setError([true, 'Something went wrong']);
      } else {
        setPhoto(response['assets'][0]['uri']);
      }
    });
  };
  const handleTakePicture = async () => {
    await launchCamera(options, response => {
      if (response.didCancel) {
        return 0;
      } else if (response.error) {
        setError([true, 'Something went wrong']);
      } else {
        setPhoto(response['assets'][0]['uri']);
      }
    });
  };
  const handleSignup = async () => {
    if (!checkEmptyFields()) {
      return 0;
    }
    const formData = new FormData();
    formData.append('name', Name);
    formData.append('email', Email);
    formData.append('password', Password);
    formData.append('age', Age);
    formData.append(
      'profile_picture',
      formData.append('profile_picture', {
        uri: Photo,
        name: 'profile_picture',
        type: 'image/png',
      }),
    );
    try {
      const response = await fetch(
        'https://api.apptask.thekaspertech.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (!response.ok) {
        if (response.status === 413) {
          setError([true, 'The photo exceeds the acceptable size limit']);
        } else {
          setError([true, 'Registration failed']);
        }
      } else {
        try {
          const credentials = {
            email: Email,
            password: Password,
          };
          const response = await fetch(
            'https://api.apptask.thekaspertech.com/api/users/login',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
            },
          );

          if (!response.ok) {
            setError([true, 'Something went wrong']);
          } else {
            const result = await response.json();
            navigation.navigate('Profile', {
              userData: result['user'],
              authToken: result['token'],
            });
          }
        } catch (error) {
          setError([true, 'Something went wrong']);
        }
      }
    } catch (error) {
      setError([true, 'Something went wrong']);
    }
  };
  const handleClose = () => {
    setError([false, '']);
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1682687220509-61b8a906ca19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MXwxfHNlYXJjaHwxfHxUcmF2ZWx8ZW58MXx8fHwxNzAyNTQ4MjgzfDA&ixlib=rb-4.0.3&q=80&w=1080',
        }}
        style={styles.image}
      />
      <ImageBackground
        style={styles.signupContainer}
        source={{
          uri: 'https://images.unsplash.com/photo-1682687220509-61b8a906ca19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MXwxfHNlYXJjaHwxfHxUcmF2ZWx8ZW58MXx8fHwxNzAyNTQ4MjgzfDA&ixlib=rb-4.0.3&q=80&w=1080',
        }}>
        <View style={styles.signupCurvedContainer}>
          <Text style={styles.signupHeadText}>Signup</Text>
          <KeyboardAvoidingView
            style={styles.inputContainer}
            behavior={'height'}>
            <View style={styles.photoDetailsContainer}>
              <View style={styles.photoContainer}>
                <Image
                  source={
                    Photo ? {uri: Photo} : require('../assets/userlogo.png')
                  }
                  style={styles.userLogo}
                />
              </View>
              <View style={styles.textAndButtonsContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.photoHeadText}>Profile Picture</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => handleTakePicture()}>
                    <Text style={styles.photoText}>Take Picture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.photoButton}
                    onPress={() => handleUpload()}>
                    <Text style={styles.photoText}>Upload</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="grey"
              onChangeText={name => setName(name.trim())}
              value={Name}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={email => setEmail(email.trim())}
              value={Email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="grey"
              onChangeText={pwd => setPassword(pwd.trim())}
              value={Password}
              secureTextEntry={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              placeholderTextColor="grey"
              onChangeText={setAge}
              value={Age}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.signup}
              onPress={() => handleSignup()}>
              <Text style={styles.signupText}>Create Account</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
      <Modal visible={Error[0]} transparent={true}>
        <View style={styles.errorOuterContainer}>
          <View style={styles.errorInnerContainer}>
            <Text style={styles.errorText}>{Error[1]}</Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => handleClose()}>
              <Text style={styles.errorText}>Ok</Text>
            </TouchableOpacity>
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
  image: {
    flex: 3,
    resizeMode: 'cover',
  },
  signupContainer: {
    flex: 7,
    borderRadius: 40,
    transform: [{scaleY: -1}],
  },
  signupCurvedContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'white',
    transform: [{scaleY: -1}],
  },
  signupHeadText: {
    fontSize: '25rem',
    color: 'black',
    fontWeight: 'bold',
    paddingHorizontal: '30rem',
    paddingTop: '30rem',
  },
  photoDetailsContainer: {
    marginBottom: '20rem',
    flexDirection: 'row',
  },
  photoContainer: {
    flex: 1,
  },
  userLogo: {
    width: '70rem',
    height: '70rem',
    borderRadius: 100,
  },

  textAndButtonsContainer: {
    flex: 5,
    justifyContent: 'space-between',
    marginLeft: '30rem',
  },
  textConatiner: {
    flex: 1,
  },
  photoHeadText: {
    fontSize: '15rem',
    color: 'black',
    marginLeft: '2rem',
    marginBottom: '5rem',
  },
  photoText: {
    fontSize: '15rem',
    color: 'black',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  photoButton: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '5rem',
    shadowColor: 'rgba(0, 0, 0, 2)',
    elevation: 2,
  },
  inputContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '35rem',
    paddingTop: '30rem',
  },
  input: {
    width: '100%',
    aspectRatio: 5,
    backgroundColor: 'white',
    borderRadius: 40,
    marginBottom: '10rem',
    color: 'black',
    paddingLeft: '20rem',
    shadowColor: '#000',
    elevation: 5,
  },
  signup: {
    width: '100%',
    aspectRatio: 4.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dd8716ff',
    borderRadius: 50,
    marginTop: '10rem',
  },
  signupText: {
    fontSize: '18rem',
    color: 'white',
  },
  errorOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF90',
  },
  errorInnerContainer: {
    width: '85%',
    height: '160rem',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    elevation: 8,
  },
  errorText: {
    fontSize: '17rem',
    color: 'black',
  },
  errorButton: {
    width: '16%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#dd8716ff',
    marginTop: '20rem',
  },
});
