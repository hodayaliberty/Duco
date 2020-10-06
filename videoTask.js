import React, { Component } from 'react'
import { Text, View , ImageBackground, StyleSheet} from 'react-native'
import ListOfVideo from './component/ListOfVideo.js';
import { f, auth, db } from './config/config.js';

export default class videoTask extends Component {
    static navigationOptions = {
        header: null
    }



    componentDidMount() {

       
    
         this.getListOfVideo();
        
      }
    getListOfVideo = (item) => {

        db.collection('videos').onSnapshot(snapshot => {
          const videoGet = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
    
          console.log("2333====videoGet=======" + JSON.stringify(videoGet));
          this.setState({ listOfOfVideo: videoGet });
    
    
        })
      }
    constructor(props) {
        super(props);
        this.state = {
        
          listOfOfVideo: [],
         
          
        };
      }
    render() {
        return (
            <ImageBackground style={ styles.imgBackground } 
            resizeMode='cover' 
            source={{uri:'http://www.up2me.co.il/imgs/20894368.png'}}>
            <View>
                 <ListOfVideo videoList = {this.state.listOfOfVideo} navigation={this.props.navigation} studentData={{firstName:'alex', last:'ak', image:'http://www.up2me.co.il/imgs/9827160.png'}}/>
            </View>
    
        </ImageBackground>
         
        )
    }
}
const styles = StyleSheet.create({
  
    imgBackground: {
        alignItems: 'center',
        
        position: 'relative'
    }
  });