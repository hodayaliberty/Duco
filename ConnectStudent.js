import React from 'react';
import { StyleSheet, Text,TouchableOpacity, View, Button, Image,TextInput,TouchableHighlight,ImageBackground, ButtonToolbar} from 'react-native';
import {f, auth, db} from './config/config';
import * as ImagePicker from 'expo-image-picker';

export default class ConnectStudent extends React.Component{
  static navigationOptions={
    header:null
}
  constructor(props) 
  {
    super(props);
    this.state={
      privateName:"",
      lastName:"",
      image: "http://www.up2me.co.il/imgs/9827160.png",
      code: ""
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

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
  
    console.log(result);
  
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  handleSignUpPro = async () => {
      const response = await fetch(this.state.image);
      const blob = await response.blob();
      var uploadTask = Firebase.storage()
        .ref()
        .child("image/" + this.state.email)
        .put(blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.setState({ image: downloadURL });
            console.log("downloadURL");
            this.props.navigation.navigate("SignUpPro2", this.state);
          });
        }
      );
    
  };

  signUserOut = () =>{
    auth.singOut().then(() => {
    console.log('Logged out');}).catch((error) => {
    console.log('Error:',error);
    });
  }

  functiononPress = (email, password)=>{
    this.loginUser(email, password)
    if(this.state.flag == 1){
      this.props.navigation.navigate('code');
    }
  }
  saveStudent = (fn,ln,img) => {
    const studentData = {
      firstName:fn,
      lastName:ln,
      image: img
    }
    db.collection("userStudents").doc().set(studentData).then(
      this.props.navigation.navigate('courseByCode',{code:this.props.navigation.getParam('Code'), studentDataObject: studentData}, )
    )
  }
    render(){
      return (
        <ImageBackground style={ styles.imgBackground } 
        resizeMode='cover' 
        source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
        <Text style={{fontSize:25,color:'white',textAlign:'right'}}> רגע לפני שמתחילים</Text> 
        <TouchableOpacity onPress={this._pickImage}>
                <Image
                  style={{ width: 100, height: 100, resizeMode: "stretch"}}
                  source={{ uri: this.state.image }}
                />
        </TouchableOpacity>
        <View style={{flexDirection:'row-reverse'}}>
          <TextInput placeholder=" שם פרטי" placeholderTextColor="white" style={styles.input } onChangeText={(text) => this.setState({privateName: text})}
          value={this.state.privateName}/>
          <TextInput placeholder="שם משפחה" placeholderTextColor="white"  style={styles.input2 } onChangeText={(text) => this.setState({lastName: text})}
          value={this.state.lastName}/>
       </View>
        <TouchableOpacity style= {{padding:9,borderWidth: 1,width:80,height:35,borderColor:'#262E4D',borderRadius: 0,backgroundColor:"#262E4D"}}>
            <Text style = {{fontSize:15,color:'white',flex: 1,alignSelf: 'center'}} onPress={()=>this.saveStudent(this.state.privateName,this.state.lastName,this.state.image)}>שמירה</Text>
        </TouchableOpacity>
        
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
      width:140,
      borderWidth:1,
      margin:10,
      borderColor:'white',
      alignSelf:'center',
      textAlign:'right',
      paddingRight:20,
      color:'white'
    },
    input2:{
      height:50,
      width:180,
      borderWidth:1,
      margin:10,
      borderColor:'white',
      alignSelf:'center',
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