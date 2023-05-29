import React from 'react'
import {View,StyleSheet, Text, SafeAreaView, FlatList,TouchableOpacity,Modal,Pressable,TextInput,Image} from 'react-native';
import { useEffect,useState } from 'react';
import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import {Dimensions} from 'react-native';
import { DeleteNotification } from '../components/Notifications';
import moment from 'moment';


const response = (itemObj)=>{
  fetch('http://192.168.1.34:8080', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(itemObj),
  })
}

const Home = () => {
  const [events, setEvents] = useState([]);
  const [masterEvents,setMasterEvents]=useState([]);
  const [searchIconVisible,setSearchIconVisible]=useState(true);

  useEffect(() => {
    const db = SQLite.openDatabase("ZamanPlanlama");
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Activities( eventId INTEGER PRIMARY KEY AUTOINCREMENT, tag text, comment text, color text,notificationId text,startingDate text, startingTime text,endingDate text, endingTime text)', null);
        tx.executeSql('SELECT * FROM Activities', null,
          (txObj, resultSet) => {setEvents(resultSet.rows._array);response(resultSet.rows._array);setMasterEvents(resultSet.rows._array)},
          (txObj, error) => {console.log(error)}
        );
      });
  },[]);

  const EventList = ({data})=>{
    const [modalVisible,setModalVisible]=useState(false);
    const hideModal = ()=> setModalVisible(false);
    const showModal = ()=> setModalVisible(true);
  
    const [modalX,setModalX] = useState(Number);
    const [modalY,setModalY] = useState(Number);
  
    const setModalXY = (modalX,modalY)=>{
        if(modalX>windowWidth-styles.modal.width){
            modalX=windowWidth-styles.modal.width-10;
        }
        if(modalY>windowHeight-120){
            modalY=windowHeight-120;
        }
        if(modalY<60){
            modalY=60;
        }
        setModalX(modalX);
        setModalY(modalY);
    }
  
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
  
    const deleteEvent=()=>{
        const db = SQLite.openDatabase("ZamanPlanlama");
        db.transaction(tx => {
            tx.executeSql('Delete from Activities where eventId = ?',[data.eventId],
                (txObj, resultSet) => {
                console.log('Results', resultSet.rowsAffected);
                if(resultSet.rowsAffected > 0){
                    console.log('Data Deleted Successfully....');
                }
                else console.log('Failed....');},
                (txObj, error) => {console.log(error)}
            );
            tx.executeSql('SELECT * FROM Activities', null,
              (txObj, resultSet) => {setEvents(resultSet.rows._array);response(resultSet.rows._array)},
              (txObj, error) => {console.log(error)}
            );
        });
        DeleteNotification(data.notificationId);
    }
  
    const styles =  StyleSheet.create({
        touchableContainer:{
          paddingHorizontal:20,
          paddingVertical:10,
          borderColor:'black',
          borderBottomWidth:1
        },
        tag:{
            color:data.color,
            paddingBottom:10,
            fontSize:18
        },
        comment:{
            paddingBottom:5,
            paddingLeft:10
        },
        time:{
            paddingLeft:10,
            color:'grey'
        },
        modal:{
            height:'auto',
            width:100,
            alignSelf:'flex-start',
            backgroundColor:'white',
            paddingHorizontal:10,
            paddingVertical:10,
            borderRadius:5,
            position:'absolute',
            top:modalY-50,
            left:((modalX>windowWidth)? modalX-100 : modalX),
           
        }
    })
    return (
        <View style={{flex:1}}>
            <TouchableOpacity style={styles.touchableContainer} onPress={(event)=>{showModal();setModalXY(event.nativeEvent.pageX,event.nativeEvent.pageY)}}>
                <Text style={styles.tag}>
                    {data.tag}
                </Text>
                <Text style={styles.comment}>
                    {data.comment}
                </Text>
                <Text style={styles.time}>
                    {moment(data.startingDate,"YYYY-MM-DD").format("DD MMM YYYY")}  {data.startingTime}  -  {moment(data.endingDate,"YYYY-MM-DD").format("DD MMM YYYY")}  {data.endingTime}
                </Text>
                <Modal visible={modalVisible} animationType='fade' transparent={true} onRequestClose={hideModal}>
                    <Pressable style={{height:'100%',width:'100%',backgroundColor:'transparent'}} onPress={hideModal}>
                        <View style={styles.modal}>
                            <Text style={styles.tag} numberOfLines={2}>
                                {data.tag}
                            </Text>
                            <TouchableOpacity onPress={()=>{deleteEvent();hideModal();}}>
                                <Text>
                                    Etkinliği Sil
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>
            </TouchableOpacity>
        </View>
    )
  }


  const searchEvent = (string)=> {
    if(string){
      let obj=[];
      obj = masterEvents.filter((event)=>
        event.tag.toUpperCase().includes(string.toUpperCase()) || 
        event.comment.toUpperCase().includes(string.toUpperCase()) || 
        event.startingDate.toUpperCase().includes(string.toUpperCase()) ||
        event.endingDate.toUpperCase().includes(string.toUpperCase()) ||
        event.startingTime.toUpperCase().includes(string.toUpperCase()) ||
        event.endingTime.toUpperCase().includes(string.toUpperCase())
      )
      setEvents(obj);
      setSearchIconVisible(false);
    }
    else{
      setEvents(masterEvents);
      setSearchIconVisible(true);
    }
  }  
  

  return (
    <SafeAreaView style={{flex:1,marginTop:35}}>
      <View style={styles.searchInputContainer}>
        <TextInput style={styles.searchInput} placeholder="Arama" onChangeText={(text)=>searchEvent(text)}/>
        {searchIconVisible? <Image source={require('../asset/search.png')} style={styles.searchIcon}/> : null}
      </View>
      <View style={{flex:1,marginTop:20,marginBottom:50}}>
        <FlatList 
          data={events}
          renderItem={({item})=><EventList data={item}/>}
          keyExtractor={(item)=>item.eventId}
          extraData
        />
      </View>
    </SafeAreaView>
  )
}

const styles =  StyleSheet.create({
  searchInputContainer:{
    marginHorizontal:15,
    paddingHorizontal:15,
    borderRadius:25,
    borderWidth: 1,
    flexDirection:'row',
    alingItems:'center',
    display:'flex',
    justifyContent:"space-between",
    padding:5,
    backgroundColor:'#DCDCDC'
  },
  searchInput:{
    width:'90%'
  },
  searchIcon:{
    width:25,
    height:25,
  },
})


export default Home