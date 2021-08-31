// get medias
// mount stream and output
class UserMedia{
    static Get(param){
        return new Promise((resolve, reject) => {
            try{
                navigator.mediaDevices
                         .getUserMedia(param)
                         .then(resp => {
                             resolve(resp);
                         })
                         .catch((e) => {
                             resolve(e);
                         });
            } catch(e){
                resolve(e);
            }
        });
    }

    static GetAll(){
        return UserMedia.Get({
            audio : true,
            video : true
        });
    }

    static GetAudio(){
        return UserMedia.Get({ audio : true });
    }

    static GetVideo(){
        return UserMedia.Get({ video : true });
    }

    static MountAudio(stream, destination){
        try{
            destination.srcObject = stream;
        } catch(e){
            return e;
        }
    }

    static MountVideo(stream, destination){
        try{
            destination.srcObject = stream;
        } catch(e){
            return e;
        }
    }
}

export default UserMedia;