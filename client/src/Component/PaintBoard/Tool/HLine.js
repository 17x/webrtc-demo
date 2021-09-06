/*
* HLine : half line
* */
import { isTouch, eventsName } from '../Utils/Base';
import CoordTransform from '../Utils/CoordTransform';
import Stroke from '../Utils/Stroke';
import Fill from '../Utils/Fill';
import CloneCanvas from '../Utils/CloneCanvas';

const extend = (A, B, len) => {
    let lenAB = Math.sqrt(
        Math.pow(A.x - B.x, 2) +
        Math.pow(A.y - B.y, 2)
    );
    let C = {};

    C.x = B.x + (B.x - A.x) / lenAB * len;
    C.y = B.y + (B.y - A.y) / lenAB * len;

    return C;
};
const HLine = (() => {
    let canvas = null;
    let ctx = null;
    let points = [];
    let that = null;
    let cloneCanvas = null;
    let isClean = true;

    const HandleMove = (event) => {
        if(points.length > 0){
            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;
            let currCoord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });
            let endPoint = points[points.length - 1];

            endPoint.x = currCoord.x;
            endPoint.y = currCoord.y;
            Render();
        }
        event.preventDefault();
    };

    const Render = () => {
        let { strokeWidth, strokeColor } = that.strokeConfig;
        let { width, height } = that.canvas;
        let start = points[0];
        let end = points[1];

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(cloneCanvas, 0, 0);

        if(start){
            if(!end){
                Fill({
                    ctx,
                    type : 'circle',
                    fillStyle : '#000000',
                    param : {
                        x : start.x,
                        y : start.y,
                        radiusX : 1,
                        radiusY : 1
                    }
                });
            } else{
                // let extendedStart = extend(start, end, 0);
                let extendedEnd = extend(start, end, canvas.width);

                Stroke({
                    ctx,
                    start,
                    end : extendedEnd,
                    strokeWidth,
                    strokeColor
                });
            }
        }
    };

    const Start = function(){
        // create a local snapshot
        cloneCanvas = CloneCanvas(this.canvas);
        points = [];
        that = this;
        canvas = this.canvas;
        ctx = this.ctx;

        const disabledSelection = (event) => {
            event.preventDefault();
        };

        const up = () => {
            if(points.length === 2){
                isClean = true;
                points.length = 0;
                this.OperatingEnd();
                UpdateClone();
            }

            document.removeEventListener('selectstart', disabledSelection);
            document.removeEventListener(eventsName[2], up);
            document.removeEventListener(eventsName[1], HandleMove);
        };

        // gesture start
        canvas['on' + eventsName[0]] = (event) => {
            // non-touch device and non-left-click
            // prevent
            if(!isTouch && event.buttons !== 1){
                return;
            }

            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;
            let coord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            // first operating
            if(isClean){
                this.OperatingStart();
                isClean = false;
            }
            points.push(coord);

            Render();

            document.addEventListener(eventsName[1], HandleMove, { passive : false });
            document.addEventListener('selectstart', disabledSelection);
            document.addEventListener(eventsName[2], up);

        };

        // finish current polygon draw
        // and start a new one
        canvas.oncontextmenu = (event) => {
            event.preventDefault();
            CancelDraw();
            this.OperatingEnd();

            // update clone canvas
            cloneCanvas = CloneCanvas(canvas);
        };

    };

    const CancelDraw = () => {
        points.length = 0;
        Render();
    };

    const UpdateClone = () => {
        cloneCanvas = CloneCanvas(that.canvas);
    };

    const Quit = function(){
        CancelDraw();
        canvas.oncontextmenu = null;
        canvas['on' + eventsName[0]] = null;

        if(!isTouch){
            document.removeEventListener(eventsName[1], HandleMove);
        }
    };

    return {
        name : 'rline',
        Start,
        Quit,
        UpdateClone
    };
})();

export default HLine;