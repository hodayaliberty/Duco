import React from 'react';
import { TouchableOpacity,RefreshControl, FlatList, StyleSheet, snapshot, ScrollView, Text, Component, View, Button, Image, TextInput, TouchableHighlight, ImageBackground, ListView, Alert, SnapshotViewIOS } from 'react-native';
import { f, auth, db } from './config/config.js';
import homeWork from './homeWork';
import moment from 'moment';
import ListOfVideo from './component/ListOfVideo.js';
export default class task extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      dedline: "",
      image: null,
      days: "",
      listOfOfVideo: [],
      refreshing:false,
      studentSubmit:""
    };
  }
  componentDidMount() {
    this.getListOfVideo();
    // this.setState({days:this.getDedline(this.props.navigation.getParam('nameTask'),this.props.navigation.getParam('details'))})
    this.getDedline(this.props.navigation.getParam('nameTask'), this.props.navigation.getParam('details'));
    this.setState({refreshing: false});
  }
  _onRefresh=()=>{
    this.setState({refreshing: true});
    this.componentDidMount()
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

  saveDays = (taskName, details, days) => {
    db.collection("tasks").doc(taskName + details).update({ days: days });
  }
  getDedline = (name, details) => {
    var user = f.auth().currentUser
    if (user) {
      db.collection("tasks").doc(name + details).get()
        .then(async doc => {
          await this.setState({ image: doc.data().image });
          await this.setState({ dedline: doc.data().dedline });
          this.countDeadline()
        })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }


  }

  countDeadline() {

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
    this.setState({ days: count })
    this.saveDays(this.props.navigation.getParam('nameTask'), this.props.navigation.getParam('details'), count);

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

  render() {
    return (
      <ImageBackground style={styles.imgBackground}
        resizeMode='cover'
        source={{ uri: 'http://www.up2me.co.il/imgs/20894368.png' }}>
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}/>}>
        <View style={{ marginTop:30}}>
          <View style={{ alignItems: "center", backgroundColor: "#262E4D", height: 55, padding: 12, marginTop:10}}>
            <Text style={{ fontSize: 22, color: 'white', fontWeight: "bold" }}> {this.props.navigation.getParam('courseN')}
              <Text style={{  fontSize: 17, color: 'white', fontWeight: "normal" }}>  {this.props.navigation.getParam('nameT')} | {this.props.navigation.getParam('kita')}</Text>
            </Text>
          </View>
          <View style={{ alignItems: "center"  }}>
            <Text style={{  fontWeight: "bold", color: "white", fontSize: 20 }}>{"\n"}{this.props.navigation.getParam('nameTask')} </Text>
            <Text style={{  color: "white", fontSize: 16 }}>{this.state.days} ימים להגשה | {this.state.studentSubmit} תלמידים הגישו {"\n"}</Text>
          </View>
         
          <View style={{ alignItems: "center" }}>
              <Image source={{ uri: this.state.image }}
                style={{ width: 200, height: 165, resizeMode: 'stretch', borderRadius: 8, alignItems: "center" }} />
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{  color: "white", fontSize: 16 }}>{"\n"}{this.props.navigation.getParam('details')}</Text>
            </View>


        

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
  }
});