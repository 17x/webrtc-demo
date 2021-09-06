import Pen from './Tool/Pen';
// import Text from './Tool/Text';
import RLine from './Tool/RLine';
import HLine from './Tool/HLine';
import Line from './Tool/Line';
import Eraser from './Tool/Eraser';
import Polygon from './Tool/Polygon';
import PaintBucket from './Tool/PaintBucket';

const toolMap = {
    pen : Pen,
    // text : Text,
    rline : RLine,
    hline : HLine,
    line : Line,
    eraser : Eraser,
    polygon : Polygon,
    paintBucket : PaintBucket
};

class PaintBoard{
    lastOperatingEnd = null;
    isContinuous = null;
    currentTool = null;
    strokeConfig = {
        strokeWidth : 1,
        strokeColor : '#000000'
    };

    constructor({
        canvas,
        strokeConfig = {},
        clearColor = '#ffffff',
        clearRadius = 16,
        enableHistory = false,
        historyMax = 10,
        historyInterval = 500,
        background,
        ...rest
    }){
        this.props = rest;

        // operateCallback = null,
        // enableHistory = false,
        // historyMax = 10,
        let props = this.props;

        props.logicalWidth = Math.round(props.logicalWidth);
        props.logicalHeight = Math.round(props.logicalHeight);
        canvas.width = props.logicalWidth;
        canvas.height = props.logicalHeight;
        Object.assign(this.strokeConfig, strokeConfig);

        if(background){
            let { image, color } = background;

            canvas.style.background = `${ color || '' } url(${ image.src }) 0 0 no-repeat`;
            canvas.style.backgroundSize = 'contain';
            canvas.style.backgroundSize = '100% 100%';
            // canvas.style.backgroundPosition = '100% 100%'
        }
        this.background = background;
        this.clearColor = clearColor;
        this.historyInterval = historyInterval;
        this.clearRadius = clearRadius;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        if(enableHistory){
            this.enableHistory = enableHistory;
            this.historyMax = historyMax;
            this.historyIndex = -1;
            this.historyStack = [];
        }

        this.Clear();
    }

    Tool(toolName){
        const newTool = toolMap[toolName];

        // check enabled tool
        if(this.currentTool){
            this.currentTool.Quit();

            if(this.currentTool === newTool){
                this.currentTool = null;
            } else{
                this.currentTool = newTool;
                newTool.Start.apply(this);
            }
        } else{
            this.currentTool = newTool;
            newTool.Start.apply(this);
        }
    }

    Method(methodName){
        // quit current tool status
        // but keep it
        this.currentTool && this.currentTool.Quit();

        methodName = methodName.substr(0, 1)
                               .toUpperCase() + methodName.substr(1, methodName.length);
        this[methodName]();

        if(this.currentTool && this.currentTool.name === 'polygon'){
            this.currentTool.UpdateClone();
        }

        // resume tool use
        this.currentTool && this.currentTool.Start.apply(this);
    }

    OperatingStart(){
        // console.log('OperatingStart');
        if(this.enableHistory){
            this.isClean = false;
            this.ClearRedoList();
            // two operates interval less than 1000ms
            this.isContinuous = (Date.now() - this.lastOperatingEnd) < this.historyInterval;
        }
    }

    Operating(){
        // console.log('Operating');

    }

    OperatingEnd(){
        // console.log('OperatingEnd');
        this.lastOperatingEnd = Date.now();
        if(this.enableHistory){
            this.Snapshot(this.isContinuous);
            this.lastOperatingEnd = Date.now();
        }
    }

    Clear(){
        this.CleanBoard();

        if(this.enableHistory){
            // this.isClean = true;
            this.ClearRedoList();

            let lastOne = this.historyStack[this.historyIndex];

            if(lastOne && lastOne.t === 'clear'){
                return;
            }

            this.historyIndex += 1;
            this.Snapshot();
        }
    }

    // for canvas
    CleanBoard(){
        this.ctx.save();
        if(this.clearColor === 'transparent'){
            this.ctx.fillStyle = '#ffffff';
            this.ctx.globalCompositeOperation = 'destination-out';
        } else{
            this.ctx.fillStyle = this.clearColor;
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    ClearRedoList(){
        this.historyStack.length = this.historyIndex + 1;
        // console.log(this.historyStack);
    }

    ApplyHistory(){
        let handleData = this.historyStack[this.historyIndex];

        if(handleData){
            if(handleData.t === 'init' || handleData.t === 'clear'){
                this.CleanBoard();
                this.isClean = true;
            } else{
                let imageData = new ImageData(handleData.data, this.canvas.width, this.canvas.height);
                this.ctx.putImageData(imageData, 0, 0);
            }
        }
    }

    Undo(){
        if(!this.enableHistory || this.historyStack.length === 0){
            return;
        }

        this.historyIndex -= 1;

        if(this.historyIndex < 0){
            this.historyIndex = 0;
        }

        this.ApplyHistory();
    }

    Redo(){
        if(!this.enableHistory || this.historyStack.length === 0){
            return;
        }

        this.historyIndex += 1;

        if(this.historyIndex > this.historyStack.length - 1){
            this.historyIndex = this.historyStack.length - 1;
        } else{
            this.ApplyHistory();
        }
    }

    // take a snapshot
    Snapshot(replace = false){
        let historyItem = null;
        // cleared
        // console.log('Snapshot - isClean - ', this.isClean);
        if(this.isClean){
            historyItem = {
                t : 'clear'
            };

        } else{
            historyItem = {
                time : Date.now(),
                data : this.canvas.getContext('2d')
                           .getImageData(0, 0, this.canvas.width, this.canvas.height).data
            };
        }

        // replace
        if(replace){
            this.historyStack.pop();
        }

        // handle maximum to avoids overflow
        if(this.historyStack.length >= this.historyMax){
            this.historyStack.shift();
            // console.log(this.historyStack.length);
        }

        this.historyStack.push(historyItem);
        this.historyIndex = this.historyStack.length - 1;
        // console.log(this.historyStack, this.historyIndex);
    }

    SaveData({ returnType = 'arraybuffer', compBg = false, cb }){
        let saveCanvas;
        let { logicalWidth, logicalHeight } = this.props;

        if(compBg){
            let { image } = this.background;
            let ctx;

            // debugger
            saveCanvas = document.createElement('canvas');
            saveCanvas.width = logicalWidth;
            saveCanvas.height = logicalHeight;
            ctx = saveCanvas.getContext('2d');
            // cover
            ctx.drawImage(image, 0, 0, logicalWidth, logicalHeight);
            ctx.drawImage(this.canvas, 0, 0, logicalWidth, logicalHeight);

            // document.body.appendChild(saveCanvas);
        } else{
            saveCanvas = this.canvas;
        }

        if(returnType === 'file'){
            saveCanvas.toBlob((blob) => {
                let file = new File([blob], 'user-board.png', { lastModified : new Date() });
                cb(file);
            }, 'image/png');
        } else if(returnType === 'arraybuffer'){
            let imageData = this.ctx.getImageData(0, 0, logicalWidth, logicalHeight);
            return imageData.data.buffer;
        } else if(returnType === 'base64'){
            return saveCanvas.toDataURL('image/png');
        }
    }
}

 // todo
export default PaintBoard