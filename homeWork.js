import React from 'react';
import { TouchableOpacity,RefreshControl, ActivityIndicator, StyleSheet, snapshot, Text, Component
  , View, Button, Image, TextInput, TouchableHighlight, ImageBackground, ListView, Alert, SnapshotViewIOS, ScrollView } from 'react-native';
import { f, auth, db, storage } from './config/config.js';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants'
import DateTimePicker from "react-native-modal-datetime-picker";
import { Overlay } from 'react-native-elements';
import { Ionicons, MaterialIcons, Fontisto } from '@expo/vector-icons';
import moment from 'moment';

export default class homeWork extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      taskName: "",
      details: "",
      nameT: "",
      image: null,
      data: [],
      courseName: "",
      isVisible: false,
      dedline: "",
      isVisible2: false,
      isDarkMode: false,
      dateDedline: "",
      refreshing:false
    };
  }
  showDatePicker = () => {
    this.setState({ isVisible2: true });
  }
  hideDatePicker = () => {
    this.setState({ isVisible2: false });
  }
  handleDatePicker = date => {
    this.setState({ dateDedline: String(date.getDate()) + '/' + String((date.getMonth() + 1)) + '/' + String(date.getFullYear()) });
    this.hideDatePicker();
  }
  componentDidMount() {
    this.getPermissionAsync();
    this.readTask(this.props.navigation.getParam('name'));
    this.setState({refreshing: false});
  }
  _onRefresh=()=>{
    this.setState({refreshing: true});
    this.componentDidMount()
  }
  readTask = (course) => {
    f.auth().onAuthStateChanged(user => {
      let taskRef = db.collection('tasks');
      let query = taskRef.where('uid', '==', user.uid);
      let a = query.where('name', '==', course).get()
        .then(snapshot => {
          var arr = []
          var a = {}
          snapshot.forEach(doc => {
            a = { taskName: doc.data().taskName, details: doc.data().details }
            arr.push(a)
          });
          this.setState({ data: arr })
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });
    })
  }
  saveTask = async (taskName, dateDedline, details, image, c) => {
    const response = await fetch(image);
    const blob = await response.blob();
    var uploadTask = f.storage()
      .ref()
      .child("image/" + taskName + dateDedline)
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
          this.setState({ image: downloadURL });
          //console.log("File available at", downloadURL);
          var user = f.auth().currentUser
          if (user) {
            db.collection("tasks").doc(taskName + details).set({
              uid: user.uid,
              taskName: taskName,
              dedline: dateDedline,
              details: details,
              image: this.state.image,
              name: c,
              kita:this.props.navigation.getParam('kita')
            })
              .then(function () {
                console.log("Document successfully updated!");
              }
              ).catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
              });
          }
        });
      }
    );
    this.setState({ loadImage: false });
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
  makeTrue = () => {
    this.setState({ isVisible: true });
  }
  makeFalse = () => {
    this.setState({ isVisible: false });
  }
  render() {
    const { image } = this.state;
    const { date } = this.state;
    const item =
      this.state.data.map(t => {
        return (
          <TouchableOpacity style={styles.CheckBox} key={t.id} onPress={() => this.props.navigation.navigate('task', { nameTask: t.taskName, courseN: this.props.navigation.getParam('name'), nameT: this.props.navigation.getParam('nameT'), dedline: this.state.dateDedline, details: t.details, image: this.state.image, kita: this.props.navigation.getParam('kita'), studentDataObject:this.props.navigation.getParam('studentDataObject') })}>
            <Text style={{ textAlign: 'center', alignItems: 'center', color: '#262E4D', fontSize: 19 }}>
              <Text> {t.taskName} </Text>
            </Text>
          </TouchableOpacity>
        )
      })
    return (
      <ImageBackground style={styles.imgBackground}
        resizeMode='cover'
        source={{ uri: 'http://www.up2me.co.il/imgs/20894368.png' }}>
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}/>}>
        <Overlay onBackdropPress={() => this.setState({ isVisible: false })} overlayStyle={{ borderRadius: 10, alignItems: 'center', backgroundColor: 'white', opacity: 0.7 }} isVisible={this.state.isVisible} height="auto">
            <Text style={{ fontSize: 15, color: '#262E4D', textAlign: 'right' }}> עדכון מטלה חדשה</Text>
            <TextInput placeholder="שם המטלה" placeholderTextColor="#262E4D" style={styles.input} onChangeText={(text) => this.setState({ taskName: text })} value={this.state.taskName} />
            <View style={{ height: 50, width: 280, borderWidth: 1, margin: 10, borderColor: '#262E4D', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
              <Fontisto name="date"
                style={{paddingRight:5,paddingTop:5}} size={30} color="#262E4D"
                onPress={this.showDatePicker} />
              <Text style={{margin: 10,textAlign: 'right',paddingRight: 5,flex:1,color: '#262E4D',paddingTop:5}}>תאריך להגשה</Text>
              <DateTimePicker
                isVisible={this.state.isVisible2}
                onConfirm={this.handleDatePicker}
                onCancel={this.hideDatePicker}
              />
            </View>
            <TextInput placeholder="פרטי המטלה" placeholderTextColor="#262E4D" multiline={true} style={styles.input2} onChangeText={(text) => this.setState({ details: text })} value={this.state.details} />
            <View style={{justiftyContent:"center",alignItems:"center"}}>
              <MaterialIcons onPress={this._pickImage} name="add-a-photo" size={55} color="#262E4D" opacity="0.5" />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <TouchableHighlight style={{ margin: 10, height: 35, width: 100, borderWidth: 1, borderColor: '#262E4D', borderRadius: 8, padding: 5, backgroundColor: "#262E4D" }} onPress={() => this.saveTask(this.state.taskName, this.state.dateDedline, this.state.details, this.state.image, this.props.navigation.getParam('name'))}>
                <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }} >שמור</Text>
              </TouchableHighlight>
            </View>
        </Overlay>
        {
          this.state.loadImage ?
            <ActivityIndicator
              size="large"
              color="#540863"
              style={{ alignItems: "center" }}
            />
            :

            <View style={{ alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 25, color: 'white' }}> {this.props.navigation.getParam('name')} | {this.props.navigation.getParam('code')}</Text>
              </View>
              <Text>{"\n"}</Text>
              {item}
              <Text>{"\n"}</Text>
              <Ionicons onPress={() => this.makeTrue()} name="ios-add-circle-outline" size={55} color="white" opacity="0.5" />
            </View>
        }
      </ScrollView>
      </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 40
  },
  input: {
    height: 50,
    width: 280,
    borderWidth: 1,
    margin: 10,
    borderColor: '#262E4D',
    textAlign: 'right',
    paddingRight: 20,
    color: '#262E4D'
  },
  input2: {
    height: 200,
    width: 280,
    borderWidth: 1,
    margin: 10,
    borderColor: '#262E4D',
    textAlign: 'right',
    paddingRight: 5,
    color: '#262E4D',
    textAlignVertical: 'top'
  },
  imgBackground: {
    /*width: 450,
    height: 900,*/
    alignItems: 'center',
    flex: 1,
    padding: 40,
    position: 'relative'
  },
  CheckBox: {
    margin: 2,
    textAlign: 'right',
    width: 325,
    height: 75,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 0.5,
    justifyContent: 'space-between',
    padding: 20
  }
});