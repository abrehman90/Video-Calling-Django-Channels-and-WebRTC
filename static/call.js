
let localVideo = document.querySelector('#localVideo');
let remoteVideo = document.querySelector('#remoteVideo');
let btnToggleAudio = document.querySelector('#btn-toggle-audio');
let btnToggleVideo = document.querySelector('#btn-toggle-video');
let otherUser;
let remoteRTCMessage;
let iceCandidatesFromCaller = [];
let peerConnection;
let remoteStream;
let localStream;
let callInProgress = false;
let callSocket;

/////////////////////////////////////////////

function call() {
    let userToCall = document.getElementById("callName").value;
    otherUser = userToCall;

    beReady()
        .then(bool => {
            processCall(userToCall)
        })
}

function answer() {
    beReady()
        .then(bool => {
            processAccept();
        });

    document.getElementById("answer").style.display = "none";
}

function decline() {
    processDecline();
    window.location.replace('/video/')
}

function callended() {
    processCallEnded();
}

let pcConfig = {
    "iceServers":
        [
            {"url": "stun:stun.l.google.com:19302"}
        ]
};

let sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

/////////////////////////////////////////////

function connectSocket() {
    let ws_scheme = window.location.protocol === "https:" ? "wss://" : "ws://";

    callSocket = new WebSocket(
        ws_scheme
        + window.location.host
        + '/ws/call/'
    );

    callSocket.onopen = event =>{
        callSocket.send(JSON.stringify({
            type: 'login',
            data: {
                name: myName
            }
        }));
        console.log('ma on ho ',myName)
    };

    callSocket.onmessage = (e) =>{
        let response = JSON.parse(e.data);


        let type = response.type;


        if(type == 'connection') {
            console.log("user is connected",response.data.message)
        }

        if(type === 'call_received') {
            onNewCall(response.data)
        }

        if(type === 'call_answered') {
            onCallAnswered(response.data);
        }

        if(type === 'call_decline') {
            onCallDecline(response.data);
            window.location.replace('/');

        }

        if(type === 'user_left') {
            onendCall(response.data);
            callSocket.close();
        }

        if(type === 'ICEcandidate') {
            onICECandidate(response.data);
        }
    };

    const onNewCall = (data) =>{
        otherUser = data.caller;
        remoteRTCMessage = data.rtcMessage;
        document.getElementById("callerName").innerHTML = otherUser;
        document.getElementById("call").style.display = "none";
        document.getElementById("answer").style.display = "block";
    };

    const onCallAnswered = (data) =>{
        remoteRTCMessage = data.rtcMessage;
        peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
        document.getElementById("calling").style.display = "none";
        callProgress()
    };

    const onCallDecline = (data) => {
        remoteRTCMessage = data.rtcMessage;
    };

    const onICECandidate = (data) =>{
        let message = data.rtcMessage;
        let candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });
        if (peerConnection) {
            peerConnection.addIceCandidate(candidate);
        } else {
            iceCandidatesFromCaller.push(candidate);
        }
    };

    const onendCall = (data) =>{
        remoteRTCMessage = data.rtcMessage;
        if (peerConnection) {
        peerConnection.ontrack = null;
        peerConnection.onremovetrack = null;
        peerConnection.onremovestream = null;
        peerConnection.onicecandidate = null;
        peerConnection.oniceconnectionstatechange = null;
        peerConnection.onsignalingstatechange = null;
        peerConnection.onicegatheringstatechange = null;
        peerConnection.onnegotiationneeded = null;
        peerConnection.close();
        peerConnection = null;
        removeVideo(remoteVideo);
        callSocket.close()
        }
        document.getElementById("inCall").style.display = "none";
        document.getElementById("userInfo").style.display = "none";
        document.getElementById("btn-toggle-audio").style.display = "none";
        document.getElementById("btn-toggle-video").style.display = "none";
        document.getElementById("disconnect").style.display = "none";
        document.getElementById("dis").style.display = "block";
    };
}

/////////////////////////////////////////////

function sendCall(data) {
    callSocket.send(JSON.stringify({
        type: 'call',
        data
    }));

    document.getElementById("call").style.display = "none";
    document.getElementById("otherUserNameCA").innerHTML = otherUser;
    document.getElementById("calling").style.display = "block";
}

function answerCall(data) {
    callSocket.send(JSON.stringify({
        type: 'answer_call',
        data
    }));
    callProgress();
}

function DeclineCallEnd(data) {
    callSocket.send(JSON.stringify({
        type: 'call_decline',
        data
    }));

}

function sendICEcandidate(data) {
    callSocket.send(JSON.stringify({
        type: 'ICEcandidate',
        data
    }));

}

function sendVideoCallEnd(data) {
    callSocket.send(JSON.stringify({
        type: 'user_left',
        data
    }));

}

/////////////////////////////////////////////

function beReady() {
    return navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            var audioTracks = stream.getAudioTracks();
            var videoTracks = stream.getVideoTracks();

            audioTracks[0].enabled = true;
            videoTracks[0].enabled = true;

            btnToggleAudio.addEventListener('click', () =>{
                audioTracks[0].enabled = !audioTracks[0].enabled;

                if(audioTracks[0].enabled){
                    btnToggleAudio.innerHTML = 'Audio Mute';

                    return;
                }
                btnToggleAudio.innerHTML = 'Audio Unmute';
            });
            btnToggleVideo.addEventListener('click', () =>{
                videoTracks[0].enabled = !videoTracks[0].enabled;

                if(videoTracks[0].enabled){
                    btnToggleVideo.innerHTML = 'Video Off';
                    return;
                }
                btnToggleVideo.innerHTML = 'Video On';
            });

            return createConnectionAndAddStream()
        })
        .catch(function (e) {
            alert('Please allow The Camera & Mic ');
        });
}

/////////////////////////////////////////////

function processCall(userName) {
    peerConnection.createOffer((sessionDescription) => {
        peerConnection.setLocalDescription(sessionDescription);
        sendCall({
            name: userName,
            rtcMessage: sessionDescription,
        })
    }, (error) => {
        console.log("Error");
    });
}

function processAccept() {
    peerConnection.setRemoteDescription(new RTCSessionDescription(remoteRTCMessage));
    peerConnection.createAnswer((sessionDescription) => {
        peerConnection.setLocalDescription(sessionDescription);
        if (iceCandidatesFromCaller.length > 0) {
            for (let i = 0; i < iceCandidatesFromCaller.length; i++) {
                let candidate = iceCandidatesFromCaller[i];
                try {
                    peerConnection.addIceCandidate(candidate).then(done => {
                    }).catch(error => {
                        console.log(error);
                    })
                } catch (error) {
                    console.log(error);
                }
            }
            iceCandidatesFromCaller = [];
        } else {
            console.log("NO Ice candidate in queue");
        }

        answerCall({
            caller: otherUser,
            rtcMessage: sessionDescription
        })

    }, (error) => {
    })
}

function processDecline() {
    peerConnection = new RTCPeerConnection(pcConfig);
    peerConnection.createOffer((sessionDescription) => {
        DeclineCallEnd({
            name: otherUser,
            rtcMessage: sessionDescription,
        })
    }, (error) => {
        console.log("Error");
    });
}

function processCallEnded() {
    peerConnection.createOffer((sessionDescription) => {
        sendVideoCallEnd({
            name: otherUser,
            rtcMessage: sessionDescription,
        })
    }, (error) => {
        console.log("Error");
    });
}

/////////////////////////////////////////////////////////

function createConnectionAndAddStream() {
    createPeerConnection();
    peerConnection.addStream(localStream);
    return true;
}

function createPeerConnection() {
    try {
        peerConnection = new RTCPeerConnection(pcConfig);
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.onaddstream = handleRemoteStreamAdded;
        peerConnection.onremovestream = handleRemoteStreamRemoved;
    } catch (e) {
        alert('Cannot create RTCPeerConnection object.');
    }
}

/////////////////////////////////////////////////////////

function handleIceCandidate(event) {
    if (event.candidate) {
        sendICEcandidate({
            user: otherUser,
            rtcMessage: {
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            }
        })

    }
}

function handleRemoteStreamAdded(event) {
    remoteStream = event.stream;
    remoteVideo.srcObject = remoteStream;
}

function handleRemoteStreamRemoved(event) {
    remoteVideo.srcObject = null;
    localVideo.srcObject = null;
}

/////////////////////////////////////////////////////////

function callProgress() {

    document.getElementById("videos").style.display = "block";
    document.getElementById("otherUserNameC").innerHTML = otherUser;
    document.getElementById("inCall").style.display = "block";

    callInProgress = true;
}

function removeVideo(video) {
    var videoWrapper = video.parentNode;

    videoWrapper.parentNode.removeChild(videoWrapper);

}
