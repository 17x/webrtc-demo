import { isTouch, eventsName } from '../Utils/Base';
import CoordTransform from '../Utils/CoordTransform';
import Stroke from '../Utils/Stroke';
import CloneCanvas from '../Utils/CloneCanvas';

const Polygon = (() => {
    let canvas = null;
    let ctx = null;
    let points = [];
    let that = null;
    let cloneCanvas = null;
    let isClean = true

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
    };

    const Render = () => {
        let { strokeWidth, strokeColor } = that.strokeConfig;
        let { width, height } = that.canvas;

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(cloneCanvas, 0, 0);

        for(let i = 0; i < points.length; i++){
            let lastP = null;
            let currP = points[i];

            if(points.length === 0){
                lastP = currP;
            } else{
                if(i === 0){
                    lastP = points[points.length - 1];
                } else{
                    lastP = points[i - 1];
                }
            }

            Stroke({
                ctx,
                start : lastP,
                end : currP,
                strokeWidth,
                strokeColor
            });
        }
    };

    const Start = function(){
        // create a local snapshot
        cloneCanvas = CloneCanvas(this.canvas);
        points = []
        that = this;
        canvas = this.canvas;
        ctx = this.ctx;

        const disabledSelection = (event) => {
            event.preventDefault();
        };

        const up = () => {
            if(points.length === 0){
                return;
            }

            if(!isTouch){
                // console.log(points);
                let { x, y } = points[points.length - 1];
                // console.log(points);
                // and set new end
                points.push(
                    {
                        x,
                        y
                    }
                );
            }

            if(points.length > 3){
               this.OperatingEnd();
            }

            Render();

            document.removeEventListener('selectstart', disabledSelection);
            document.removeEventListener(eventsName[2], up);
        };

        // gesture start
        canvas['on' + eventsName[0]] = (event) => {
            // non-touch device and left click
            // prevent
            if(!isTouch && event.buttons !== 1){
                return;
            }

            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;

            let currCoord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            if(isTouch){
                points.push(
                    {
                        ...currCoord
                    }
                );
            } else{
                if(points.length === 0){
                    // start and end
                    points.push(
                        {
                            ...currCoord
                        }
                    );
                }
            }
            // first operating in polygon mode
            if(isClean){
                this.OperatingStart();
                isClean = false
            }
            document.addEventListener('selectstart', disabledSelection);
            document.addEventListener(eventsName[2], up);
        };

        // finish current polygon draw
        // and start a new one
        canvas.oncontextmenu = (event) => {
            event.preventDefault();
            FinishDraw();
            this.OperatingEnd();


            // update clone canvas
            cloneCanvas = CloneCanvas(canvas);
        };

        if(!isTouch){
            document.addEventListener(eventsName[1], HandleMove);
        }
    };

    const FinishDraw = () => {
        if(isTouch){
            if(points.length < 3){
                points.length = 0;
            }
        }else{
            if(points.length > 0){
                points.length -= 1;
            }

            if(points.length < 3){
                points.length = 0;
            }
        }

        Render();
        points.length = 0;
    };

    const UpdateClone = () => {
        cloneCanvas = CloneCanvas(that.canvas);
    }

    const Quit = function(){
        FinishDraw();
        canvas.oncontextmenu = null;
        canvas['on' + eventsName[0]] = null;


        if(!isTouch){
            document.removeEventListener(eventsName[1], HandleMove);
        }
    };

    return {
        name : 'polygon',
        Start,
        Quit,
        UpdateClone
    };
})();

export default Polygon;