import * as messaging from "messaging";
import { me } from "companion"

var url = 'https://cricketapi-icc.pulselive.com/fixtures?matchTypes=T20I%2CT20%2CTEST%2CODI%2CFIRST_CLASS%2CLIST_A&tournamentTypes=I%2CWI&teamTypes=m&matchStates=C&page=0&pageSize=10&sort=desc';
const host = "https://bz1ikefgtf.execute-api.us-east-1.amazonaws.com/api/";

console.log("Companion Running ");

//Server where the API is runnong (must be HTTPS)


// The Device application caused the Companion to start
var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

if (me.launchReasons.peerAppLaunched) {
  // The Device application caused the Companion to start
  console.log("Device application was launched!")
}

//When the watch sends a message
messaging.peerSocket.onmessage = evt => {
  //console.log("Data recieved: " + evt.data); //Log it
  //var url = host + "/fitbit"; // add a path to the URL
  fetch(url, {
      method : "GET",
      //headers : myHeaders,
      /*body: evt.data*/}) // Build the request
    .then(function(response){
      return response.json();}) //Extract JSON from the response
    .then(function(data) {             
      //console.log("Got response from server:", JSON.stringify(data)); // Log ig
    var team1 = data.content[0].scheduleEntry.team1.team.abbreviation;
    var team2 = data.content[0].scheduleEntry.team2.team.abbreviation;
    var teams = team1 +" VS "+team2;
    var score1 = team1+": "
    + data.content[0].scheduleEntry.team1.innings[0].runs +"/"+data.content[0].scheduleEntry.team1.innings[0].wkts
    +" in "+parseFloat((data.content[0].scheduleEntry.team1.innings[0].ballsFaced)/6).toFixed(1)+" overs";
    var score2 = team2+": "
    + data.content[0].scheduleEntry.team2.innings[0].runs +"/"+data.content[0].scheduleEntry.team2.innings[0].wkts
    +" in "+parseFloat((data.content[0].scheduleEntry.team2.innings[0].ballsFaced)/6).toFixed(1)+" overs";
    var matchStatus=data.content[0].scheduleEntry.matchStatus.text;
    const messageContent =
    {
      "teams": teams, 
      "score1": score1, 
      "score2": score2, 
      "matchStatus":matchStatus
    };
  //console.log("CompanionData:" + messageContent);
      //messaging.peerSocket.send(JSON.stringify(data.content[0].scheduleEntry.team1.team.fullName)); }) // Send it to the watch as a JSON string
        messaging.peerSocket.send(JSON.stringify(messageContent)); }) // Send it to the watch as a JSON string
    .catch(function(error) {
      console.log(error);}); // Log any errors with 
  
 
}