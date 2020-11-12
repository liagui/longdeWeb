'use strict';

let watermark = {};

let setWatermark = (str) => {
    let id = '1.23452384164.123412415';

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }

    let can = document.createElement('canvas');
    can.width = 320;
    can.height = 160;

    let cans = can.getContext('2d');
    cans.rotate(-10 * Math.PI / 180);
    cans.font = '16px Vedana';
    cans.fillStyle = 'rgba(208,208,208,0.3)';
    cans.textAlign = 'left';
    cans.textBaseline = 'Middle';
    cans.fillText(str, can.width / 10, can.height * 1);

    let div = document.createElement('div');
    div.id = id;
    div.style.pointerEvents = 'none';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.right = '0px';
    div.style.bottom = '0px';
    div.style.position = 'fixed';
    div.style.margin = 'auto';
    div.style.zIndex = '100000';
    div.style.width = document.documentElement.clientWidth + 'px';
    div.style.height = document.documentElement.clientHeight + 'px';
    // div.style.background = 'url(' + can.toDataURL('image/png') + ') top left repeat ';
    document.body.appendChild(div);
    // console.log('watermark::'+div);
    return id
};

// 该方法只允许调用一次
watermark.set = (str) => {
    let id = setWatermark(str);
    setInterval(() => {
        if (document.getElementById(id) === null) {
            id = setWatermark(str)
        }
    }, 500);
    window.onresize = () => {
        setWatermark(str)
    }
};

export default watermark
