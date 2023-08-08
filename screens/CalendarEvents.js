import React from 'react'
import {Calendar} from 'react-native-calendars';
import { useEffect,useState } from 'react';
import * as SQLite from 'expo-sqlite'
import moment from 'moment';
import { View,StyleSheet, Text, SafeAreaView, FlatList,TouchableOpacity,Modal,Pressable,ScrollView,TextInput} from 'react-native';
import {Dimensions} from 'react-native';
import { DeleteNotification } from '../components/Notifications';
import { createSheet } from 'react-native-web/dist/cjs/exports/StyleSheet/dom';
import { FocusedStatusBar } from '../components';


const CalendarEvents = () => {

  const [events,setEvents] = useState([]);
  const [map,setMap] = useState({});
  const [showEvents,setShowEvents] = useState([]);
  const [selectedDate,setSelectedDate] = useState(moment(new Date()).format('YYYY-MM-DD'));

  
  useEffect(()=>{
    const db = SQLite.openDatabase("ZamanPlanlama");
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM Activities', null,
        async(txObj, resultSet) => {mapEvents(resultSet.rows._array);},
        (txObj, error) => {console.log(error)}
      );
      tx.executeSql('SELECT * FROM Activities where startingDate <= ? AND endingDate >= ?', [moment(new Date()).format('YYYY-MM-DD'),moment(new Date()).format('YYYY-MM-DD')],
        (txObj, resultSet) => {setShowEvents(resultSet.rows._array)},
        (txObj, error) => {console.log(error)}
      );
    });
  },[]);

  const mapEvents = (events)=>{
    var mappedEvents = [];
    events.forEach((element) => {
      var count = Math.abs(moment(element.startingDate,"YYYY-MM-DD").diff(moment(element.endingDate,"YYYY-MM-DD"),'days'));
      var startingDate = element.startingDate;
      for(i = 0; i<= count;i++){
        var obj = {};
        obj={[startingDate]:{periods:[
          {
            startingDay:i==0?true:false,
            endingDay:i==count?true:false,
            color:element.color
          }]}
        }
        mappedEvents.push(obj);
        startingDate = moment(startingDate,"YYYY-MM-DD").add(1,"days").format("YYYY-MM-DD");
      }
    });
    
    var objArr = {};
    mappedEvents.forEach((item)=>{
      if(!objArr[Object.keys(item)]){
        objArr[Object.keys(item)] = {periods:item[Object.keys(item)]["periods"]};
      }
      else{
        var obj = item[Object.keys(item)]["periods"][0];
        objArr[Object.keys(item)]["periods"].push(obj);
      }
    })
    setMap(objArr);
  }


  const selectedDayEvents= (date)=>{
    setSelectedDate(date.dateString);
    const db = SQLite.openDatabase("ZamanPlanlama");
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Activities where startingDate <= ? AND endingDate >= ?', [date.dateString,date.dateString],
        (txObj, resultSet) => {setShowEvents(resultSet.rows._array)},
        (txObj, error) => {console.log(error)}
      );
    });
  }

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
              (txObj, resultSet) => {mapEvents(resultSet.rows._array)},
              (txObj, error) => {console.log(error)}
            );
            tx.executeSql('SELECT * FROM Activities where startingDate <= ? AND endingDate >= ?', [selectedDate,selectedDate],
              (txObj, resultSet) => {setShowEvents(resultSet.rows._array)},
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
  


  return(
    <SafeAreaView style={{flex:1,overflow:"hidden"}}>
      <View style={{height:30,backgroundColor:"#ffffff"}}></View>
      <ScrollView style={{flex:1, borderBottomColor:"black"}}>
        <Calendar
            context={{date:selectedDate}}
            theme={{selectedDayBackgroundColor:'blue'}}
            markedDates={map}
            markingType="multi-period"
            onDayPress={(date)=>{selectedDayEvents(date)}}
            onMonthChange={(date)=>{selectedDayEvents(date)}}
          />
      </ScrollView>
      <View style={{flex:1,marginBottom:50}}>
        <FlatList
          data={showEvents}
          renderItem={({item})=><EventList data={item}/>}
          keyExtractor={(item)=>item.eventId}
        />
      </View>
    </SafeAreaView>
  )
}

export default CalendarEvents