$("#signincontainer").hide(); //Hide sign in container
$("#gamecontainer").hide(); //Hide sign in container

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
            $("#username").text("Hi " + displayName + " here is where you left off"); //Append username
            checkifuserexists(uid, displayName, email); //First check if the crrent user has registered
            loadquestion(uid, email);
            //More tests
            console.log(emailVerified); //true
            console.log(uid);
            console.log("Hello!");
        } else {
            // User is signed out.
            $("#gamecontainer").hide(); //Hide sign in container
            $("#signincontainer").show(); //Hide sign in container
        }
    }, function(error) {
        console.log(error);
    });
};

function fetchlastquestion(userid) {
    var lastqn = firebase.database().ref('players/' + userid + '/lastquestion'); //Get last question
    lastqn.on('value', function(snapshot) {
        snapshot = lastquestion;
        console.log(lastquestion); //Output its value on the screen
    });
}

function registeruser(uid, displayName, email) { //Receivee the name, id and email values as parameters
    firebase.database().ref('players/').set({ //Write once to the user Id and child nodes
        uid: {
            name: displayName,
            email: email,
            lastquestion: 0,
            score: 0
        }
    });
    //Once complete it will (I hope) return to the main loop
}

function checkifuserexists(uid, displayName, email) {
    var userId = firebase.auth().currentUser.uid;
    if (firebase.database().ref('/players/' + userId).once('value')) { //If their account exists then proceed to fetch the last question they answered
        fetchlastquestion(uid);
    } else {
        registeruser(uid, displayName, email); //Else register them
    }

    function signout() {
        firebase.auth().signOut().then(function() {
            console.log("Sign-out .");
        }).catch(function(error) {
            // An error happened.
        });
    }
    $(document).ready(function() {
        initApp()

        /*Materialize*/
        $(".button-collapse").sideNav();
        $('.tooltipped').tooltip({
            delay: 50
        });
    })
};