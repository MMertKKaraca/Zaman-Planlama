package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
)

var data string

type Events []struct {
	EventID        int    `json:"eventId"`
	Tag            string `json:"tag"`
	Comment        string `json:"comment"`
	Color          string `json:"color"`
	NotificationID string `json:"notificationId"`
	StartingDate   string `json:"startingDate"`
	StartingTime   string `json:"startingTime"`
	EndingDate     string `json:"endingDate"`
	EndingTime     string `json:"endingTime"`
}

func main() {
    //root
	var p Events
    http.HandleFunc("/",func(w http.ResponseWriter, r *http.Request){
        if r.Method=="POST"{

			
			errr := json.NewDecoder(r.Body).Decode(&p)
			if errr != nil {
				fmt.Println(errr.Error());
			}
			
			fmt.Println(p);
			objdata, error2 := json.Marshal(p);
			if error2 != nil {
				fmt.Println(error2)
				return
			}
			data = string(objdata);
			
        }
		if r.Method=="GET"{
			var frm = []byte(data);
			w.Write(frm);
		}
    })

    //start web server
    if err:=http.ListenAndServe("192.168.1.34:8080",nil);
    err != nil{
        log.Fatal("ListenAndServe:",err);
    }
}