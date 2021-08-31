import UserMedia from '../../Component/UserMedia';
import Signaling from '../../Component/Signaling';
import Peer from '../../Component/Peer';

const isTouch = /Android|iPhone|iPad|iPod|SymbianOS|Windows Phone/.test(navigator.userAgent);

const _ = (p) => document.querySelector(p);

async function Onload(){
    let localVideo = _('#localVideo');
    let localStream;
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
        // console.log('on local ice');
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
    let studentId = isTouch ? 'student02' : 'student01';

    signaling.Join(studentId);

    localStream = await UserMedia.GetAll();
    if(!localStream.message){
        UserMedia.MountVideo(localStream, localVideo);
        localPeer.AddTracks(localStream);
    } else{
        console.error('Get permission error. ', localStream);
    }


    /**** remote  ****/
    const remoteStream = new MediaStream();
    const remoteVideo = _('#remoteVideo');

    UserMedia.MountVideo(remoteStream,remoteVideo)

    async function onPeerTrack(event){
        remoteStream.addTrack(event.track, remoteStream);
    }

};

window.addEventListener('load', Onload);