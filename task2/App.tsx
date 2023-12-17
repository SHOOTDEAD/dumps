import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./components/home"
import Album from "./components/albumview"

export type RootStackParamList = {
  Home:undefined;
  Albums:{Name:string}
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(){
return(
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Home' >
      <Stack.Screen
      name = 'Home'
      component={Home}
      options={{ headerShown: false }}
      />
      <Stack.Screen
      name = 'Albums'
      component={Album}
      />
    </Stack.Navigator>
  </NavigationContainer>
)

}
