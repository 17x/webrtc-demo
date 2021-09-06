export default ({ canvas, event }) => {
    let _rect = canvas.getBoundingClientRect();
    let logicalWidth = canvas.width;
    let logicalHeight = canvas.height;
    let physicalX = event.x - _rect.x;
    let physicalY = event.y - _rect.y;
    let percentX = physicalX / _rect.width;
    let percentY = physicalY / _rect.height;
    let x;
    let y;

    x = logicalWidth * percentX
    y = logicalHeight * percentY

    return {
        x,
        y
    };
}