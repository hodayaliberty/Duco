import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {RefreshControl, StyleSheet, ImageBackground, ScrollView, Image, YellowBox, FlatList, ActivityIndicator, Platform, Alert, TextInput, Button } from 'react-native';
import { Video } from 'expo-av'
import VideoPlayer from 'expo-video-player'
import { f, auth, db, database } from './config/config.js';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconLike from 'react-native-vector-icons/AntDesign';
import IconVoise from 'react-native-vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";





//https://oblador.github.io/react-native-vector-icons/

//https://github.com/ihmpavel/expo-video-player
//npm install expo-video-player
//expo install expo-av @react-native-community/netinfo
//npm install react-native-vector-icons
//npm i react-native-responsive-fontsize
//npm install react-native-grid-list --save

//firebase
//https://firebase.google.com/docs/firestore/manage-data/add-data




export default class video extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            listOfComment: [],
            listOfOfVideo: [],
            image: "http://www.up2me.co.il/imgs/9827160.png",
            //video: "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540alexak%252Fmy-new-project/ImagePicker/69d96212-41a8-4453-a12d-5f04d2183f2a.mp4",
            video: null,

            details: '',
            likesNum: 0,
            klickOnLikeFlag: false,
            numberOfViews: 0,
            commentNumber: 0,
            videoId: '',
            nameTask: '',
            myComment: '',


            firstName: '',
            lastName: '',
            studentImage: '',
            refreshing:false

        };

    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    }
    GetItem(item) {

        Alert.alert(item);

    }



    addComment = (text, videoId, studentImage, firstName, lastName) => {


        if (text == "") {
            Alert.alert('Please add a comment');
            return;
        }

        const conmentObject = {
            commentText: text,
            studentImage: studentImage,
            firstName: firstName,
            lastName: lastName,
            videoId: videoId,
        }

        db.collection("comments").add(conmentObject).then(

            this.setState({
                myComment: "",
                listOfComment: [...this.state.listOfComment, conmentObject],
                commentNumber :this.state.commentNumber,
            })


        ).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

        this.updateDataOnVideoTable(this.state.commentNumber, this.state.videoId, 'commentsNum');



    }




    updateDataOnVideoTable = async (addNum, videoId, type) => {



        var washingtonRef = await db.collection("videos").doc(videoId);

        let objectData = {};

        let newNum = parseInt(addNum) + 1;


        if (type === 'numberOfViews') {
            objectData.numberOfViews = newNum;
        } else if (type === 'likesNum') {
            objectData.likesNum = newNum;
        } else if (type === 'commentsNum') {
            objectData.commentNumber = newNum;
        }
        return washingtonRef.update(objectData)
            .then(() => {
                console.log("Document successfully updated!");
                if (type === 'numberOfViews') {

                    this.setState({ numberOfViews: newNum });
                } else if (type === 'likesNum') {
                    this.setState({ 
                        likesNum: newNum,
                        klickOnLikeFlag : true,
                     });
                } else if (type === 'commentsNum') {
                    this.setState({ commentNumber: newNum });
                }

            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });



    }


    addSoundComment = () => {

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
        const response = await fetch(result.uri);
        const blob = await response.blob();
        var uploadTask = f.storage()
          .ref()
          .child("image/"+result.uri)
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
              //console.log("File available at", downloadURL);
              if (!result.cancelled) {
                this.setState({ myComment: downloadURL });
              }
    
            });
          }
        );
      };



    getCurrentVideoData =async (currentVideo) => {
        //Alert.alert(JSON.stringify(currentVideo));
       
        if (currentVideo == null)
            return
        this.setState({
            video: currentVideo.video != null ? currentVideo.video : null,
            details: currentVideo.details != null ? currentVideo.details : "",
            likesNum: currentVideo.likesNum != null ? currentVideo.likesNum : 0,
            videoId: currentVideo.id != null ? currentVideo.id : "",
            nameTask: currentVideo.nameTask != null ? currentVideo.nameTask : "",
            numberOfViews: currentVideo.numberOfViews != null ? currentVideo.numberOfViews : 0,
            uid: currentVideo.uid != null ? currentVideo.uid : ''
        })
       
        await this.getVideoComment(currentVideo.id);
        await this.updateDataOnVideoTable(this.state.numberOfViews, currentVideo.id, 'numberOfViews');

    }
    getCurrentStudent = (student) => {

        if (student == null)
            return


        this.setState({
            firstName: student.firstName != null ? student.firstName : "",
            lastName: student.lastName != null ? student.lastName : "",
            studentImage: student.image != null ? student.image : "",

        })


    }

    getVideoComment =  (videoId) => {





        const myComments = db.collection('comments').where("videoId", "==", videoId).onSnapshot(snapshot => {
            const commnetGet = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))


            this.setState({ listOfComment: commnetGet, commentNumber: commnetGet.length });


        })
    }


    addLikeToTheVideo = ()=> {
        if(this.state.klickOnLikeFlag == false) {
            this.updateDataOnVideoTable(this.state.likesNum, this.state.videoId, 'likesNum')
        }
       
    }

    componentDidMount() {
        const { state } = this.props.navigation;
        this.getCurrentVideoData(state.params.objectData);
        this.getCurrentStudent(state.params.studntData);
        //Alert.alert(JSON.stringify(state.params));
        this.getPermissionAsync();
        this.setState({refreshing: false});

    }
    _onRefresh=()=>{
        this.setState({refreshing: true});
        this.componentDidMount()
      }
    render() {



        return (
            <ImageBackground style={styles.container}
                resizeMode='cover'
                source={{ uri: 'http://www.up2me.co.il/imgs/20894368.png' }} >
                <ScrollView refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}/>}> 
                <View style={{ marginTop:40}}>
                    <View>


                        <View style={{ alignItems: "center" }}>
                            <View style={{ alignItems: "center" }}>
                                {this.state.video && <VideoPlayer
                                    videoProps={{
                                        shouldPlay: true,
                                        resizeMode: Video.RESIZE_MODE_CONTAIN,
                                        source: {
                                            uri: this.state.video,
                                        },


                                    }}
                                    inFullscreen={true}
                                    height={200}
                                    showFullscreenButton={true}
                                    textStyle={{}}
                                />}
                            </View>
                        </View>

                        <View style={styles.bodyContainer}>


                            <View style={styles.commentAndLikesView}>
                                <View style={{ flex: 2, flexDirection: 'row', alignSelf: 'center', justifyContent: "flex-end", }}>
                                    <Text style={{ color: '#ffffff' }}>{this.state.commentNumber} תגובות</Text><Text style={{ color: '#ffffff' }}></Text><Text style={{ marginHorizontal: 10 }}>|</Text><Text style={{ color: '#ffffff' }}>{this.state.numberOfViews} צפיות</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: "flex-start" }}>
                                    {/* <Image
                                        style={{ width: 20, height: 20, resizeMode: "stretch" }}
                                        source={{ uri: this.state.image }}
                                    /> */}
                                    <IconLike name="like2" size={20} color="#ffffff" onPress={() => this.addLikeToTheVideo()} />
                                    <Text style={{ color: '#ffffff', marginHorizontal: 10 }}>{this.state.likesNum}</Text>

                                </View>
                            </View>




                            <View style={styles.sendComment}>

                                <Button
                                    onPress={() => this.addComment(this.state.myComment, this.state.videoId, this.state.studentImage, this.state.firstName, this.state.lastName)}
                                    title="שליחה"
                                    color="#37506f"
                                    style={{marginVertical:10}}
                                    accessibilityLabel="Learn more about this purple button"
                                />
                                {/* <IconVoise name="modern-mic" style={{marginRight:5, marginLeft:5}} size={25} color="#37506f" onPress={this.addSoundComment} /> */}
                                <Icon name="camera" size={25} style={{alignContent:"center"}} color="#37506f"  onPress={this._pickImage} />

                                <TextInput placeholder="התגובה שלי " placeholderTextColor="grey" style={styles.input} onChangeText={(text) => this.setState({ myComment: text })}
                                    value={this.state.myComment} />



                            </View>




                            <View>

                                <View style={styles.MainContainer}>
                                    <FlatList
                                        data={this.state.listOfComment}
                                        ItemSeparatorComponent={this.FlatListItemSeparator}
                                        renderItem={({ item }) =>
                                            <View onPress={this.GetItem.bind(this, item.commentText)} style={{ flex: 1, flexDirection: 'row-reverse'}}>
                                                <Image source={{ uri: item.studentImage }} style={styles.imageView} />
                                                <View style={styles.textView}>
                                                {
    
                                                    (item.commentText.indexOf('jpg') > -1 || item.commentText.indexOf('png') > -1)
                                                    ?
                                                    <Image
                                                        style={{width:100,height:100}}
                                                        source={{
                                                        //item.commentText
                                                        uri: item.commentText,
                                                        }}
                                                    />
                                                    :
                                                    <Text>  {item.commentText}</Text>
                                                }
                                                    {/* <Text style={styles.textViewSon} >{item.commentText} </Text> */}
                                                    <Text style={{color: '#ffffff',fontWeight: "bold"}} >{item.firstName} {item.lastName}</Text>
                                                </View>
                                            </View>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>






                            </View>

                        </View>



                    </View>
                </View>
                </ScrollView>
            </ImageBackground >

        )
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,


    },
    bodyContainer: {
        alignItems: 'center',
        flex: 1,
        padding: 10,

    },
    sendComment: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        padding:5,
    },
   
    commentAndLikesView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        height: 50
    },
    MainContainer: {

        justifyContent: 'center',
        flexDirection: 'column-reverse',
        alignItems: 'flex-end',
        flex: 1,
        margin: 5,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,

    },

    imageView: {

        marginTop:3,
        width: 50, height: 50, borderRadius: 50 / 2

    },

    textView: {
        flexDirection: "column",
        width: '85%',
        alignItems:"flex-end",
        textAlignVertical: 'center',
        padding: 10,


    },
    textViewSon: {
        color: '#ffffff'
    },
    input: {
        height: 30,
        flex: 4,
        borderWidth: 1,
        borderColor: '#ffffff',
        textAlign: 'right',
        color: '#000000'
    },

});