import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View, Button, Image,TextInput,TouchableHighlight,ImageBackground, ButtonToolbar} from 'react-native';
import {f, auth, db} from './config/config';
export default class insertCode extends React.Component{
  static navigationOptions={
    header:null
}
  constructor(props) 
  {
    super(props);
    this.state={
      studentCode:"",
    };
    var that = this;
}
functionCode = (studentCode) => {
  if(studentCode=='')
    alert('נא הזן קוד');
  else{
    var c = ""
    db.collection('courses').where('code', '==' , Number(studentCode)).get()
    .then(snapshot=> {
      snapshot.forEach(doc => {
          c = doc.data().code
          if(Number(c)==Number(studentCode))
          {
            this.props.navigation.navigate('ConnectStudent',{Code:this.state.studentCode});
          }
          else
          {
            alert("קוד לא קיים");
          }
      });
    })
  }
}
render(){
    return (
    <ImageBackground style={ styles.imgBackground } 
        resizeMode='cover' 
        source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
        <Text style={{fontSize:25,color:'white',textAlign:'right'}}> יש לך קוד?</Text> 
        <TextInput keyboardType='numeric' placeholder="הקש כאן" placeholderTextColor="white" style={styles.input } onChangeText={(text) => this.setState({studentCode: text})}
        value={this.state.studentCode}/>
        <TouchableOpacity style= {{padding:9,borderWidth: 1,width:80,height:35,borderColor:'#262E4D',borderRadius: 0,backgroundColor:"#262E4D"}}>
            <Text style = {{fontSize:15,color:'white',flex: 1,alignSelf: 'center'}} onPress={()=>this.functionCode(this.state.studentCode)}>קדימה</Text>
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
      width:350,
      borderWidth:1,
      margin:10,
      borderColor:'white',
      textAlign:'right',
      paddingRight:20,
      color:'white'
    },
    imgBackground: {
        alignItems: 'center',
        flex:1,
        padding:40,
        position: 'relative'
    }
  });