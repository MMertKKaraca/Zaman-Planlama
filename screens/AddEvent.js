import React, { useEffect } from 'react'
import { Text,View,StyleSheet,TouchableOpacity,SafeAreaView,Image,TextInput,Modal,Pressable,Button} from 'react-native'
import {FocusedStatusBar} from '../components';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import ColorPicker from 'react-native-wheel-color-picker';
import {Dimensions} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import ModalSelector from 'react-native-modal-selector'

import { AddNotification,DeleteNotification } from '../components/Notifications';

import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';



const AddEvent=()=>{

    const navigation = useNavigation();

    const [tag,setTag] = useState('Etkinlik');
    const [color, setColor] = useState('black');
    const [comment,setComment] = useState('');
    const [notificationId,setNotificationId] = useState('');
    const [startingDate,setPickedStartingDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [startingTime,setPickedStartingTime] = useState(moment(new Date()).format('HH:00'));
    const [endingDate,setPickedEndingDate] = useState(moment(new Date()).add(1,'hour').format('YYYY-MM-DD'));
    const [endingTime,setPickedEndingTime] = useState(moment(new Date()).add(1,'hour').format('HH:00'));

    const [colorPick,setColorPick] = useState('');
    const [visibleColorPicker,setVisibleColorPicker]=useState(false);
    const hideColorPicker = ()=>setVisibleColorPicker(false);
    const showColorPicker = ()=>setVisibleColorPicker(true);

    const [isStartingDatePickerVisible, setStartingDatePickerVisibility] = useState(false);
    const [isEndingDatePickerVisible, setEndingDatePickerVisibility] = useState(false);
    const showStartingDatePicker = () => {
        setStartingDatePickerVisibility(true);
    };
    const showEndingDatePicker = () => {
        setEndingDatePickerVisibility(true);
      };
    const hideDatePicker = () => {
        setStartingDatePickerVisibility(false);
        setEndingDatePickerVisibility(false);
    };
    const handleStartingsConfirm = (date) => {
        if(moment(date).format('YYYY-MM-DD')>=endingDate){
            setPickedEndingDate(moment(date).format('YYYY-MM-DD'));
            if(moment(date).format('HH:mm')>endingTime){
                setPickedEndingTime(moment(date).add(1,'hours').format('HH:mm'))
                setPickedEndingDate(moment(date).add(1,'hours').format('YYYY-MM-DD'));
            }
        }
        setPickedStartingDate(moment(date).format('YYYY-MM-DD'));
        setPickedStartingTime(moment(date).format('HH:mm'));
        hideDatePicker();
    };
    const handleEndingsConfirm = (date) => {
        if(moment(date).format('YYYY-MM-DD')<=startingDate){
            setPickedStartingDate(moment(date).format('YYYY-MM-DD'));
            if(moment(date).format('HH:mm')<startingTime){
                setPickedStartingTime(moment(date).add(-1,'hours').format('HH:mm'))
                setPickedStartingDate(moment(date).add(-1,'hours').format('YYYY-MM-DD'));
            }
        }
        setPickedEndingDate(moment(date).format('YYYY-MM-DD'));
        setPickedEndingTime(moment(date).format('HH:mm'));
        hideDatePicker();
    };

    const [notificationLabel,setNoticationLabel]=useState('Açık');
    const [notificationValue,setNoticationValue]=useState(true);
    const [visibleNotificationPicker,setVisibleNotificationPicker]=useState(false);
    const hideNotificationPicker = ()=> setVisibleNotificationPicker(false);
    const showNotificationPicker = ()=> setVisibleNotificationPicker(true);
    const notificationData=[
        {key:true,label:"Açık"},
        {key:false,label:"Kapalı"}
    ]

    const AddEvents =(tag,comment,color,notificationId,startingDate,startingTime,endingDate,endingTime)=>{
        const db = SQLite.openDatabase("ZamanPlanlama");
        db.transaction(tx => {
            tx.executeSql('INSERT INTO Activities (tag,comment,color,notificationId,startingDate,startingTime,endingDate,endingTime) values(?,?,?,?,?,?,?,?)',[tag,comment,color,notificationId,startingDate,startingTime,endingDate,endingTime],
                (txObj, resultSet) => {
                console.log('Results', resultSet.rowsAffected);
                if(resultSet.rowsAffected > 0){
                    console.log('Data Inserted Successfully....');
                }
                else console.log('Failed....');},
                (txObj, error) => {console.log(error)}
            );
        });
    }
    
    
    const insertEvents = async()=>{
        var d = '';
        if(notificationValue==true){
            d = await AddNotification(tag,comment,startingDate,startingTime);
            setNotificationId(d);
        }
        await AddEvents(tag,comment,color,d,startingDate,startingTime,endingDate,endingTime);
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.topSideIconsContainer}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Image source={require('../asset/left-arrow.png')} style={styles.topSideIcons}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={async()=>{await insertEvents();navigation.goBack();}}>
                    <Image source={require('../asset/check.png')} style={styles.topSideIcons}/>
                </TouchableOpacity>
            </View>
            <View>
                <View style={styles.tagContainer}>
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('../asset/addEventIcons/hashtag.png')} style={styles.icons}></Image>
                        <TextInput multiline onChangeText={tag =>setTag(tag)} placeholder="Etiket" style={styles.input}/>
                    </View>
                    <TouchableOpacity onPress={()=>setVisibleColorPicker(showColorPicker)} style={{height:30,width:30,marginTop:15,backgroundColor:color,borderRadius:15,borderColor:'#000000',borderWidth:1}}/>
                </View>
                <View style={styles.commentContainer}>
                    <Image source={require('../asset/addEventIcons/note.png')} style={styles.icons}></Image>
                    <TextInput multiline  onChangeText={comment =>setComment(comment)} placeholder="Açıklama" style={styles.input}/>
                </View>
                <View style={styles.commentContainer}>
                    <Image source={require('../asset/addEventIcons/clock.png')} style={styles.icons}></Image>
                    <View style={{flex:1,flexDirection:'column',justifyContent:'space-between',alingItems:'center'}}>
                        <TouchableOpacity style={styles.touchableOps} onPress={showStartingDatePicker}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={styles.texts}>Başlangıç:</Text>
                                <Text style={styles.texts}>{moment(startingDate,"YYYY-MM-DD").format("D MMM YYYY")}   {startingTime}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touchableOps} onPress={showEndingDatePicker}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <Text style={styles.texts}>Bitiş:</Text>
                                <Text style={styles.texts}>{moment(endingDate,"YYYY-MM-DD").format("D MMM YYYY")}   {endingTime}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.commentContainer}>
                    <Image source={require('../asset/addEventIcons/notification.png')} style={styles.icons}></Image>
                    <TouchableOpacity style={styles.touchableOps} onPress={showNotificationPicker}>
                        <Text style={styles.notificationText}>{notificationLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={visibleColorPicker} animationType='slide' onRequestClose={hideColorPicker} transparent={true}>
                    <Pressable style={styles.upper} onPress={hideColorPicker}/>
                    <View style={styles.sectionContainer}>
                        <View style={styles.modalTopIconContainer}>
                            <TouchableOpacity onPress={()=>hideColorPicker()} style={{justifyContent:'center'}}>
                                <Image source={require('../asset/x.png')} style={{width:25,height:25}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{hideColorPicker(); setColor(colorPick)}} style={{justifyContent:'center'}}>
                                <Image source={require('../asset/check.png')} style={{width:50,height:50}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.colorPicker}>
                            <ColorPicker
                                color={color}
                                thumbSize={30}
                                sliderSize={30}
                                noSnap={true}
                                row={false}
                                shadeSliderThumb={true}
                                shadeWheelThumb={true}
                                onColorChangeComplete={(clr)=>setColorPick(clr)}
                            />
                        </View>
                    </View>
                </Modal>
                <DateTimePickerModal
                    isVisible={isStartingDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleStartingsConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={new Date(2036,0,1)}
                />
                <DateTimePickerModal
                    isVisible={isEndingDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleEndingsConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={new Date(2036,0,1)}
                />
                <ModalSelector
                    data={notificationData}
                    onChange={(option)=>{setNoticationLabel(option.label);setNoticationValue(option.key);hideNotificationPicker()}}
                    animationType='fade'
                    onModalClose={hideNotificationPicker}
                    visible={visibleNotificationPicker}
                    selectStyle={{display:"none"}}
                    optionContainerStyle={{backgroundColor:"white"}}
                    cancelContainerStyle={{backgroundColor:"white", alignSelf: 'stretch'}}
                    cancelText='İptal'
                    backdropPressToClose={true}
                    overlayStyle={{backgroundColor:'rgba(0,0,0,0.5)'}}
                />
        </SafeAreaView>
    )
}


const styles =  StyleSheet.create({
    topSideIconsContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alingItems:'flex-end',
        marginTop:25,
        justifyContent:'space-between',
        paddingHorizontal:10,
    },
    topSideIcons:{
        width:30,
        height:30
    },
    tagContainer:{
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection:'row',
        alingItems:'center',
        display:'flex',
        justifyContent:"space-between",
        padding:5
    },
    commentContainer:{
        display:'flex',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection:'row',
        alingItems:'center',
        padding:5,
    },
    modalTopIconContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alingItems:'flex-end',
        justifyContent:'space-between',
        paddingHorizontal:10,
        paddingRight:5
    },
    icons:{
        width:30,
        height:30,
        marginTop:15
    },
    input: {
        width: Dimensions.get('window').width-100,
        margin: 10,
        padding: 5,
        fontSize:18,
    },
    touchableOps:{
        margin: 10,
        padding: 5,
        fontSize:18,
    },
    upper:{
        height:100,
        backgroundColor:'#DDD',
        opacity:.5
    },
    sectionContainer:{
        flex:1,
        backgroundColor:"white",
    },
    colorPicker:{
        flex:1,
        paddingHorizontal:20,
        paddingVertical:10,
        paddingBottom:50,
    },
    maps:{
        height:'100%',
        width:'100%'
    },
    DatePickerTheme:{
        flex:1,
        flexDirection:'column',
        position:'relative',
    },
    texts:{
        fontSize:18
    },
    notificationText:{
        fontSize:18,
        color:'rgba(0,118,255,0.9)'
    }
  })

export default AddEvent