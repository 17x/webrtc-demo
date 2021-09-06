import { isTouch, eventsName } from '../Utils/Base';
import CoordTransform from '../Utils/CoordTransform';
import Stroke from '../Utils/Stroke';

const Pen = (() => {
    let canvas = null;
    let ctx = null;

    const Start = function(){
        canvas = this.canvas;
        ctx = this.ctx;
        const disabledSelection = (event) => {
            event.preventDefault();
        };
        let lastCoord = null;

        const move = (event) => {
            let { strokeWidth, strokeColor } = this.strokeConfig;
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

            Stroke({
                start : lastCoord,
                end : currCoord,
                ctx,
                strokeWidth,
                strokeColor
            });

            lastCoord = currCoord;
            event.preventDefault();
        };

        const up = () => {
            this.OperatingEnd();
            document.removeEventListener(eventsName[1], move);
            document.removeEventListener('selectstart', disabledSelection);
            document.removeEventListener(eventsName[2], up);
        };

        canvas['on' + eventsName[0]] = (event) => {
            let { strokeWidth, strokeColor } = this.strokeConfig;
            let x = isTouch ? event.touches[0].pageX : event.x;
            let y = isTouch ? event.touches[0].pageY : event.y;

            lastCoord = CoordTransform({
                canvas,
                event : {
                    x,
                    y
                }
            });

            this.OperatingStart();

            Stroke({
                start : lastCoord,
                end : lastCoord,
                ctx,
                strokeWidth,
                strokeColor
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

export default Pen;