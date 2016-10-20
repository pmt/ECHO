var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "firebase-cred.json",
  databaseURL: "https://echo-pmt.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("/");

ref.on("child_added", function(snapshot) {
  console.log(snapshot.key, snapshot.val());
  // TODO: call Stripe API
  // three nested: get updates
  // post to stripe
  // when stripe finishes, save back to firebase
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code)
});

