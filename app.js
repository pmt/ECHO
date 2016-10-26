var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "firebase-cred.json",
  databaseURL: "https://echo-pmt.firebaseio.com"
});

var stripe = require("stripe")(
 ""
);

var db = firebase.database();
var ref = db.ref("/");

ref.on("child_added", function(snapshot) {
  console.log(snapshot.key, snapshot.val());
  var orderRef = ref.child(snapshot.key);
  var order = snapshot.val()

  stripe.customers.create({
    source: order.payment
  })
    .then(function(customer) {
      // Save customer id to Firebase
      var customerRef = orderRef.child("customer");
      return customerRef.update({
        stripeId: customer.id
      })
        .then(function() {
          return customer;
        });
    })
    .then(function(customer) {
      console.log("customer id saved")
      // Charge customer
      return stripe.charges.create({
        amount: order.product.price*100, // Amount in cents
        currency: "usd",
        customer: customer.id
      });
    })
    .then(function(charge) {
      // Save charge to Firebase -- similar to product, using orderRef (nothing overwritten)
      var chargeRef = orderRef.child("charge");
      return chargeRef.update({
        charge: charge.id
      })
    });
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code)
});

