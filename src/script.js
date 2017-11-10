 function signout() {
     firebase.auth().signOut().then(function() {
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
         lastquestion: {
             general: 0,
             science: 0,
             history: 0
         },
         score: 0
     };
     var updates = {};
     updates['/players/' + uid] = studentData;
     return firebase.database().ref().update(updates); //Register student
 }
 function checkifuserexists(uid, displayName, email) {
     var userinfo = firebase.database().ref('/players/' + uid);
     userinfo.on('value', function(snapshot) {
         if (JSON.stringify(snapshot) == "null") { //If user doesn't exist
             return registeruser(uid, displayName, email); //Register user
         } else {
             // lastquestion = snapshot.val().lastquestion;
             score = snapshot.val().score;
             var name = snapshot.val().name;
             var details = name + "<br> Score: " + score + "<br> Leaderboard highscore: ";
             $("#username").text(name); //Append username
             $("#score").text("Your score: " + score); //Append user points
         }
     });
     var userId = firebase.auth().currentUser.uid;
 }
 function verifyanswer() {
     var answer = document.querySelector('input[name = "options"]:checked').value;
     if (answer == legitanswer) {
         var $approval = $('<span>Answer ' + answer + ' is correct!</span>').add($('<button onclick="playgame()" class="btn-flat toast-action">Proceed</button>'));
         newScore = score + questionpoints;
         if (questioncategory == "science") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         } else if (questioncategory == "general") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         } else if (questioncategory == "history") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         }
         var updates = {};
         updates['players/' + uid + '/score'] = newScore;
         firebase.database().ref().update(updates);
         Materialize.toast($approval, 5000); // playgame();
     } else {
         Materialize.toast("Incorrect! The correct answer is option " + answer, 1000);
         if (questioncategory == "science") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         } else if (questioncategory == "general") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         } else if (questioncategory == "history") {
             var updates = {};
             updates['players/' + uid + "/lastquestion/" + questioncategory] = currentquestion;
             firebase.database().ref().update(updates);
         }
         playgame();
     }
 }
 function playgame() {
     $("#category").hide();
     $("#gamecontainer").show();
     var getlastquestion = firebase.database().ref('/players/' + uid + "/lastquestion/");
     getlastquestion.on('value', function(snapshot) {
         lastquestionsobject = snapshot.val();
         if (questioncategory == "science") {
             currentquestion = lastquestionsobject.science + 1;
         } else if (questioncategory == "general") {
             currentquestion = lastquestionsobject.general + 1;
         } else if (questioncategory == "history") {
             currentquestion = lastquestionsobject.history + 1;
         }
     });
     $("#questionNumber").text(currentquestion);
     firebase.database().ref('/questions/' + questioncategory + "/" + currentquestion).once('value').then(function(snapshot) {
         var questions = snapshot.val();
         legitanswer = questions.answer;
         questionpoints = questions.points;
         $("#questiontext").text(questions.question);
         $("#loption1").text(questions.options[1]);
         $("#loption2").text(questions.options[2]);
         $("#loption3").text(questions.options[3]);
         $("#loption4").text(questions.options[4]);
     }); // #26A69A teal pink #E91E63
 }
 function loadcategory(category) {
     if (category == 1) {
         questioncategory = "general";
     } else if (category == 2) {
         questioncategory = "science";
     } else {
         questioncategory = "history";
     }
     Materialize.toast("Loading " + questioncategory + " quizzes", 1000);
     playgame();
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
 var displayName, emailVerified, photoURL, uid, phoneNumber, providerData, lastquestion, legitanswer, questionpoints, highscore, score, currentquestion, lastquestionsobject, questioncategory;
 var ui = new firebaseui.auth.AuthUI(firebase.auth()); // Initialize the FirebaseUI Widget using Firebase.
 ui.start('#firebaseui-auth-container', uiConfig); // Wait until the DOM is loaded.
 initApp = function() {
     firebase.auth().onAuthStateChanged(function(user) {
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
             if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                 $("#userimage").attr("src", photoURL);
             } else {
                 document.getElementById("userimage").width = "90";
             }
             checkifuserexists(uid, displayName, email); //First check if the crrent user has registered
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
 var listentoscore = firebase.database().ref('players/');
 listentoscore.on('child_changed', function(data) {
     if (score > highscore) {
         firebase.database().ref('highscore/').set({
             name: displayName,
             email: email,
             score: score
         });
     }
 });
 var gethighscores = firebase.database().ref('/highscore');
 gethighscores.on('value', function(snapshot) {
     highscore = snapshot.val().score;
     $('#highscore').text("Leaderboard highscore: " + highscore);
 });
 $(document).ready(function() {
     initApp()
     $('.tooltipped').tooltip({ delay: 50 });
 })