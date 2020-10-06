import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,TouchableHighlight,ImageBackground} from 'react-native';
import {f, auth, database,db} from './config/config.js';

export default class Login extends React.Component{
  
  static navigationOptions={
    title:'יצירת חשבון חדש',
    /*headerTitleStyle:{flex:1,textAlign:'center'},
    headerRight:(<view/>)*/
  }
constructor (props){
  super(props);
  this.state={
    loggedin: false, 
    email: "",
    password:"",
    name: "",
    phone:""
  };
  } 

  registerUser = (email, password)=>{
    console.log(email, password);
    auth.createUserWithEmailAndPassword(email, password)
    .then ((userObj) => {
      db.collection("usersTeacher").doc(userObj.user.uid).set({
        uid:userObj.user.uid,
        name:this.state.name,
        phone:this.state.phone,
        email:this.state.email,
        password:this.state.password
      }).then(function(){
        console.log("Ducument successfully written!");
      }).catch(function(error){
        console.log("Error writing document: ", error);
        alert('האימייל שהזנת אינו תקין');
      });
      })
  };

  signUserOut = () => {
    auth.signOut()
    .then(()=>{
      console.log('Logged out...');
    }).catch((error)=>{
      console.log('Error:', error);
    });
  }
  functiononPress3 = (email, password) =>{
    this.registerUser(email, password); 
    this.props.navigation.navigate('ConnectTeacher');
  }

render(){
  return (
    <ImageBackground style={ styles.imgBackground } 
      resizeMode='cover' 
      source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
      <View style={{padding:40}}>
        <TextInput placeholder="שם מלא" placeholderTextColor="white" style={styles.input }onChangeText={(text) => this.setState({name: text})} value={this.state.name}/>
        <TextInput keyboardType='numeric' placeholder="טלפון" placeholderTextColor="white" style={styles.input} onChangeText={(text) => this.setState({phone: text})} value={this.state.phone}/>
        <TextInput placeholder="אימייל" placeholderTextColor="white" style={styles.input } onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}/>
        <TextInput placeholder="סיסמא" placeholderTextColor="white" style={styles.input} onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true} value={this.state.password}/>
        <View style={{alignItems:'center'}}>
        <TouchableHighlight style= {{ margin:10,height: 35,width:300, borderWidth: 1, borderColor: '#262E4D',borderRadius: 8,padding: 5,backgroundColor:"#262E4D"}}>
          <Text onPress={()=>this.functiononPress3(this.state.email, this.state.password, this.state.name)} style={{fontSize:20,color:'white',alignSelf: 'center'}}>צור חשבון</Text>
        </TouchableHighlight>
        </View>
      </View>
    </ImageBackground>
  );
}
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding:40
    },
    input:{
      height:50,
      width:350,
      borderBottomWidth:1,
      margin:10,
      borderBottomColor:'white',
      textAlign:'right',
      paddingRight:20,
      color:'white'
    },
    imgBackground: {
      /*width: 450,
      height: 900,*/
      alignItems: 'center',
      flex:1,
      padding:40,
      position: 'relative'
    }
  });