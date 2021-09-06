import UserMedia from '../../Component/UserMedia';
import Signaling from '../../Component/Signaling';
import Peer from '../../Component/Peer';
import PaintBoard from '../../Component/PaintBoard';

const isTouch = /Android|iPhone|iPad|iPod|SymbianOS|Windows Phone/.test(navigator.userAgent);

const _ = (p) => document.querySelector(p);
const _C = ({ tagName = 'div', id = null }) => {
    let d = document.createElement(tagName);

    if(id){
        d.id = id;
    }

    return d
};

async function Onload(){
    let studentId = !isTouch ? 'student02' : 'student01';
    let localVideo;
    let localStream;
    let pb;
    let remoteVideo
    let remoteStream;

    if(isTouch){
        localVideo = _C({
            tagName : 'canvas',
            id : 'localVideo'
        });
        localStream = localVideo.captureStream();
        document.body.append(localVideo);

        pb = new PaintBoard({
            canvas : localVideo,
            logicalWidth : 500,
            logicalHeight : 500
            // enableHistory : true,
            // historyInterval : 500,
            // historyMax : 10,
            // background : param.background && param.background.image && bgConfig,
            // clearColor : param.background ? 'transparent' : '#ffffff'
        });
        pb.Tool('pen');
    }else{
        remoteVideo = _C({
            tagName : 'video',
            id : 'remoteVideo' });
        remoteStream = new MediaStream();
        document.body.append(remoteVideo);
    }

    const iceCfg = {
        'iceServers' : [
            {
                'urls' : [
                    'stun:stun.l.google.com:19302'
                    , 'stun:stun1.l.google.com:19302'
                    , 'stun:stun2.l.google.com:19302'
                    , 'stun:stun3.l.google.com:19302'
                    , 'stun:stun4.l.google.com:19302'
                    , 'stun:stun.ekiga.net'
                    , 'stun:stun.ideasip.com'
                    , 'stun:stun.schlund.de'
                    , 'stun:stun.stunprotocol.org:3478'
                    , 'stun:stun.voiparound.com'
                    , 'stun:stun.voipbuster.com'
                    , 'stun:stun.voipstunt.com'
                    , 'stun:stun.voxgratia.org'
                    , 'stun:stun.services.mozilla.com'
                ]
            }
            /*  { urls:['stun:twilio.com/stun-turn'] }*//*
             {
             urls: [
             "stun:stun1.l.google.com:19302",
             "stun:stun2.l.google.com:19302",
             ],
             },
             {
             urls: [
             "stun:global.stun.twilio.com:3478?transport=udp",
             ],
             },*/
        ],
        // 'iceTransportPolicy' : 'all',
        'iceCandidatePoolSize' : 10
    };

    async function onSignalingOffer(message){
        // console.log('get remote offer', message);
        let answer = await localPeer.SetRemoteOfferAndCreateAnswer(message.offer);
        // console.log('local answer',answer);
        signaling.SendAnswer({
            from : studentId,
            to : message.from,
            answer
        });
    };

    const onSignalingAnswer = (message) => {
        console.log('get remote answer', message);
        localPeer.SetRemoteAnswer(message.answer);
    };

    const onPeerIce = (ice) => {
        console.log('on local ice');
        signaling.SendIce({
            studentId,
            ice
        });
    };

    const onSignalingICE = (message) => {
        // console.log('remote ice ',message);
        localPeer.AddRemoteIce(message.ice);
        // console.log('get remote ice',message );
    };

    async function onNN(){
        console.log('on nn ');
        let offer = await localPeer.CreateOffer(studentId);
        console.log('create local offer');
        signaling.SendOffer({
            studentId,
            offer
        });
    };

    const localPeer = new Peer({
        iceCfg,
        onNN,
        onPeerIce,
        onPeerTrack
    });

    let signaling = await new Signaling({
        onSignalingOffer,
        onSignalingAnswer,
        onSignalingICE
    });

    signaling.Join(studentId);

    if(isTouch){
        localPeer.AddTracks(localStream);
    }
    /**** remote  ****/

    UserMedia.MountVideo(remoteStream,remoteVideo)

    async function onPeerTrack(event){
        console.log(event);
        remoteStream.addTrack(event.track);
        remoteVideo.muted = true
        remoteVideo.play()
    }

};

window.addEventListener('load', Onload);