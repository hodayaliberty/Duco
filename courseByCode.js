import React from 'react';
import { TouchableOpacity,StyleSheet, Text, View, Button, Image,TextInput,TouchableHighlight,ImageBackground, ButtonToolbar} from 'react-native';
import {f, auth, db} from './config/config';
import task from './task';
export default class courseByCode extends React.Component{
  static navigationOptions={
    header:null
}
  constructor(props) 
  {
    super(props);
    this.state={
      code:'',
      nameofcourse:"",
      nameofteacher:"",
      arroftasks:[],
      kita:"",
      uid:""
    };
  }

  componentDidMount(){
    this.getDataByCourse(this.props.navigation.getParam('code'))
  }

  getDataByCourse(id){
    var n=""
    var uid=""
    var k =''
    db.collection('courses').where('code', '==' , Number(id)).get()
    .then(snapshot=> {
      snapshot.forEach(doc => {
         n=doc.data().name
         uid=doc.data().uid
         k=doc.data().kita
      });
      console.log('name of course is',n)
      this.setState({nameofcourse:n,kita:k,uid:uid})
      this.findTeacher(uid)
      this.readTasks(n)

      })
      
  }

  findTeacher = (uid)=>{
    var nameT=""
    db.collection('usersTeacher').where('uid','==',uid).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        nameT=doc.data().name
      });
    this.setState({nameofteacher:nameT})
    })
  }
  readTasks=(n)=>{
    var arr=[]
    var a={}
    db.collection('tasks').where('name', '==' , n).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        a={name:doc.data().taskName}
        arr.push(a)
      });
    this.setState({arroftasks:arr})
    })
  }

 render(){
   console.log('my state is',this.state)
  const item=   
  this.state.arroftasks.map(t=>{
  return(
      <TouchableOpacity style={styles.CheckBox} key={t.id} onPress={()=>this.props.navigation.navigate('taskStudent',{nameTask:t.name,nameCourse:this.state.nameofcourse,kita:this.state.kita, studentDataObject:this.props.navigation.getParam('studentDataObject')})}>
          <Text style={{textAlign:'center', alignItems:'center', color:'#262E4D', fontSize:19}}>
              <Text style={{fontWeight: "bold"}}> {t.name}</Text>
          </Text>                    
      </TouchableOpacity>
  )
})
  return (
    <ImageBackground style={ styles.imgBackground } 
        resizeMode='cover' 
        source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
         <Text style={{fontSize:23,color:'white',textAlign:'right'}}>{this.state.nameofcourse} | <Text style={{fontSize:17,color:'white',textAlign:'right'}}>{this.state.nameofteacher}</Text></Text>
         <Text> {"\n"}</Text>
         {item}

    </ImageBackground>
    
  );
}
}
const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding:40
    },
    CheckBox:{
      margin: 2,
      textAlign:'right',
      width:250,
      height:70,
      backgroundColor: 'white',
      opacity: 0.5,
      borderRadius:10,
      alignSelf: 'center',
      overflow:'hidden',
      borderWidth:0.5,
      justifyContent:'space-between',
      padding:20
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