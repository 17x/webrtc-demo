const fillEllipse = (ctx, { x, y, radiusX, radiusY, rotation = Math.PI * 2, startAngle = 0, endAngle = Math.PI * 2, counterclockwise = 1 }) => {
    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise);
};

export default ({ type, ctx, fillStyle, param }) => {
    ctx.save()
    ctx.beginPath();
    if(fillStyle === 'transparent'){
        ctx.fillStyle = '#fff';
        ctx.globalCompositeOperation = 'destination-out';
    }else{
        ctx.fillStyle = fillStyle;
    }
    if(type === 'circle'){
        fillEllipse(ctx, param);
    } else if(type === 'rect'){
        let { x, y, w, h } = param;
        ctx.fillRect(x, y, w, h);
    }

    ctx.fill();
    ctx.restore()
}