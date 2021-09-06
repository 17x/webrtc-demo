const CalcTextAreaRect = (text, fontSize, fontFamily) => {
    let lines = text.split('\n');
    let chars = text.split('');
    let maxWidth = 0;
    let h = 0;
    let charsData = [];

    lines.map(line => {
        if(line.trim() === ''){
            line = 'N';
        }
        let r = CalcTextRect(line, fontSize, fontFamily);
        maxWidth = Math.max(maxWidth, r.width);
        h += r.height;
    });

    chars.map((char, index) => {
        let r = CalcTextRect(char, fontSize, fontFamily);
        charsData[index] = {
            char,
            width : r.width,
            height : r.height
        };
    });

    return {
        width : maxWidth + 5,
        height : h,
        charsData
    };
};

// 计算文本宽高
const CalcTextRect = (text, fontSize, fontFamily) => {
    let result;
    let oDiv = document.createElement('div');
    let w = 'auto';
    let h = 'auto';

    text = text === ' ' ? '&nbsp;' : text;
    oDiv.innerHTML = text;
    oDiv.style.whiteSpace = 'nowrap';
    oDiv.style.width = w;
    oDiv.style.height = h;
    oDiv.style.visibility = 'hidden';
    oDiv.style.display = 'inline-block';
    oDiv.style.fontSize = fontSize + 'px';
    oDiv.style.fontFamily = fontFamily;

    document.body.appendChild(oDiv);
    result = oDiv.getBoundingClientRect();
    document.body.removeChild(oDiv);

    // 宽度精度向上取整
    result.width = Math.ceil(result.width);
    result.height = Math.ceil(result.height);

    return result;
};

export {
    CalcTextAreaRect,
    CalcTextRect
};