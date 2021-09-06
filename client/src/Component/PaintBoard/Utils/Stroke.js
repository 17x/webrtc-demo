export default ({ ctx, start, end, strokeWidth = 1, strokeColor = '#000000', antiAliasing = false }) => {
    ctx.save()
    // anti-aliasing, increase max to repeatedly render
    for(let i = 0; i < 1; i++){
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = strokeWidth;

        if(strokeColor === 'transparent'){
            ctx.strokeStyle = '#ffffff';
            ctx.globalCompositeOperation = 'destination-out';
        } else{
            ctx.strokeStyle = strokeColor;
        }

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    ctx.restore();
}