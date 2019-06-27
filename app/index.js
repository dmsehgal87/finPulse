import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as messaging from "messaging";
import { me } from "companion"


// Update the clock every minute
clock.granularity = "seconds";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const matchLabel = document.getElementById("matchLabel");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const result = document.getElementById("result");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  //console.log(myLabel.toString());
  myLabel.text = `${hours}:${mins}`;
  
  //get the match data
  var url = 'https://cricketapi-icc.pulselive.com/fixtures?matchTypes=T20I%2CT20%2CTEST%2CODI%2CFIRST_CLASS%2CLIST_A&tournamentTypes=I%2CWI&teamTypes=m&matchStates=C&page=0&pageSize=10&sort=desc';
  var data = {'key' : 'val'}
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          //Send object as JSON string to companion
          messaging.peerSocket.send(JSON.stringify(data));
    
          
    }
  

  //When companion sends a message
  messaging.peerSocket.onmessage = evt => {
    //Write to the display
    //console.log("Received message from companion");
    //console.log(evt.data);
    var matchLabel = document.getElementById("matchLabel");
    var score1 = document.getElementById("score1");
    var score2 = document.getElementById("score2");
    var result = document.getElementById("result");
    var obj = JSON.parse(evt.data);
    //console.log(JSON.stringify(obj));
    matchLabel.text = obj.teams;
    score1.text = obj.score1;
    score2.text = obj.score2;
    result.text = obj.matchStatus;
    
  }
  
}

