import { StyleSheet, Text, View,TextInput,TouchableOpacity,FlatList, KeyboardAvoidingView,Keyboard,Dimensions} from 'react-native'
import React,{useEffect,useState,useRef} from 'react'
import {firebase} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';


export default function ChatScreen({route,navigation}) {
  let {Target} = route.params
  const [chat,setChat] = useState(null)
  const [chatData, setChatData] = useState(null);
  const user = auth().currentUser.email.slice(0,4)
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: Target,
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'whitesmoke',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}, [navigation]);
  useEffect(() => {
    
    if(Target != "group"){
        if(user < Target){
            Target = `${user}-${Target}`
        }
        else{
            Target = `${Target}-${user}`
        }
    }
  })
 
    const fetchData = async () => {
        const snapshot = await  firebase.app()
        .database('https://chatapp-d1dc6-default-rtdb.asia-southeast1.firebasedatabase.app/')
        .ref(`Chats/${Target}`).once("value")
        let data = snapshot.val()
        delete data.members
        data =Object.entries(data)
        
        data = data.sort((a, b) => {
            return new Date(a[1].timestamp) - new Date(b[1].timestamp);
          });
        data = Object.values(data).map(val => ([val[1].sender,val[1].text,new Date(val[1].timestamp).toLocaleString()]));
        if (data != chatData){
            setChatData(data)
            

        }
     };

   
    useEffect(() => {
        
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
      }, []);
  
    const updateMessage = async() =>{
        const ref = await  firebase.app()
        .database('https://chatapp-d1dc6-default-rtdb.asia-southeast1.firebasedatabase.app/')
        .ref(`Chats/${Target}`)
        if (chat.trim() !== ""){
        const currentTime = new Date().toISOString();
        ref.push({
            text:chat,
            sender:user,
            timestamp:currentTime
        })
        setChat("")
    }}
    
    return (
        <>
        <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data ={chatData}
          numColumns={1}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            const isUser = user === item[0] ? true : false
            const isGroup = Target === "group" && user !== item[0] ? true : false
           return (
            <View
              style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.incomingMessageContainer,
              ]}
            >
              <Text style={isUser ? styles.userMessage : styles.incomingMessage}>
                {isGroup ? item[0]+'\:' :""}
                {'\n'}
                {item[1]}
                {'\n'}
                at {item[2]}
                
                
              </Text>
            </View>
          );
        }}
          
          onContentSizeChange={() => {
            if (flatListRef.current && chatData && chatData.length > 0) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
          />

        </View>
      <KeyboardAvoidingView
      behavior={'height'}
      style={styles.container}
    >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={chat}
            onChangeText={setChat}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.button} onPress={() => updateMessage()}>
       <Text style={styles.text}>send</Text>
      </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
      </>
    );
  };
  
  const styles = StyleSheet.create({
    chatContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      padding: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    input: {
      flex: 3,
      height: 40,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      marginRight: 8,
      color:"black"
    },
    sendButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: 'blue',
    },
    sendButtonText: {
      color: 'white',
    },
    button: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8, 
            marginRight:5,
            height: 50,
            backgroundColor: 'black', 
            borderWidth: 5,
            borderColor: 'gray',
          },
          text: {
            color: 'white',
            fontSize: 20,
          },
          hiddenContainer: {
            height: 100, 
          },
          messageContainer: {
            flexDirection: 'row',
            marginBottom: 8,
          },
          userMessageContainer: {
            justifyContent: 'flex-end',
          },
          incomingMessageContainer: {
            justifyContent: 'flex-start',
          },
          userMessage: {
            color: 'black',
            fontSize: 20,
            textAlign: 'right', 
          },
          incomingMessage: {
            color: 'black',
            fontSize: 20,
            textAlign: 'left', 
          },
  });
  
