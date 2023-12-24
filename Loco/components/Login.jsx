import {
  Text,
  View,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import {useState, useEffect,useRef} from 'react';
import Immersive from 'react-native-immersive';

EStyleSheet.build({
  $rem: Dimensions.get('window').width / 380,
});

export default function LoginScreen({navigation}) {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Error, setError] = useState([false, '']);
  const fields = {Email: Email, Password: Password};
  const passwordField = useRef()
  const checkEmptyFields = () => {
    for (i in fields) {
      if (fields[i] === '') {
        setError([true, `${i} Field is required`]);
        return false;
      }
    }
    return true;
  };
  const handleLogin = async () => {
    if (!checkEmptyFields()) {
      return 0;
    }
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
        setError([true, `Invalid Crendentials`]);
      } else {
        const result = await response.json();
        navigation.navigate('Profile', {
          userData: result['user'],
          authToken: result['token'],
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  const handleClose = () => {
    setError([false, '']);
  };
  useEffect(() => {
    Immersive.on();
    return () => {
      Immersive.off();
    };
  }, []);
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid >
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1682687220509-61b8a906ca19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MXwxfHNlYXJjaHwxfHxUcmF2ZWx8ZW58MXx8fHwxNzAyNTQ4MjgzfDA&ixlib=rb-4.0.3&q=80&w=1080',
        }}
        style={styles.image}
      />
      <ImageBackground
        style={styles.loginContainer}
        source={{
          uri: 'https://images.unsplash.com/photo-1682687220509-61b8a906ca19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MXwxfHNlYXJjaHwxfHxUcmF2ZWx8ZW58MXx8fHwxNzAyNTQ4MjgzfDA&ixlib=rb-4.0.3&q=80&w=1080',
        }}>
        <View style={styles.loginCurvedContainer}>
          <View style={styles.heading}>
            <Text style={styles.loginHeadText}>Login</Text>
            <Image
              source={require('../assets/userlogo.png')}
              style={styles.userLogo}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              onChangeText={email => setEmail(email.trim())}
              value={Email}
              onSubmitEditing={() => passwordField.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={passwordField}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="grey"
              onChangeText={pwd => setPassword(pwd.trim())}
              value={Password}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.login}
              onPress={() => handleLogin()}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
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
      
    </KeyboardAwareScrollView>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  loginContainer: {
    flex: 1.2,
    borderRadius: 40,
    transform: [{scaleY: -1}],
  },
  loginCurvedContainer: {
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: 'white',
    transform: [{scaleY: -1}],
  },

  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '35rem',
    paddingTop: '50rem',
  },
  loginHeadText: {
    fontSize: '25rem',
    color: 'black',
    fontWeight: 'bold',
  },
  userLogo: {
    width: '40rem',
    height: '40rem',
  },
  inputContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '35rem',
    paddingTop: '50rem',
    paddingBottom: '20rem'
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
  login: {
    width: '100%',
    aspectRatio: 4.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dd8716ff',
    borderRadius: 50,
    marginTop: '30rem',
  },
  loginText: {
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
    fontSize: '20rem',
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
