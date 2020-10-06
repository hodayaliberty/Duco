import React from 'react';
import {RefreshControl, TouchableOpacity, FlatList, StyleSheet, snapshot, Text, Component, View, Button, Image, TextInput, ScrollView, TouchableHighlight, ImageBackground, ListView, Alert, SnapshotViewIOS } from 'react-native';
import { f, auth, db } from './config/config.js';
import courseByCode from './courseByCode';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import { Overlay } from 'react-native-elements';
import { Ionicons, MaterialIcons, Fontisto } from '@expo/vector-icons';
//import Video from 'react-native-video';
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import CloseIcon from 'react-native-vector-icons/Feather';
import ListOfVideo from './component/ListOfVideo.js';
//https://github.com/ihmpavel/expo-video-player
//npm install expo-video-player
//expo install expo-av @react-native-community/netinfo

export default class taskStudent extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      image: "",
      details: "",
      dedline: "",
      uid: "",
      nameTeacher: "",
      days: "",
      video: false,
      studentUploadListData: [],
      //video: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540alexak%252Fmy-new-project/ImagePicker/69d96212-41a8-4453-a12d-5f04d2183f2a.mp4",
      // video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      refreshing:false,
      isVisible: false,
      listOfOfVideo: [],
      studentSubmit:"",
      defultImage: 'http://www.up2me.co.il/imgs/9827160.png'
    };
  }
  componentDidMount() {
    console.log("*****************************88****8" + JSON.stringify(this.props.navigation.getParam('studentDataObject')));
    // Alert.alert(JSON.stringify(this.props.navigation.getParam('studentDataObject')));
    this.getListOfVideo();
    this.findTask(this.props.navigation.getParam('nameTask'))
    this.getPermissionAsync();
    this.setState({refreshing: false});
  }
  _onRefresh=()=>{
    this.setState({refreshing: true});
    this.componentDidMount()
  }
  findTask = (nameTask) => {
    var i = ""
    var d = ""
    var dd = ""
    var uid = ""
    db.collection('tasks').where('taskName', '==', nameTask).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          i = doc.data().image
          d = doc.data().details
          dd = doc.data().dedline
          uid = doc.data().uid
        });
        this.setState({ imagetask: i, details: d, dedline: dd, uid })
        this.getNameTeacher(uid)
        this.getListOfStudentThatUploadedVideo(uid);
        this.getDedline(this.props.navigation.getParam('nameTask'), this.state.details)
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  getListOfStudentThatUploadedVideo = (uid) => {
    console.log("73=====uid===============") + JSON.stringify(uid);
    db.collection('video').where('uid', '==', uid).get()
      .then(snapshot => {
        let studentVideoList = [];
        snapshot.forEach(doc => {
          studentVideoList.push(doc.data());
        });
        console.log("73==========74==========") + JSON.stringify(studentVideoList);
        this.setState({ studentUploadListData: studentVideoList })
      })
  }

  getNameTeacher = (uid) => {
    var t = ""
    db.collection('usersTeacher').where('uid', '==', uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          t = doc.data().name
        });
        this.setState({ nameTeacher: t })
      })
  }
  getDedline = (name, details) => {
    var user = f.auth().currentUser
    if (user) {
      db.collection("tasks").doc(name + details).get()
        .then(doc => {
          this.setState({ image: doc.data().image });
          this.setState({ dedline: doc.data().dedline });
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }
    const end = this.state.dedline;
    var temp = end.split("/");
    var day = Number(temp[0])
    var month = Number(temp[1])
    var year = Number(temp[2])
    var dayN = new Date().getDate()
    var monthN = (new Date().getMonth() + 1)
    var yearN = new Date().getFullYear()
    var count = 0
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const monthDays2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year == yearN && month == monthN) {
      count = day - dayN
    }
    if (year == yearN && month != monthN) {
      if (monthN == 2) {
        if (this.leapYear(yearN)) {
          temp = 29 - dayN
          count += temp
          for (i = monthN; i < month; i++) {
            count += monthDays2[i]
          }
        }
        else {
          temp = 28 - dayN
          count += temp
          for (i = monthN; i < month; i++) {
            count += monthDays[i]
          }
        }
      }
      else {
        temp = monthDays[monthN - 1] - dayN
        count = temp
        for (i = monthN; i < month; i++) {
          count += monthDays[i]
        }
        count -= (monthDays[month - 1] - day)
      }
    }
    if (year != yearN) {
      if (this.leapYear(yearN)) {
        var temp = monthDays2[monthN - 1] - dayN
        count += temp
        for (i = monthN; i < 12; i++) {
          count += monthDays2[i]
        }
        if (this.leapYear(year)) {
          count += day
          for (i = 0; i < month - 1; i++) {
            count += monthDays2[i]
          }
        }
        else {
          count += day
          for (i = 0; i < month - 1; i++) {
            count += monthDays[i]
          }
        }
      }
      else {
        var temp = monthDays[monthN - 1] - dayN
        count += temp
        for (i = monthN; i < 12; i++) {
          count += monthDays[i]
        }
        if (this.leapYear(year)) {
          count += day
          for (i = 0; i < month - 1; i++) {
            count += monthDays2[i]
          }
        }
        else {
          count += day
          for (i = 0; i < month - 1; i++) {
            count += monthDays[i]
          }
        }
      }
    }
    if (count < 0) {
      count = 0
    }
    this.setState({ days: count });
  }
  leapYear = (year) => {
    if (Number(year) % 4 == 0) {
      if (Number(year) % 100 == 0) {
        if (Number(year) % 400 == 0) {
          return (true);
        }
        else {
          return (false);
        }
      }
      else {
        return (true);
      }
    }
    else {
      return (false);
    }
  }
  makeTrue = () => {
    this.setState({ isVisible: true });
  }
  makeFalse = () => {
    this.setState({ isVisible: false });
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }




  getListOfVideo = (item) => {
    db.collection('videos').where('nameTask', '==' ,this.props.navigation.getParam('nameTask')).get()
      .then(snapshot=> {
        const videoGet = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        this.setState({ listOfOfVideo: videoGet });
        this.setState({ studentSubmit: videoGet.length }); 
      })  
    }


  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //mediaType: 'video',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
  

    console.log(result);

    if (!result.cancelled) {
      this.setState({ video: result.uri });
    }
  };
  saveVideo = async (nameTask, video, details, studentData) => {

    console.log("saveVideo==================" + JSON.stringify(studentData));


    const response = await fetch(video);
    const blob = await response.blob();
    var uploadTask = f.storage()
      .ref()
      .child("video/" + nameTask )
      .put(blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        console.log("snapshop" + snapshot.state)
        switch (snapshot.state) {
          case 'paused': // or 'paused'
            console.log("Upload is paused");
            break;
          case 'running': // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ video: downloadURL });
          //console.log("File available at", downloadURL);
          var user = f.auth().currentUser

          console.log("257==================" + JSON.stringify(user));
          if (user) {

            const videoObject = {
              commentNumber: 0,
              uid: user.uid,
              nameTask: nameTask,
              details: details,
              video: this.state.video,
              likesNum: 0,
              studentFirstName: studentData.firstName,
              studentLastName: studentData.lastName,
              studentImage: studentData.image,

            }


            db.collection("videos").add(videoObject).then(function () {
              console.log("Document successfully added!");
            }

            ).catch(function (error) {
              // The document probably doesn't exist.
              console.error("Error updating document: ", error);
            });


            // db.collection("videos").doc(nameTask + details).set({
            //   uid: user.uid,
            //   nameTask: nameTask,
            //   details: details,
            //   video: this.state.video
            // })
            //   .then(function () {
            //     console.log("Document successfully updated!");
            //   }
            //   ).catch(function (error) {
            //     // The document probably doesn't exist.
            //     console.error("Error updating document: ", error);
            //   });
          }
        });
      }
    );
    this.setState({ isVisible: false });
  }

  render() {
    const { video } = this.state.video;
    const { image } = this.state.image;



    // const currentUser = {
    //   "firstName": "alex2",
    //   "lastName": "ss",
    //   "studentImage": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540alexak%252Fmy-new-project/ImagePicker/39ac29e3-55aa-453c-a28e-956436b39311.jpg",

    // }


    return (


      <ImageBackground style={styles.imgBackground}
        resizeMode='cover'
        source={{ uri: 'http://www.up2me.co.il/imgs/20894368.png' }}>
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}/>}> 
        <View style={{ marginTop:30}}>
            <View style={{ alignItems: "center", backgroundColor: "#262E4D", height: 55, padding: 12, marginTop: 20 }}>
              <Text style={{ textAlign: 'right', fontSize: 22, color: 'white', fontWeight: "bold" }}> {this.props.navigation.getParam('nameCourse')}
                <Text style={{ textAlign: 'right', fontSize: 17, color: 'white', fontWeight: "normal" }}> {this.state.nameTeacher} | {this.props.navigation.getParam('kita')}</Text>
              </Text>
            </View>
            <View style={{ textAlign: 'right', alignSelf: 'stretch', alignItems: "center" }}>
              <Text style={{ textAlign: "right", fontWeight: "bold", color: "white", fontSize: 20 }}>{"\n"}{this.props.navigation.getParam('nameTask')} </Text>
              <Text style={{ textAlign: "right", color: "white", fontSize: 16 }}>{this.state.days} ימים להגשה | {this.state.studentSubmit} תלמידים הגישו {"\n"}</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Image source={{ uri: this.state.imagetask }}
                style={{ width: 200, height: 165, resizeMode: 'stretch', borderRadius: 8, alignItems: "center" }} />
            </View>

            <View style={{ textAlign: 'right', alignSelf: 'stretch', alignItems: "center" }}>
              <Text style={{ textAlign: "right", color: "white", fontSize: 16 }}>{"\n"}{this.state.details}</Text>
            </View>


            <View style={{justiftyContent:"center",alignItems:"center"}}>
              <Ionicons onPress={() => this.makeTrue()} name="ios-add-circle-outline" size={55} color="white" opacity="0.5" />
            </View>

            <Overlay onBackdropPress={() => this.setState({ isVisible: false })} overlayStyle={{ borderRadius: 10, alignItems: 'center', backgroundColor: 'white', opacity: 0.7 }} isVisible={this.state.isVisible} height="auto">
              <CloseIcon name="x" size={25} color="#000" onPress={() => this.setState({ isVisible: false })} />

              <Text style={{ fontSize: 15, color: '#262E4D', textAlign: 'right' }}> הוספת סרטון חדש</Text>
              <Ionicons name="ios-videocam" onPress={this._pickImage} size={55} color="#262E4D" opacity="0.5" />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <TouchableHighlight style={{ margin: 10, height: 35, width: 100, borderWidth: 1, borderColor: '#262E4D', borderRadius: 8, padding: 5, backgroundColor: "#262E4D" }} onPress={() => this.saveVideo(this.props.navigation.getParam('nameTask'), this.state.video, this.state.details, this.props.navigation.getParam('studentDataObject'))}>
                <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }} >שמור</Text>
              </TouchableHighlight>
            </Overlay>



            <ListOfVideo videoList={this.state.listOfOfVideo} navigation={this.props.navigation} />




        </View> 
        </ScrollView>
      </ImageBackground>


    );
  }
}
const styles = StyleSheet.create({
  imgBackground: {
    alignItems: 'center',
    flex: 1,
  },
  VideoImageView: {
    width: 150, height: 150, borderRadius: 150 / 2
  },
});