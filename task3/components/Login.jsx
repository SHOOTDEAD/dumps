import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(Email, password);
      const user = auth().currentUser.email.slice(0, 4);
      const chatNames = ['abcd', 'bcde', 'cdef', 'group'].filter(
        name => name !== user,
      );
      navigation.navigate('Chats', {
        chatsname: [user, chatNames],
      });
    } catch (error) {
      setInvalidCredentials(true);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#FFFFFF"
        onChangeText={email => setEmail(email)}
        value={Email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#FFFFFF"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.login} onPress={() => handleLogin()}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
      {invalidCredentials && (
        <Text style={styles.errorMessage}>Invalid Credentials</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: 'black',
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderStyle: 'solid',
    backgroundColor: 'black',
    borderWidth: 5,
    marginBottom: 16,
    padding: 8,
    color: 'white',
  },
  login: {
    backgroundColor: 'black',
    width: '30%',
    height: '7%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 8,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  errorMessage: {
    fontSize: 15,
    color: 'red',
  },
});

export default LoginScreen;
