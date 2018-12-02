function validateform(myid)
{
    if(myid=='Login')
    {
        if (document.getElementById('lemail').value == "" || document.getElementById('lpass').value == "") {
            document.getElementById("lstatusstrong").innerHTML="Error!";
            document.getElementById("lstatus").innerHTML="Fill all fields to login!";
            document.getElementById("lstatus").className='alert alert-warning';
            document.getElementById("lstatus").style.display='block';
            $("#lstatus").fadeOut(3000);
        }
        else {
            var logemail=document.getElementById('lemail').value;
            var logpass=document.getElementById('lpass').value;
            firebase.auth().signInWithEmailAndPassword(logemail, logpass)
            .then(function()
            {
                var user=firebase.auth().currentUser;
                if(user.emailVerified)
                {
                    //alert("logged in successfully");
                    $('#loginsuccessmodal').modal('show');
                    $('#loginsignuppopup').modal('hide');
                    $('#loginsuccessmodal').fadeOut('slow');
                    document.getElementById("lscallbutton").style.display="none";
                    document.getElementById("signoutbtn").style.display="block";
                    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
                        // Send token to your backend via HTTPS
                        // ...
                            savesessiondetails(firebase.auth().currentUser,idToken);
                        }).catch(function(error) {
                        // Handle error
                        var errorMessage=error.message;
                        alert(errorMessage);
                    });
                }
                else
                {
                    document.getElementById("lstatusstrong").innerHTML="Error!";
                    document.getElementById("lstatus").innerHTML="Verify before logging in";
                    document.getElementById("lstatus").className='alert alert-warning';
                    document.getElementById("lstatus").style.display='block';
                    $("#lstatus").fadeOut(3000);
                    signoutuser();
                }       
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                    document.getElementById("lstatusstrong").innerHTML="Error!";
                    document.getElementById("lstatus").innerHTML="Wrong Password";
                    document.getElementById("lstatus").classname='alert alert-danger';
                    document.getElementById("lstatus").style.display='block';
                    $("#lstatus").fadeOut(3000);
                }
                else if(errorCode == 'auth/invalid-email')
                {
                    document.getElementById("lstatusstrong").innerHTML="Error!";
                    document.getElementById("lstatus").innerHTML="Wrong Email";
                    document.getElementById("lstatus").className='alert alert-danger';
                    document.getElementById("lstatus").style.display='block';
                    $("#lstatus").fadeOut(3000);
                }
                else {
                    alert(errorMessage);
                }
            });
            
        }
    }
    else if(myid=='Signup')
    {
        if (document.getElementById('sname').value == "" || document.getElementById('semail').value == "" || document.getElementById('sphone').value == "" || document.getElementById('scpass').value == "" || document.getElementById('spass').value == "") {
            document.getElementById("sstatusstrong").innerHTML="Error!";
            document.getElementById("sstatus").innerHTML="Fill all signup fields to continue!";
            document.getElementById("sstatus").className='alert alert-warning';
            document.getElementById("sstatus").style.display='block';
            $("#sstatus").fadeOut(3000);
        }
        else {
            if(document.getElementById('spass').value == document.getElementById('scpass').value )
            {
                var semail = document.getElementById('semail').value;
                var spassword = document.getElementById('spass').value;
                firebase.auth().createUserWithEmailAndPassword(semail,spassword)
                .then(function(){
                    document.getElementById("sstatusstrong").innerHTML="Hurray!";
                    document.getElementById("sstatus").innerHTML="Signed up successfuly";
                    document.getElementById("sstatus").style.display='block';
                    $("#sstatus").fadeOut(3000);
                    send_verification();
                    updateprofiledetails(firebase.auth().currentUser.uid,document.getElementById('sname').value,document.getElementById('semail').value,document.getElementById('sphone').value);
                })
                .catch(function(error){
                // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                // ...
                    if (errorCode == 'auth/weak-password') {
                        document.getElementById("sstatusstrong").innerHTML="Error!";
                        document.getElementById("sstatus").innerHTML="Password too weak";
                        document.getElementById("sstatus").className='alert alert-danger';
                        document.getElementById("sstatus").style.display='block';
                        $("#sstatus").fadeOut(3000);
                    } else {
                        document.getElementById("sstatusstrong").innerHTML="Error!";
                        document.getElementById("sstatus").innerHTML=errorMessage;
                        document.getElementById("sstatus").className='alert alert-danger';
                        document.getElementById("sstatus").style.display='block';
                        $("#sstatus").fadeOut(3000);
                    }
                });
            }
            else
            {
                document.getElementById("sstatusstrong").innerHTML="Error!";
                document.getElementById("sstatus").innerHTML="Passwords not matching";
                document.getElementById("sstatus").className='alert alert-danger';
                document.getElementById("sstatus").style.display='block';
                $("#sstatus").fadeOut(3000);
            }
        }
    }
}
function checksignedin()
{
    var user = firebase.auth().currentUser;

    if (user) {
    return user;
    } else {
    return null;
    }
}
function send_verification()
{
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
     document.getElementById('lstatus').innerHTML="verification sent to the email ID";
     document.getElementById('lstatus').style.display="block";
     $("#lstatus").fadeOut(20000);
    }).catch(function(error) {
    // An error happened.
    });
}
function togglelsbutton(txt)
{
    if(txt=='s')
    {
       document.getElementById('tgglelsbutton').innerHTML="Signup";
       document.getElementById('tgglelsbutton').value="Signup";
    }
    else
    {
        document.getElementById('tgglelsbutton').innerHTML="Login";
        document.getElementById('tgglelsbutton').value="Login";
    }
}
function myMap() {
    var myCenter = new google.maps.LatLng(12.921971,77.567143);
    var mapProp = {center:myCenter, zoom:12, scrollwheel:false, draggable:false, mapTypeId:google.maps.MapTypeId.ROADMAP};
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var marker = new google.maps.Marker({position:myCenter});
    marker.setMap(map);
}
function signoutuser(sel)
{
    firebase.auth().signOut().then(function() {
                // Sign-out successful.
                }).catch(function(error) {
                var errorMessage = error.message;
                alert(errorMessage);
            });
    if(sel==1)
    {
        $('#signoutalert').modal('show');
        $('#signoutalert').fadeOut(4000);
        document.getElementById("lscallbutton").style.display="block";
        document.getElementById("signoutbtn").style.display="none";
    }
}
function clearallfields()
{
    document.getElementById('lemail').value=""; 
    document.getElementById('lpass').value="";
    document.getElementById('semail').value="";
    document.getElementById('spass').value="";
    document.getElementById('sname').value="";
    document.getElementById('scpass').value="";
    document.getElementById('sphone').value="";
}
function savesessiondetails(u,tokenid){

   //This sends a get request to executeInit.jsp
   //
   //Save the session token and uid inside the firebase realtime database

}
function updateprofiledetails(firebaseuid,uname,email,phonenumber)
{
    var a=['Default'];
    var db=firebase.firestore();
    // Add a new document with a generated id.
    console.log(firebaseuid);
    var dref=db.collection("Users").doc(firebaseuid);
    dref.set({
        Name: uname,
        Email: email,
        PhoneNumber:phonenumber,
        PlaylistArrayFields:a
    })
    .then(function() {
        signoutuser();
        console.log("updated details");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    //This thing can be used to update the playlists
    //dref.update({
    //        PlaylistArrayFields: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
    //    });
}

