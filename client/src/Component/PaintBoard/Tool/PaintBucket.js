import { isTouch, eventsName } from '../Utils/Base';
import CoordTransform from '../Utils/CoordTransform';

// set this value true to stop tasks
let controlFlag = false;
let DBWorking = false;

const DumpBucket = ({ ctx, currCoord, inputColor, cb }) => {
    let x = Math.round(currCoord.x);
    let y = Math.round(currCoord.y);
    let { width, height } = ctx.canvas;
    let imageData = ctx.getImageData(0, 0, width, height);
    let startColor = GetImageDataByCoord({
        coord : {
            x,
            y
        },
        imageData
    });
    let pathMap = {};
    let todoArr = [[x, y]];
    let wait = false;
    let sum = null;


    if(DBWorking){
        console.warn('task running.');
        return
    }
    DBWorking = true
    controlFlag = false;
    inputColor = hexToRgbA(inputColor);

    let d1 = CompareColor(
        inputColor,
        startColor
    );

    if(d1 === 0){
        cb && cb('same color');
        return;
    }

    try{
        SafeLock();
    } catch(e){
        // console.log(e);
        cb && cb(e);
    } finally{
        // console.log(Object.keys(pathMap).length);
        // console.log(pathMap);
        // cb && cb();
    }

    function SafeLock(){
        let tmp = todoArr;
        wait = false;
        sum = 500;
        todoArr = [];

        if(controlFlag){
            DBWorking = false
            throw new Error('User interrupt');
        }

        for(let item of tmp){
            let [x, y] = item;
            Do(x, y);
        }

        if(wait){
            setTimeout(function(){
                // console.log('SafeLock');
                // console.count()
                SafeLock();
            }, 0);
        } else{
            // console.log(Object.keys(pathMap).length);
            DBWorking = false
            ctx.putImageData(imageData, 0, 0);
            cb && cb('done');
        }
    }

    // do
    function Do(x, y){
        if(controlFlag){
            return;
        }
        if(pathMap[x + '_' + y]){
            pathMap[x + '_' + y]++;
        }

        if(sum-- < 0){
            wait = true;
            todoArr.push([x, y]);
            return;
        }
        let currRgb = GetImageDataByCoord({
            coord : {
                x,
                y
            },
            imageData
        });

        // handle current
        let distance = CompareColor(
            startColor,
            currRgb
        );
        if(distance < 10){
            SetImageDataByCoord({
                imageData,
                rgba : inputColor,
                coord : {
                    x,
                    y
                }
            });
        } else{
            return;
        }

        pathMap[x + '_' + y] = true;

        for(let i = x - 1; i < x + 2; i++){
            for(let j = y - 1; j < y + 2; j++){
                if(
                    0 <= i && i < width && 0 <= j && j < height && !pathMap[i + '_' + j]
                ){
                    pathMap[i + '_' + j] = true;
                    Do(i, j);
                }
            }
        }
    }
};

const CompareColor = (c1, c2) => {
    var d = 0;

    Object.keys(c1)
          .map(k => {
              d += (c1[k] - c2[k]) ** 2;
          });
    return Math.sqrt(d);
};

const hexToRgbA = (hex) => {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1)
               .split('');
        if(c.length === 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');

        return {
            r : (c >> 16) & 255,
            g : (c >> 8) & 255,
            b : c & 255,
            a : 255
        };
    }
    throw new Error('Bad Hex');
};

const GetImageDataByCoord = ({ imageData, coord }) => {
    let { x, y } = coord;
    let { width, height, data } = imageData;
    var index = y * (width * 4) + x * 4;

    return {
        r : data[index],
        g : data[index + 1],
        b : data[index + 2],
        a : data[index + 3]
    };
};

const SetImageDataByCoord = ({ imageData, coord, rgba }) => {
    let { x, y } = coord;
    let { width, height, data } = imageData;
    var index = y * (width * 4) + x * 4;
    let { r, g, b, a } = rgba;

    // console.log(rgba);
    a = a || 255;
    // console.log(a);
    data[index] = r;
    data[index + 1] = g;
    data[index + 2] = b;
    data[index + 3] = a;
};

const PaintBucket = (() => {
    let canvas = null;
    let ctx = null;
    let _bucketWorking = false;

    const Start = function(){
        canvas = this.canvas;
        ctx = this.ctx;

        canvas['on' + eventsName[0]] = (event) => {
            if(_bucketWorking){
                console.log('bucket doing');
                return;
            }

            let { strokeColor } = this.strokeConfig;
            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;

            let coord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            this.OperatingStart();

            DumpBucket({
                inputColor : strokeColor,
                currCoord : coord,
                ctx,
                cb : (msg) => {
                    // console.log('msg in cb', msg);

                    _bucketWorking = false;
                    this.OperatingEnd();
                }
            });
        };
    };

    const Quit = function(){
        controlFlag = true;
        canvas['on' + eventsName[0]] = null;
    };

    return {
        Start,
        Quit
    };
})();

export default PaintBucket;