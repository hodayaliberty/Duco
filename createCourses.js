import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  RefreshControl,
  View,
  Button,
  Image,
  TextInput,
  TouchableHighlight,
  ImageBackground,
  ListView,
  Alert,
} from "react-native";
import { f, auth, db } from "./config/config.js";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Overlay } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import task from "./task.js";
export default class createCourses extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      email: "",
      password: "",
      name: "",
      phone: "",
      data: [],
      uid: "",
      codi: "",
      nameT: "",
      kita: "",
      nameCourse: "",
      CourseName: "",
      isVisible: false,
      refreshing:false
    };
    this.readCourses = this.readCourses.bind(this);
  }
  componentDidMount() {
    this.readCourses();
    this.setState({refreshing: false});
  }
  _onRefresh=()=>{
    this.setState({refreshing: true});
    this.componentDidMount()
  }
  signUserOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  functiononPress2 = () => {
    this.signUserOut();
    this.props.navigation.navigate("Access");
  };
  saveCourse = (CourseName, RandomNumber, kita) => {
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        var courseT = "";
        courseT = CourseName + kita + user.uid;
        db.collection("courses")
          .doc(courseT)
          .set({
            uid: user.uid,
            code: RandomNumber,
            kita: kita,
            name: CourseName,
          })
          .then(function () {
            console.log("Document successfully updated!");
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    });
  };
  deletCourse = async (nameCourse, kita) => {
    this.setState({ isVisible: false });
    f.auth().onAuthStateChanged( async (user)=> {
      var course = "";
      course = nameCourse + kita + user.uid;
      let deleteDoc = db.collection("courses").doc(course).delete();
      let x = await db
      .collection("tasks")
      .where("uid", "==", user.uid)
      .where("name", "==", nameCourse)
      .where("kita", "==", kita)
      .doc().delete();
    
    });
  };
  randomCode = (CourseName, kita) => {
    let RandomNumber = Math.floor(Math.random() * 100) + 1;
    let coursesRef = db.collection("courses");
    coursesRef
      .where("code", "==", RandomNumber)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents.");
        }
        snapshot.forEach((doc) => {
          if (doc.data().code == RandomNumber) {
            RandomNumber = Math.floor(Math.random() * 100) + 1;
          }
        });
        this.setState({ codi: RandomNumber });
        this.saveCourse(CourseName, RandomNumber, kita);
      });
  };

  // readCourses = () => {
  //   var arr = []
  //   f.auth().onAuthStateChanged(async (user) => {
  //      db.collection("courses")
  //       .where("uid", "==", user.uid)
  //       .get()
  //       .then((snapshot) => {
         
  //         var a = {};
  //         snapshot.forEach((doc) => {
  //           let coursesData =  doc.data()
  //           let courseName = coursesData.name;
  //           let kita = coursesData.kita;
  //           a = { name: courseName, id: doc.data().code, k: kita };
  //           let snapshotData = await db
  //             .collection("tasks")
  //             .where("uid", "==", user.uid)
  //             .where("name", "==", courseName)
  //             .where("kita", "==", kita)
  //             .get();

  //           let numActiveCourse = 0;
  //           snapshotData.forEach((dc) => {
  //             let taskData =  dc.data()
  //             console.log('taskData',taskData)
  //             let days = taskData.days;
  //             if (days > 0) {
  //               numActiveCourse = 1;
  //             }
  //           });

  //           a = { ...a, numActiveCourse };
  //           arr.push(a);
  //           console.log("arr2 is", arr);
  //         });
  //       })
  //       .catch((e) => {
  //         console.log("error is courses", e);
  //       });
  //       this.setState({data:arr})

  //   });

  // };


  readCourses = async()=>{
    f.auth().onAuthStateChanged(async (user) => {
      let loadedPosts = {};
      let docSnaps = await db.collection("courses").where("uid", "==", user.uid).get();
      for (let doc of docSnaps.docs){
       
        let courseName = doc.data().name;
        let kita = doc.data().kita
        loadedPosts[doc.id] = {
          ...doc.data(),
          k:kita,
          id:doc.data().code
        }
        const taskSnap =  await db
          .collection("tasks")
          .where("uid", "==", user.uid)
          .where("name", "==", courseName)
          .where("kita", "==", kita)
          .get()
          
        let numActiveCourse = 0
        for(let task of taskSnap.docs){
          let taskData = task.data()
          if(taskData.days>0){
            numActiveCourse =numActiveCourse+1
          }
         
        }
        loadedPosts[doc.id].numActiveCourse = numActiveCourse
      }
      console.log('loadedPosts',loadedPosts)
      this.setState({data:loadedPosts})

    })
  }
 
  activeCourse = (nameCourse, kita) => {
    var user = f.auth().currentUser;
    var count = 0;
    console.log(nameCourse, kita, user.uid);
    let x = db.collection("tasks").where("uid", "==", user.uid);
    let y = x.where("name", "==", nameCourse);
    let z = y
      .where("kita", "==", kita)
      .where("days", ">", 0)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
        });
        count += 1;
      })
      .catch((err) => {
        console.log("Error getting documents", err);
      });
  };
  render() {
    const data = this.state.data
    const item = data && Object.keys(data).map((tdoc) => {
      let t = data[tdoc]
      return (
        <TouchableOpacity
          style={styles.CheckBox}
          key={t.id}
          onPress={() =>
            this.props.navigation.navigate("homeWork", {
              name: t.name,
              code: t.id,
              nameT: this.props.navigation.getParam("nameT"),
              kita: t.k,
              studentDataObject:this.props.navigation.getParam("studentDataObject")
            })
          }
        >
          <Text
            style={{
              textAlign: "center",
              alignItems: "center",
              color: "#262E4D",
              fontSize: 19,
            }}
          >
            <Text style={{ fontWeight: "bold" }}> {t.name}</Text>
            <Text style={{ fontSize: 14 }}> כיתה {t.k}</Text>
            {"\n"}
            <Text style={{ fontSize: 14 }}>קוד כניסה</Text> {t.id}
            <Text style={{ fontSize: 14 }}>
              {" "}
               |{t.numActiveCourse} פרויקטים פעילים
            </Text>
          </Text>
        </TouchableOpacity>
      );
    });
    return (
      <ImageBackground
        style={styles.imgBackground}
        resizeMode="cover"
        source={{ uri: "http://www.up2me.co.il/imgs/20894368.png" }}
      >
        <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      />}>
          <View
            style={{
              flex: 1,
              padding: 10,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                marginTop: 5,
                textAlign: "right",
                alignSelf: "stretch",
                padding: 12,
                marginTop: 20,
              }}
            >
              <Text
                style={{ fontSize: 20, color: "white", textAlign: "right" }}
              >
                שלום,{this.props.navigation.getParam("nameT")}{" "}
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: "white",
                textAlign: "center",
                height: 200,
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <TextInput
                placeholder="הוסף/י מקצוע חדש"
                placeholderTextColor="white"
                style={styles.CheckBox2}
                onChangeText={(text) => this.setState({ CourseName: text })}
                value={this.state.courseName}
              />
              <TextInput
                placeholder="הזן כיתת לימוד"
                placeholderTextColor="white"
                style={styles.CheckBox2}
                onChangeText={(text) => this.setState({ kita: text })}
                value={this.state.kita}
              />
              <TouchableHighlight
                style={{
                  margin: 10,
                  height: 35,
                  borderWidth: 1,
                  borderColor: "#262E4D",
                  borderRadius: 8,
                  padding: 5,
                  backgroundColor: "#262E4D",
                }}
                onPress={() =>
                  this.randomCode(this.state.CourseName, this.state.kita)
                }
              >
                <Text
                  style={{ fontSize: 20, color: "white", alignSelf: "center" }}
                >
                  שמירה
                </Text>
              </TouchableHighlight>
            </View>
            <Text> </Text>
            {item}
            <View style={{justiftyContent:"center",alignItems:"center"}}>
              <MaterialCommunityIcons
                onPress={() => this.setState({ isVisible: true })}
                name="delete"
                size={35}
                color="white"
                opacity="0.5"
              />
              <TouchableHighlight style={{ margin: 10 }}>
                <Text
                  style={{ color: "white" }}
                  onPress={() => this.functiononPress2()}
                >
                  {" "}
                  התנתק/י{" "}
                </Text>
              </TouchableHighlight>
            </View>
            <Overlay
              overlayStyle={{
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: "white",
              }}
              onBackdropPress={() => {
                this.setState({ isVisible: false });
              }}
              isVisible={this.state.isVisible}
              height="auto"
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#262E4D",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                {" "}
                מחיקת מקצוע{" "}
              </Text>
              <Text style={{ textAlign: "right" }}>אמת/י את המקצוע</Text>
              <TextInput
                placeholder="שם המקצוע"
                placeholderTextColor="#262E4D"
                style={styles.input}
                onChangeText={(text) => this.setState({ nameCourse: text })}
                value={this.state.nameCourse}
              />
              <TextInput
                placeholder="הזן כיתת לימוד"
                placeholderTextColor="#262E4D"
                style={styles.input}
                onChangeText={(text) => this.setState({ kita: text })}
                value={this.state.kita}
              />
              <TouchableHighlight
                style={{
                  margin: 10,
                  height: 35,
                  width: 100,
                  borderWidth: 1,
                  borderColor: "#262E4D",
                  borderRadius: 8,
                  padding: 5,
                  backgroundColor: "#262E4D",
                }}
                onPress={() =>
                  this.deletCourse(this.state.nameCourse, this.state.kita)
                }
              >
                <Text
                  style={{ fontSize: 20, color: "white", alignSelf: "center" }}
                >
                  מחיקה
                </Text>
              </TouchableHighlight>
            </Overlay>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 40,
  },
  input: {
    height: 50,
    width: 280,
    borderWidth: 1,
    margin: 10,
    borderColor: "#262E4D",
    textAlign: "right",
    paddingRight: 20,
    color: "#262E4D",
  },
  imgBackground: {
    alignItems: "center",
    flex: 1,
  },
  CheckBox: {
    margin: 2,
    textAlign: "right",
    width: 325,
    height: 90,
    backgroundColor: "white",
    opacity: 0.5,
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    borderWidth: 0.5,
    justifyContent: "space-between",
    padding: 20,
  },
  CheckBox2: {
    height: 50,
    width: 350,
    borderBottomWidth: 1,
    margin: 10,
    borderBottomColor: "white",
    textAlign: "right",
    paddingRight: 20,
    color: "white",
  },
});