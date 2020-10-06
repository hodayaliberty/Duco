import React from 'react';
import { StyleSheet, Text, View, Button, Image,TextInput,TouchableHighlight,ImageBackground, ButtonToolbar} from 'react-native';
import {f, auth, db} from './config/config';
export default class ConnectTeacher extends React.Component{
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
          //console.log(user);
          this.setState({flag:1});
          if(this.state.flag == 1){
            f.auth().onAuthStateChanged(user => {
            let nameTRef = db.collection('usersTeacher').doc(user.uid);
            let nameT= nameTRef.get()
              .then(snapshot => { 
                const teacherData = {
                  firstName:snapshot.data().name,
                  image: 'https://firebasestorage.googleapis.com/v0/b/duko-facd8.appspot.com/o/image%2FteacherNew.jpg?alt=media&token=66decc23-e6d0-4444-be47-6b1a6fa13f1b'
                }
              this.props.navigation.navigate('createCourses',{nameT:snapshot.data().name,  studentDataObject: teacherData});
              console.log ( teacherData.firstName, teacherData.image)

            })
            })
          } 
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
      
    }
    render(){
        return (
          <ImageBackground style={ styles.imgBackground } 
            resizeMode='cover' 
            source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
            <Image source = {{uri:'http://www.up2me.co.il/imgs/56478781.png'}}
            style = {{ width: 200, height: 100,resizeMode: 'stretch'}}/> 
            <View style={{padding:40}}>
                <TextInput placeholder="אימייל" placeholderTextColor="white" style={styles.input } onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}/>
                <TextInput placeholder="סיסמא" placeholderTextColor="white" style={styles.input} onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                    value={this.state.password}/>
            </View>
            <View>
                <TouchableHighlight style= {{ margin:10,height: 35,width:300, borderWidth: 1, borderColor: '#262E4D',borderRadius: 8,padding: 5,backgroundColor:"#262E4D"}}onPress={()=>this.functiononPress(this.state.email, this.state.password)}>
                    <Text variant="raised"  style={{fontSize:20,color:'white',alignSelf: 'center'}}>התחבר</Text>
                </TouchableHighlight>
                <Text onPress={()=>this.props.navigation.navigate('Login')} style={{fontSize:15,color:'white',alignSelf: 'center'}}>צור חשבון</Text>
                
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