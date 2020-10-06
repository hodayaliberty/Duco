import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,TouchableHighlight,ImageBackground, ButtonToolbar,TouchableOpacity} from 'react-native';
import {f, auth, database} from './config/config';

console.disableYellowBox = true;
export default class Home extends React.Component{
  static navigationOptions={
      header:null
  }
  constructor(props) 
  {
    super(props);
    this.state={
      loggedin: false, 
      email: "",
      password:"",
      name: "",
      flag: 0
    };
    var that = this;
    f.auth().onAuthStateChanged(function(user){
      if(user){
        that.setState({Loggedin:true});
        console.log('Logged in',user);
      }
      else{
        that.setState({Loggedin:false});
        console.log('Logged out');
      }
    });
  }
  loginUser= async(email, pass) =>{
    if(email != '' && pass != ''){
      try{
        let user= await auth.signInWithEmailAndPassword(email,pass);
        console.log(user);
        this.setState({flag:1});
        }catch(error){
          alert('אחד מהפרטים שהזנת אינו תואם');
        }
      }else{
      alert('אחד או יותר מהפרטים המזהים שהקלדת-אינו תואם')
    }
  }

  signUserOut = () =>{
    auth.singOut().then(() => {
    console.log('Logged out');}).catch((error) => {
    console.log('Error:',error);
    });
  }

  functiononPress = (email, password)=>{
    this.loginUser(email, password)
    if(this.state.flag == 1){
      this.props.navigation.navigate('createCourses');
    }
  }

  render(){

   

   
  return (
    <ImageBackground style={ styles.container } 
      resizeMode='cover' 
      source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
      <Image source = {{uri:'http://www.up2me.co.il/imgs/56478781.png'}}
      style = {{ width: 200, height: 100,resizeMode: 'stretch'}}/>
      <Text style={{fontSize:20,color:'white'}}>ברוכים הבאים!</Text> 
      <View style={{marginTop:250 , flexDirection:"column", alignSelf:"stretch"}}>
        <TouchableOpacity style= {{ padding:10 ,borderWidth: 1,borderColor: 'white',borderRadius: 8, marginBottom:20}}onPress={()=>this.props.navigation.navigate('ConnectTeacher')}>
          <Text style = {{fontSize:18,color:'white',alignSelf: 'center'}} >
              התחברות כמורה
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style= {{ padding:10 ,backgroundColor: 'white',borderRadius: 8}}onPress={()=>this.props.navigation.navigate('insertCode')}>
          <Text style = {{fontSize:18,color:'#114f70',alignSelf: 'center'}} >
              התחברות כתלמיד
          </Text>
        </TouchableOpacity>
      
      </View>
    </ImageBackground>
 
  );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex:1,
    padding:40,
  },
  

});