import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View,Image,Text,TouchableOpacity } from "react-native";

import Home from "../screens/Home";
import CalendarEvents from "../screens/CalendarEvents";
import AddEvent from "../screens/AddEvent";

const Tab = createBottomTabNavigator();

const BottomTabs = ()=>{
    return(
        <Tab.Navigator 
            backBehavior="history"
            screenOptions={{
                unmountOnBlur: true,
                headerShown:false,
                tabBarShowLabel:false,
                tabBarStyle:{
                    position:'absolute',
                    backgroundColor:'#ffffff',
                    elevation:1
                },
                tabBarHideOnKeyboard: true,
            }} 
        >
            <Tab.Screen name={"Home"} component={Home} options={{
                tabBarIcon: ({focused})=>{
                    return(
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <Image 
                                source={require('../asset/tabBarIcons/list.png')} 
                                resizeMode='contain'
                                style={{
                                    width: styles.tabBar.width,
                                    height: styles.tabBar.height,
                                    tintColor: focused? styles.tabBar.iconActiveColor:styles.tabBar.iconDeActiveColor
                                }}
                            />
                            <Text style={{color:focused? styles.tabBar.textActiveColor:styles.tabBar.textDeActiveColor,fontSize:styles.tabBar.fontSize}}>Etkinlikler</Text>
                        </View>
                    )
                }
            }}/>
            <Tab.Screen name={"AddEvent"} component={AddEvent} options={{
                tabBarStyle:{display:'none'},
                tabBarIcon: ({focused})=>{
                    return(
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <Image 
                                source={require('../asset/tabBarIcons/plus.png')} 
                                resizeMode='contain'
                                style={{
                                    width: styles.plusIcon.width,
                                    height: styles.plusIcon.height,
                                    tintColor: focused? styles.tabBar.iconActiveColor:styles.tabBar.iconDeActiveColor
                                }}
                            />
                        </View>
                    )
                }
            }}/>
            <Tab.Screen name={"CalendarEvents"} component={CalendarEvents} options={{
                tabBarIcon: ({focused})=>{
                    return(
                        <View style={{alignItems:'center', justifyContent:'center'}}>
                            <Image 
                                source={require('../asset/tabBarIcons/calendar.png')} 
                                resizeMode='contain'
                                style={{
                                    width: styles.tabBar.width,
                                    height: styles.tabBar.height,
                                    tintColor: focused? styles.tabBar.iconActiveColor:styles.tabBar.iconDeActiveColor
                                }}
                            />
                            <Text style={{color:focused? styles.tabBar.textActiveColor:styles.tabBar.textDeActiveColor,fontSize:styles.tabBar.fontSize}}>Takvim</Text>
                        </View>
                    )
                }
            }}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar:{
        textActiveColor:'#e32f45',
        textDeActiveColor:'#748c94',
        iconActiveColor:'#e32f45',
        iconDeActiveColor:'#748c94',
        fontSize:12,
        width:25,
        height:25
    },
    plusIcon:{
        width:40,
        height:40
    }
})

export default BottomTabs