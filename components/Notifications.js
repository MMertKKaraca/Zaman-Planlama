import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import moment from 'moment';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const AddNotification = async(tag,comment,pickedStartingDate,pickedStartingTime)=>{
    const trigger = new Date(
      moment(pickedStartingDate,"YYYY-MM-DD") + moment(pickedStartingTime,"HH:mm").format("HH")*60*60*1000 + moment(pickedStartingTime,"HH:mm").format("mm")*60*1000
    );
    const identifer = await Notifications.scheduleNotificationAsync({
      content: {
        title: tag,
        body: `${comment} \n\n ${pickedStartingTime}`,
      },
      trigger,
    });
    return identifer;
}

const DeleteNotification = (identifer)=>{
  try{
    Notifications.cancelScheduledNotificationAsync(identifer);
  }
  catch{
    console.log("error");
  }
    
}


export{AddNotification,DeleteNotification}
