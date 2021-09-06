import { isTouch, eventsName } from '../Utils/Base';
import CoordTransform from '../Utils/CoordTransform';
import Fill from '../Utils/Fill';
import Stroke from '../Utils/Stroke';

const Eraser = (() => {
    let canvas = null;
    let ctx = null;

    const Start = function(){
        let lastCoord = null;

        canvas = this.canvas;
        ctx = this.ctx;
        const disabledSelection = (event) => {
            event.preventDefault();
        };

        const move = (event) => {
            let { clearRadius, clearColor } = this;
            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;

            let currCoord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            this.Operating();

            if(lastCoord){
                Stroke({
                    start : lastCoord,
                    end : currCoord,
                    ctx,
                    strokeWidth : clearRadius * 2,
                    strokeColor : clearColor
                });
            } else{
                Fill({
                    ctx,
                    type : 'circle',
                    fillStyle : clearColor,
                    param : {
                        x : currCoord.x,
                        y : currCoord.y,
                        radiusX : clearRadius,
                        radiusY : clearRadius
                    }
                });
            }

            lastCoord = currCoord;
            event.preventDefault();
        };

        const up = () => {
            lastCoord = null;
            this.OperatingEnd();
            document.removeEventListener(eventsName[1], move);
            document.removeEventListener('selectstart', disabledSelection);
            document.removeEventListener(eventsName[2], up);
        };

        canvas['on' + eventsName[0]] = (event) => {
            let { clearRadius, clearColor } = this;
            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;

            let currCoord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            this.OperatingStart();

            Fill({
                ctx,
                type : 'circle',
                fillStyle : clearColor,
                param : {
                    x : currCoord.x,
                    y : currCoord.y,
                    radiusX : clearRadius,
                    radiusY : clearRadius
                }
            });

            document.addEventListener(eventsName[1], move, { passive : false });
            document.addEventListener('selectstart', disabledSelection);
            document.addEventListener(eventsName[2], up);
        };
    };

    const Quit = function(){
        canvas['on' + eventsName[0]] = null;
    };

    return {
        Start,
        Quit
    };
})();

export default Eraser;