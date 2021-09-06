const isTouch = /Android|iPhone|iPad|iPod|SymbianOS|Windows Phone/.test(navigator.userAgent);
const eventsName = isTouch ?
    [
        'touchstart',
        'touchmove',
        'touchend'
    ] : [
        'mousedown',
        'mousemove',
        'mouseup'
    ];

export {
    isTouch,
    eventsName
};