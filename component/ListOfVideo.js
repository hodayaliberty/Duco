import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native'
import IconLike from 'react-native-vector-icons/AntDesign';

const FlatListItemSeparator = () => {


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

const ListOfVideo = ({ videoList, navigation }) => {
    const [myImage, setMyImage] = useState('http://www.up2me.co.il/imgs/9827160.png');

   
    useEffect(() => {

    });
    return (
        <View style={styles.MainContainer}>

            <FlatList
                data={videoList}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item }) =>


                    <TouchableOpacity onPress={() => navigation.navigate('video', { objectData: item, studntData: navigation.getParam('studentDataObject') })}>
                        <View style={styles.videoItem}>

                            <View style={styles.userViewHeaderView}>
                                <View style={styles.userViewHeader}>
                                    <Text style={styles.userViewHeaderText}>{item.studentFirstName} {item.studentLastName}</Text>
                                </View>
                                <Image source={require('../images/vEtoCJsXDhAh5pwNtFaD6Q.png')} style={styles.VideoImageView}   />

                            </View>

                            <Image source={{ uri: item.studentImage }} style={styles.studentImage} />

                            <View style={styles.userViewBottom}>

                                <View style={styles.userViewBottomTextRightView}>
                                    <IconLike name="like2" size={15} color="#ffffff" />
                                    <Text style={styles.userViewBottomTextRight}>{item.likesNum}</Text>
                                </View>
                                <Text style={styles.userViewBottomTextLeft}>{item.commentNumber}  תגובות</Text>
                            </View>
                        </View>

                    </TouchableOpacity>



                }
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

export default ListOfVideo
const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'center',
        flexDirection: 'column-reverse',
        alignItems: "center",
        margin: 5,
        marginTop: 20,

    },
    videoItem: {
        margin: 10
    },
    studentImage: {
        width: 30, height: 30, borderRadius: 30 / 2,
        position: "absolute",
        top: 10,
        right: 5,
        zIndex: 4, // works on ios
    },
    VideoImageView: {
        width: 150, height: 150,
        resizeMode: "stretch",
    },
    userViewHeaderView: {

        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        backgroundColor:'#fff',

        
    },
    userViewHeader: {
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        marginBottom:0,
        backgroundColor: "#3b5998",
        padding: 3,
        width: "100%",
    },
    userViewHeaderText: {
        textAlign: "center",
        color: "#fff",

    },
    userViewBottom: {
        backgroundColor: "#37506f",
        position: "absolute",
        padding: 3,
        bottom: 0,
        zIndex: 3, // works on ios
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    userViewBottomTextRightView: {
        flexDirection: 'row',
    },
    userViewBottomTextRight: {
        color: "#fff",
        marginLeft: 5


    },
    userViewBottomTextLeft: {
        color: "#fff",

    },
});
