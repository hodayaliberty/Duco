import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image,TextInput,TouchableHighlight,ImageBackground,TouchableOpacity} from 'react-native';
import {f, auth, database,db} from './config/config.js';

export default class LoginStudent extends React.Component{
    constructor (props){
        super(props);
        this.state={
          loggedin: false, 
          email: "",
          password:"",
          name: ""
        };
    } 
    registerUser = (email, password)=>{
        console.log(email, password);
        auth.createUserWithEmailAndPassword(email, password)
        .then ((userObj) => {
        db.collection("usersStudent").doc(userObj.user.uid).set({
            uid:userObj.user.uid,
            name:this.state.name,
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
    functiononPress = (email, password) =>{
        if (this.registerUser(email, password)) {
        this.props.navigation.navigate('MyCourses');
        }
    }
    functiononPress3 = (email, password) =>{
        this.registerUser(email, password); 
        this.props.navigation.navigate('ConnenctStudent');
    }
  render(){
    return (
      <ImageBackground style={ styles.imgBackground } 
        resizeMode='cover' 
        source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
        <View style={{padding:40}}>
          <TextInput placeholder="שם" placeholderTextColor="white" style={styles.input }onChangeText={(text) => this.setState({name: text})} value={this.state.name}/>
          <TextInput placeholder="אימייל" placeholderTextColor="white" style={styles.input } onChangeText={(text) => this.setState({email: text})}
            value={this.state.email}/>
          <TextInput placeholder="סיסמא" placeholderTextColor="white" style={styles.input} onChangeText={(text) => this.setState({password: text})}
            secureTextEntry={true} value={this.state.password}/>
          <TouchableHighlight style={{margin:10}}>
            <Text onPress={()=>this.functiononPress3(this.state.email, this.state.password, this.state.name)}>צור חשבון</Text>
          </TouchableHighlight>
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
      borderWidth:1,
      margin:10,
      borderColor:'white',
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