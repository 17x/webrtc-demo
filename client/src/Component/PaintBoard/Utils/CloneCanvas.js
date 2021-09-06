export default (origin) => {
    let target = document.createElement('canvas');
    let cvs = target.getContext('2d');

    target.width = origin.width;
    target.height = origin.height;

    cvs.drawImage(origin, 0, 0);

    return target;
};