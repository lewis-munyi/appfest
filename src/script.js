/*Materialize*/
$( document ).ready(function(){
    $(".button-collapse").sideNav();
    
});

firebase.initializeApp(config);
const auth = firebase.auth();
// FirebaseUI config.
var uiConfig = {
signInSuccessUrl: '/game.html',
signInOptions: [
firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//   firebase.auth.GithubAuthProvider.PROVIDER_ID,
//   firebase.auth.EmailAuthProvider.PROVIDER_ID,
//   firebase.auth.PhoneAuthProvider.PROVIDER_ID
],
// TOS url.
tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// Wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);