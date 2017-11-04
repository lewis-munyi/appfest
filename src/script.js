$("#signincontainer").hide(); //Hide sign in container
$("#usercontainer").hide(); //Hide user container
$("#gamecontainer").hide(); //Hide sign in container
function signout() {
    firebase.auth().signOut().then(function() {
        console.log("Signed out!");
        $("#gamecontainer").hide(); //Hide sign in container
        $("#signincontainer").show(); //Hide sign in container
        $("#usercontainer").hide(); //Hide user container
    }).catch(function(error) {
        console.log("Couldn't sign out");
    });
}


function registeruser(uid, displayName, email) { //Receive the name, id and email values as parameters
    // A student entry.
    var studentData = {
        name: displayName,
        email: email,
        lastquestion: 0,
        score: 0
    };
    var updates = {};
    updates['/players/' + uid] = studentData;
    return firebase.database().ref().update(updates); //Register student
}

function checkifuserexists(uid, displayName, email) {
    firebase.database().ref('/players/' + uid).once('value').then(function(snapshot) {
        if (JSON.stringify(snapshot) == "null") { //If user doesn't exist
            return registeruser(uid, displayName, email); //Register user
        } else {
            var lastquestion = snapshot.val().lastquestion;
            var score = snapshot.val().score;
            var name = snapshot.val().name;
            console.log(lastquestion + score);
            var details = name + "<br> Score: " + score + "<br> Highest score: ";
            $("#username").text(name); //Append username
            $("#score").text("Points: " + score); //Append user points


        }
    });
    var userId = firebase.auth().currentUser.uid;
}
const auth = firebase.auth(); // firebase.initializeApp(config);
var database = firebase.database();

// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>' // Terms Of Service url.
};

var ui = new firebaseui.auth.AuthUI(firebase.auth()); // Initialize the FirebaseUI Widget using Firebase.
ui.start('#firebaseui-auth-container', uiConfig); // Wait until the DOM is loaded.

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            $("#signincontainer").hide(); //Hide sign in container
            $("#gamecontainer").show(); //Hide sign in container
            $("#userimage").attr("src", photoURL); //Show user dp
            // $("#username").text("Hi " + displayName + " here is where you left off"); //Append username
            checkifuserexists(uid, displayName, email); //First check if the crrent user has registered

            //More code
        } else {
            // User is signed out.
            $("#gamecontainer").hide(); //Hide sign in container
            $("#usercontainer").hide(); //Hide user container
            $("#signincontainer").show(); //Show sign in container
        }
    }, function(error) {
        console.log(error);
    });
};
$(document).ready(function() {
    initApp()

    /*Materialize*/
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({
        delay: 50
    });
})