var listentohighscore = firebase.database().ref('highscore/');
listentohighscore.on('child_changed', function(data) {
    firebase.database().ref('/highscore').on('value', function(snapshot) {
        xname = snapshot.val().name;
        xscore = snapshot.val().score;
        Push.create("New Highscore!", {
            body: xname + ": " + xscore,
            icon: 'src/icons/code128.png',
            timeout: 40000,
            onClick: function() {
                window.focus();
                this.close();
            }
        });
    });
});