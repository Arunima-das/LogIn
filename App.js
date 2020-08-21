import React, { useEffect,useState,useMemo } from 'react';
import { 
    NavigationContainer,
    DefaultTheme as NavigationDefaultTheme,
    DarkTheme as NavigationDarkTheme,
      } from '@react-navigation/native';
import  DrawerContent from './screens/DrawerContents';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
   Provider as PaperProvider,
   DefaultTheme as PaperDefaultTheme,
    DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import MainTabScreen from './screens/MainTabScreen';
import SupportScreen from './screens/SupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import BookmarkScreen from './screens/BookmarkScreen';
import {AuthContext} from './component/context';
import AsyncStorage from '@react-native-community/async-storage';
import RootStackScreen from './screens/RootStackScreen';
import { View,ActivityIndicator } from 'react-native';
import db from './Model/db';
const Drawer = createDrawerNavigator();


const App=()=>{
 // const [isLoading,setIsLoading]=useState(true);
// const [userToken,setUserToken]=useState(null);
const [isDarkTheme, setIsDarkTheme] = React.useState(false);
const initialLoginState = {
  isLoading: true,
  userName: null,
  userToken: null,
};
 const CustomDefaultTheme ={
   ...NavigationDefaultTheme,
   ...PaperDefaultTheme,
   colors:{
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
   }
 }
 
 const CustomDarkTheme ={
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors:{
   ...NavigationDarkTheme.colors,
   ...PaperDarkTheme.colors,
  }
}
 const theme = isDarkTheme? CustomDarkTheme:CustomDefaultTheme;
const loginReducer = (prevState, action) => {
  
  switch( action.type ) {
    case 'RETRIEVE_TOKEN':
      return{
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
      case 'LOGIN':
      return{
        ...prevState,
        userName:action.id,
        userToken: action.token,
        isLoading: false,
      };
      case 'LOGOUT':
      return{
        ...prevState,
        userName:null,
        userToken: null,
         isLoading: false,
      };
      case 'REGISTER':
      return{
        ...prevState,
        userName:action.id,
        userToken: action.token,
        isLoading: false,
      };
  }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

 const authContext=useMemo(()=>({

  signIn: async(foundUser)=>{
    
    // setUserToken('fgkj');
    //setIsLoading(false);
    const userToken = String(foundUser.userToken);
    const userName = foundUser.username;
      try {
      await AsyncStorage.setItem('userToken', userToken);
     } catch(e) {
      console.log(e);
   }
   //console.log('user token:',userToken);
   dispatch({ type : 'LOGIN' ,id: userName,token: userToken});
 },

 signOut:async()=>{
  
  //setUserToken(null);
  //setIsLoading(false);
  try {
     await AsyncStorage.removeItem('userToken');
   } catch(e) {
    console.log(e);
   }
  dispatch({ type : 'LOGOUT'});
},

signUp : async(foundUser) => {
	db.signUp(foundUser.userName, foundUser.password).then(async(userToken) => {
		if(userToken){
			await AsyncStorage.setItem("userToken", userToken);
      	dispatch({type: "LOGIN", id:foundUser.userName, token:userToken});
    }
  })
},
toggleTheme:()=>{
  setIsDarkTheme(isDarkTheme => !isDarkTheme);
}
 }),[]);


 useEffect(()=>{
   setTimeout(async()=> {
      //setIsLoading(false);
      let userToken;
      userToken= null;
      try {
      userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
       console.log(e);
      }
     // console.log('user token:',userToken);
      dispatch({ type: 'REGISTER', token: userToken});
  },1000);
}, []);

if(loginState.isLoading){
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large"/>
    </View>
  );
}

return(
  <PaperProvider theme={theme}>
 <AuthContext.Provider value={authContext}>
    <NavigationContainer theme={theme} >
       {loginState.userToken !== null ? (
         <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
             <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
             <Drawer.Screen name="SupportScreen" component={SupportScreen} />
             <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
             <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
         </Drawer.Navigator>
       )
     :
      <RootStackScreen/>
        }
  	</NavigationContainer> 
  </AuthContext.Provider>
  </PaperProvider>
);
}
export default App;