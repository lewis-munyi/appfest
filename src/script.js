function signout() {
    firebase.auth().signOut().then(function () {
        console.log("Signed out!");
        $("#gamecontainer").hide(); //Hide sign in container
        $("#signincontainer").show(); //Hide sign in container
        $("#usercontainer").hide(); //Hide user container
    }).catch(function (error) {
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
    var userinfo = firebase.database().ref('/players/' + uid);
    userinfo.on('value', function (snapshot) {
        if (JSON.stringify(snapshot) == "null") { //If user doesn't exist
            return registeruser(uid, displayName, email); //Register user
        } else {
            // lastquestion = snapshot.val().lastquestion;
            score = snapshot.val().score;
            var name = snapshot.val().name;
            var details = name + "<br> Score: " + score + "<br> Highest score: ";
            $("#username").text(name); //Append username
            $("#score").text("Points: " + score); //Append user points
        }
    });
    var userId = firebase.auth().currentUser.uid;
}

function playgame(category) {
    $("#category").hide();
    $("#gamecontainer").show();
    questioncategory = category;
    var userinfo = firebase.database().ref('/players/' + uid);
    userinfo.on('value', function (snapshot) {
        lastquestion = snapshot.val().lastquestion;
        score = snapshot.val().score;
    });
    currentquestion = lastquestion + 1;
    
    $("#questionNumber").text(currentquestion);
    firebase.database().ref('/questions/' + questioncategory + "/" + currentquestion).once('value').then(function (snapshot) {
        var questions = snapshot.val();
        legitanswer = questions.answer;
        questionpoints = questions.points;
        $("#questiontext").text(questions.question);
        console.log(questions.answer);
        console.log(questions.options[4]);
        $("#loption1").text(questions.options[1]);
        $("#loption2").text(questions.options[2]);
        $("#loption3").text(questions.options[3]);
        $("#loption4").text(questions.options[4]);
        console.log(questions.question);
    });
    // #26A69A teal
    // pink #E91E63
}

function verifyanswer() {
    var answer = document.querySelector('input[name = "options"]:checked').value;
    if (answer == legitanswer) {
        Materialize.toast("Answer " + answer + " is correct!", 1000);
        console.log("Question points:" + questionpoints);
        console.log("score: " + score);
        newScore = score + questionpoints;
        console.log("new score: " + newScore);
        firebase.database().ref('players/' + uid).set({
            name: displayName,
            email: email,
            lastquestion: currentquestion,
            score: newScore
        });
        playgame(questioncategory);
    } else {
        Materialize.toast("Answer " + answer + " is wrong!", 1000);
    }
}

function loadcategory(category) {
    if (category == 1) {
        category = "general";
    } else if (category == 2) {
        category = "science";
    } else {
        category = "history";
    }
    Materialize.toast("Loading " + category + " quizzes", 100);
    playgame(category);
};

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
$("#signincontainer").hide(); //Hide sign in container
$("#usercontainer").hide(); //Hide user container
$("#category").hide();
$("#gamecontainer").hide(); //Hide sign in container

//Declare global variables
var displayName, emailVerified, photoURL, uid, phoneNumber, providerData, lastquestion, legitanswer, questionpoints, score, currentquestion, questioncategory;
var ui = new firebaseui.auth.AuthUI(firebase.auth()); // Initialize the FirebaseUI Widget using Firebase.
ui.start('#firebaseui-auth-container', uiConfig); // Wait until the DOM is loaded.

initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            displayName = user.displayName;
            email = user.email;
            emailVerified = user.emailVerified;
            photoURL = user.photoURL;
            uid = user.uid;
            phoneNumber = user.phoneNumber;
            providerData = user.providerData;
            $("#category").show();
            $("#signincontainer").hide(); //Hide sign in container
            $("#gamecontainer").hide(); //Hide sign in container
            $("#userimage").attr("src", photoURL); //Show user dp
            // $("#username").text("Hi " + displayName + " here is where you left off"); //Append username

            checkifuserexists(uid, displayName, email); //First check if the crrent user has registered
            // playgame();
            //More code
        } else {
            // User is signed out.
            $("#gamecontainer").hide(); //Hide sign in container
            $("#usercontainer").hide(); //Hide user container
            $("#signincontainer").show(); //Show sign in container
        }
    }, function (error) {
        console.log(error);
    });
};
$(document).ready(function () {
    initApp()

    /*Materialize*/
    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({
        delay: 50
    });
})