class Peer{
    static offerOption = {
        offerToReceiveAudio : 1,
        offerToReceiveVideo : 1
    };

    constructor({ iceCfg, onPeerIce, onPeerTrack, onNN }){
        let pc;

        pc = this.pc = new RTCPeerConnection(iceCfg);

        pc.addEventListener('negotiationneeded', onNN);

        pc.addEventListener('icecandidate', (e) => {
            if(e.candidate){
                // console.log('local ice', e);
                onPeerIce(e.candidate);
                // console.log('icecandidate', e.candidate);
            } else{
                /* there are no more candidates coming during this negotiation */
            }
        });

        pc.addEventListener('connectionstatechange', e => {
            console.log('peer status',pc.connectionState);
            /*if (pc.connectionState === 'connected'){
                console.log('Peers connected!\n');
            }*/
        });
        pc.addEventListener('track', onPeerTrack);
    }

    async CreateOffer(){
        let { pc } = this;

        const offer = await pc.createOffer(Peer.offerOption);
        await pc.setLocalDescription(offer);
        return offer;
    }

    async SetRemoteOfferAndCreateAnswer(offer){
        console.log('set remote offer',offer);
        let { pc } = this;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        return answer;
    }

    async SetRemoteAnswer(answer){
        console.log('set remote answer');
        const remoteDesc = new RTCSessionDescription(answer);
        await this.pc.setRemoteDescription(remoteDesc);
    }

    async AddRemoteIce(ice){
        console.log('add remote ice');
        await this.pc.addIceCandidate(ice,()=>{},()=>{},);
    }

    AddTracks(stream){
        stream.getTracks()
              .forEach(track => this.pc.addTrack(track, stream));
    }
}

export default Peer;