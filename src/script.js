$("#signincontainer").hide(); //Hide sign in container
$("#gamecontainer").hide(); //Hide sign in container
// firebase.initializeApp(config);
const auth = firebase.auth();
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // TOS url.
    tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
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
            $("#userimage").attr("src",photoURL); //Show user dp
            $("#username").text("Hi " + displayName + " here is where you left off"); //Append username
            //More tests
            console.log(emailVerified); //true
            console.log(uid);
            console.log("Hello!");
            // user.getIdToken().then(function(accessToken) {
            //   document.getElementById('sign-in-status').textContent = 'Signed in';
            //   document.getElementById('sign-in').textContent = 'Sign out';
            //   document.getElementById('account-details').textContent = JSON.stringify({
            //     displayName: displayName,
            //     email: email,
            //     emailVerified: emailVerified,
            //     phoneNumber: phoneNumber,
            //     photoURL: photoURL,
            //     uid: uid,
            //     accessToken: accessToken,
            //     providerData: providerData
            //   }, null, '  ');
            // });

        } else {
            // User is signed out.
            $("#gamecontainer").hide(); //Hide sign in container
            $("#signincontainer").show(); //Hide sign in container
        }
    }, function (error) {
        console.log(error);
    });
};


function signout() {
    firebase.auth().signOut().then(function () {
        console.log("Sign-out .");
    }).catch(function (error) {
        // An error happened.
    });
}


$(document).ready(function () {
    initApp()
    
    /*Materialize*/
    $(".button-collapse").sideNav(); 
    $('.tooltipped').tooltip({delay: 50});
});



















































function signin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use

        console.log(name);
        console.log(photoUrl);
        console.log(emailVerified); //true
        console.log(uid);
        console.log("Hello!");
        console.log();

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });


}

function signInWithRedirect() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
        }
        // The signed-in user info.
        var user = result.user;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid; // The user's ID, unique to the Firebase project. Do NOT use

        console.log(name);
        console.log(photoUrl);
        console.log(emailVerified); //true
        console.log(uid);
        console.log("Hello!");
        console.log();
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function checkUserStatus() {
    var user = firebase.auth().currentUser;
    if (user) {
        console.log("User is signed in.");
    } else {
        // No user is signed in.
    }
}