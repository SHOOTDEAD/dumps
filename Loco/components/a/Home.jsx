import {Text, View, Image, Dimensions, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

EStyleSheet.build({$rem: Dimensions.get('window').width / 380});

export default function HomeScreen({navigation}) {
  const handleSignup = () => {
    navigation.navigate('Signup');
  };
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loco</Text>
      <Text style={styles.tagline}>
        Track your location in real-time with Loco.
      </Text>
      <Image
        source={{
          uri: 'https://assets.api.uizard.io/api/cdn/stream/327ec1c2-efd2-4ea8-9f10-b113765d193f.png',
        }}
        style={styles.image}
      />
      <TouchableOpacity style={styles.signup} onPress={() => handleSignup()}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>
      <View style={styles.login}>
        <Text style={styles.loginText}>
          Already have an account{' '}
          <Text style={styles.loginLink} onPress={() => handleLogin()}>
            Log in
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: '40rem',
    color: '#dd8716ff',
    marginBottom: '10rem',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: '15.5rem',
    color: 'black',
    marginBottom: '40rem',
  },
  image: {
    width: '100%',
    aspectRatio: 1.2,
  },
  signup: {
    width: '85%',
    aspectRatio: 4.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dd8716ff',
    borderRadius: 50,
  },
  signupText: {
    fontSize: '18rem',
    color: 'white',
  },
  loginText: {
    fontSize: '15.5rem',
    color: 'black',
    marginTop: '20rem',
  },
  loginLink: {
    fontSize: '18rem',
    fontWeight: 'bold',
  },
});
