import UserMedia from '../../Component/UserMedia';

const _ = (p) => document.querySelector(p);

async function Onload(){
    let localVideo = _('#localVideo');
    let localAudio = _('#localAudio');
    // let remoteVideo = _('#remoteVideo');

    let audioStream = await UserMedia.Get('audio');
    if(audioStream.message){
        console.error('Get micro permission error. ', audioStream);
    } else{
        UserMedia.MountAudio(audioStream, localAudio);
    }

    let videoStream = await UserMedia.Get('video');
    if(videoStream.message){
        console.error('Get camera permission error. ', videoStream);
    } else{
        UserMedia.MountVideo(videoStream, localVideo);
    }
};

window.addEventListener('load', Onload);