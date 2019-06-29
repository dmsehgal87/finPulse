import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as messaging from "messaging";
import userActivity from "user-activity";
import { me } from "companion"


// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");
const matchLabel = document.getElementById("matchLabel");
const date = document.getElementById("date");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const result = document.getElementById("result");
var month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";  
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

var day = new Array();
day[0]= "Sun";
day[1]= "Mon";
day[2]= "Tue";
day[3]= "Wed";
day[4]= "Thu";
day[5]= "Fri";
day[6]= "Sat";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  date.text = day[today.getDay()] +", "+month[today.getMonth()]+" "+today.getDate();
  //console.log("day:"+day[today.getDay()]+"date:"+today.getDate()+" month:"+month[today.getMonth()]);
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
  var url = 'https://cricketapi-icc.pulselive.com/fixtures?matchTypes=T20I%2CT20%2CTEST%2CODI%2CFIRST_CLASS%2CLIST_A&tournamentTypes=I%2CWI&teamTypes=m&matchStates=C&page=0&pageSize=2&sort=desc';
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
  
  //update the steps and date
  const metricSteps = "steps";
  const amountSteps = userActivity.today.adjusted[metricSteps] || 0;
  var steps = document.getElementById("steps");
  //console.log(amountSteps);
  steps.text = amountSteps;
  
  
}

