//сообщение о некорректности
function showWarning(message) {
    let warning = document.getElementById('warning');
    const shapeElement = document.getElementById('shape');

    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'warning';
        warning.style.position = 'absolute';
        warning.style.backgroundColor = 'rgba(244,67,54,0.8)';
        warning.style.color = 'white';
        warning.style.padding = '10px';
        warning.style.borderRadius = '5px';
        warning.style.fontSize = '14px';
        warning.style.zIndex = '10';
        warning.style.textAlign = 'center';
        warning.style.width = '300px';
        document.body.appendChild(warning);
    }

    warning.textContent = message;

    const shapeRect = shapeElement.getBoundingClientRect();
    const warningWidth = warning.offsetWidth;
    warning.style.left = `${shapeRect.left + (shapeRect.width / 2) - (warningWidth / 2)}px`;
    warning.style.top = `${shapeRect.top - warning.offsetHeight - 40}px`;
    setTimeout(() => {
        warning.remove();
    }, 5000);
}

function validateRgbValues(r, g, b) {
    let warningMessage = '';

    if (r < 0 || r > 255) {
        warningMessage += `R (Red) было скорректировано до диапазона 0-255. `;
        r = Math.min(Math.max(r, 0), 255);
    }
    if (g < 0 || g > 255) {
        warningMessage += `G (Green) было скорректировано до диапазона 0-255. `;
        g = Math.min(Math.max(g, 0), 255);
    }
    if (b < 0 || b > 255) {
        warningMessage += `B (Blue) было скорректировано до диапазона 0-255. `;
        b = Math.min(Math.max(b, 0), 255);
    }

    if (warningMessage !== '') {
        showWarning(warningMessage.trim());
    }

    return { r, g, b };
}

function validateCmykValues(c, m, y, k) {
    let warningMessage = '';

    if (c < 0 || c > 100) {
        warningMessage += `C (Cyan) было скорректировано до диапазона 0-100. `;
        c = Math.min(Math.max(c, 0), 100);
    }
    if (m < 0 || m > 100) {
        warningMessage += `M (Magenta) было скорректировано до диапазона 0-100. `;
        m = Math.min(Math.max(m, 0), 100);
    }
    if (y < 0 || y > 100) {
        warningMessage += `Y (Yellow) было скорректировано до диапазона 0-100. `;
        y = Math.min(Math.max(y, 0), 100);
    }
    if (k < 0 || k > 100) {
        warningMessage += `K (Black) было скорректировано до диапазона 0-100. `;
        k = Math.min(Math.max(k, 0), 100);
    }

    if (warningMessage !== '') {
        showWarning(warningMessage.trim());
    }

    return { c, m, y, k };
}

function validateHsvValues(h, s, v) {
    let warningMessage = '';

    if (h < 0 || h > 360) {
        warningMessage += `H (Hue) было скорректировано до диапазона 0-360. `;
        h = Math.min(Math.max(h, 0), 360);
    }
    if (s < 0 || s > 100) {
        warningMessage += `S (Saturation) было скорректировано до диапазона 0-100. `;
        s = Math.min(Math.max(s, 0), 100);
    }
    if (v < 0 || v > 100) {
        warningMessage += `V (Value) было скорректировано до диапазона 0-100. `;
        v = Math.min(Math.max(v, 0), 100);
    }

    if (warningMessage !== '') {
        showWarning(warningMessage.trim());
    }

    return { h, s, v };
}

//смук в ргб
function cmykToRgb(c, m, y, k) {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

//ргб в смук
function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);

    const k = Math.min(c, m, y);

    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    return {
        c: Math.round(((c - k) / (1 - k)) * 100),
        m: Math.round(((m - k) / (1 - k)) * 100),
        y: Math.round(((y - k) / (1 - k)) * 100),
        k: Math.round(k * 100) // Convert to percentage
    };
}

//ргб в хсв
function rgbToHsv(r, g, b) {
    r = parseFloat(r);
    g = parseFloat(g);
    b = parseFloat(b);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return { h: NaN, s: NaN, v: NaN };
    }

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : (d / max);

    if (d === 0) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        v: Math.round((v / 255) * 100)
    };
}


//хсв в ргб
function hsvToRgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h / 60);
    let f = h / 60 - i;
    let p = v * (1 - s / 100);
    let q = v * (1 - f * s / 100);
    let t = v * (1 - (1 - f) * s / 100);
    v = v * 255 / 100;
    p = p * 255 / 100;
    q = q * 255 / 100;
    t = t * 255 / 100;

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function updateAllFieldsFromRGB(r, g, b) {
    let warningMessage = '';

        if (r < 0 || r > 255) {
            warningMessage += `R (Red) было скорректировано до диапазона 0-255. `;
            r = Math.min(Math.max(parseInt(r), 0), 255);
        }
        if (g < 0 || g > 255) {
            warningMessage += `G (Green) было скорректировано до диапазона 0-255. `;
            g = Math.min(Math.max(parseInt(g), 0), 255);
        }
        if (b < 0 || b > 255) {
            warningMessage += `B (Blue) было скорректировано до диапазона 0-255. `;
            b = Math.min(Math.max(parseInt(b), 0), 255);
        }

        if (warningMessage !== '') {
            showWarning(warningMessage.trim());
        }

        const validatedRgb = validateRgbValues(r, g, b);
        r = validatedRgb.r;
        g = validatedRgb.g;
        b = validatedRgb.b;

        document.getElementById('rgb-r').value = r;
        document.getElementById('rgb-g').value = g;
        document.getElementById('rgb-b').value = b;

        document.getElementById('rgb-r-slider').value = r;
        document.getElementById('rgb-g-slider').value = g;
        document.getElementById('rgb-b-slider').value = b;

        const cmyk = rgbToCmyk(r, g, b);
        document.getElementById('cmyk-c').value = cmyk.c;
        document.getElementById('cmyk-m').value = cmyk.m;
        document.getElementById('cmyk-y').value = cmyk.y;
        document.getElementById('cmyk-k').value = cmyk.k;
        document.getElementById('cmyk-c-slider').value = cmyk.c;
        document.getElementById('cmyk-m-slider').value = cmyk.m;
        document.getElementById('cmyk-y-slider').value = cmyk.y;
        document.getElementById('cmyk-k-slider').value = cmyk.k;

        const hsv = rgbToHsv(r, g, b);
        document.getElementById('hsv-h').value = hsv.h;
        document.getElementById('hsv-s').value = hsv.s;
        document.getElementById('hsv-v').value = hsv.v;
        document.getElementById('hsv-h-slider').value = hsv.h;
        document.getElementById('hsv-s-slider').value = hsv.s;
        document.getElementById('hsv-v-slider').value = hsv.v;

        document.getElementById('shape').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        document.getElementById('colorPicker').value = rgbToHex(r, g, b);
    }

    // кнопка для смук
    document.getElementById('apply-cmyk').addEventListener('click', function() {
        let c = document.getElementById('cmyk-c').value;
        let m = document.getElementById('cmyk-m').value;
        let y = document.getElementById('cmyk-y').value;
        let k = document.getElementById('cmyk-k').value;

        const validatedCmyk = validateCmykValues(c, m, y, k);

        const rgb = cmykToRgb(validatedCmyk.c, validatedCmyk.m, validatedCmyk.y, validatedCmyk.k);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    // кнопка для хсв
    document.getElementById('apply-hsv').addEventListener('click', function() {
        let h = document.getElementById('hsv-h').value;
        let s = document.getElementById('hsv-s').value;
        let v = document.getElementById('hsv-v').value;

        const validatedHsv = validateHsvValues(h, s, v);

        const rgb = hsvToRgb(validatedHsv.h, validatedHsv.s, validatedHsv.v);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    // кнопка для ргб
    document.getElementById('apply-rgb').addEventListener('click', function() {
        let r = document.getElementById('rgb-r').value;
        let g = document.getElementById('rgb-g').value;
        let b = document.getElementById('rgb-b').value;

        const validatedRgb = validateRgbValues(r, g, b);
        updateAllFieldsFromRGB(validatedRgb.r, validatedRgb.g, validatedRgb.b);
    });

    //слайдеры смук
    document.getElementById('cmyk-c-slider').addEventListener('input', function() {
    let c = this.value;
    let m = document.getElementById('cmyk-m-slider').value;
    let y = document.getElementById('cmyk-y-slider').value;
    let k = document.getElementById('cmyk-k-slider').value;
    const rgb = cmykToRgb(c, m, y, k);
    updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    document.getElementById('cmyk-m-slider').addEventListener('input', function() {
        let c = document.getElementById('cmyk-c-slider').value;
        let m = this.value;
        let y = document.getElementById('cmyk-y-slider').value;
        let k = document.getElementById('cmyk-k-slider').value;
        const rgb = cmykToRgb(c, m, y, k);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });


    document.getElementById('cmyk-y-slider').addEventListener('input', function() {
        let c = document.getElementById('cmyk-c-slider').value;
        let m = document.getElementById('cmyk-m-slider').value;
        let y = this.value;
        let k = document.getElementById('cmyk-k-slider').value;
        const rgb = cmykToRgb(c, m, y, k);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    document.getElementById('cmyk-k-slider').addEventListener('input', function() {
        let c = document.getElementById('cmyk-c-slider').value;
        let m = document.getElementById('cmyk-m-slider').value;
        let y = document.getElementById('cmyk-y-slider').value;
        let k = this.value;
        const rgb = cmykToRgb(c, m, y, k);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });


    //слайдеры хсв
        document.getElementById('hsv-h-slider').addEventListener('input', function() {
        let h = this.value;
        let s = document.getElementById('hsv-s-slider').value;
        let v = document.getElementById('hsv-v-slider').value;
        const rgb = hsvToRgb(h, s, v);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    document.getElementById('hsv-s-slider').addEventListener('input', function() {
        let h = document.getElementById('hsv-h-slider').value;
        let s = this.value;
        let v = document.getElementById('hsv-v-slider').value;
        const rgb = hsvToRgb(h, s, v);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });

    document.getElementById('hsv-v-slider').addEventListener('input', function() {
        let h = document.getElementById('hsv-h-slider').value;
        let s = document.getElementById('hsv-s-slider').value;
        let v = this.value;
        const rgb = hsvToRgb(h, s, v);
        updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
    });


    //слайдеры ргб
        document.getElementById('rgb-r-slider').addEventListener('input', function() {
        let r = this.value;
        let g = document.getElementById('rgb-g-slider').value;
        let b = document.getElementById('rgb-b-slider').value;
        updateAllFieldsFromRGB(r, g, b);
    });

    document.getElementById('rgb-g-slider').addEventListener('input', function() {
        let r = document.getElementById('rgb-r-slider').value;
        let g = this.value;
        let b = document.getElementById('rgb-b-slider').value;
        updateAllFieldsFromRGB(r, g, b);
    });

    document.getElementById('rgb-b-slider').addEventListener('input', function() {
        let r = document.getElementById('rgb-r-slider').value;
        let g = document.getElementById('rgb-g-slider').value;
        let b = this.value;
        updateAllFieldsFromRGB(r, g, b);
    });

    //изменение палетки
    document.getElementById('colorPicker').addEventListener('input', function() {
        const colorHex = this.value;
        const rgbColor = hexToRgb(colorHex);

        updateAllFieldsFromRGB(rgbColor.r, rgbColor.g, rgbColor.b);
    });

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }
    function rgbToHex(r, g, b) {
        return "#" +
               ("0" + parseInt(r).toString(16)).slice(-2).toUpperCase() +
               ("0" + parseInt(g).toString(16)).slice(-2).toUpperCase() +
               ("0" + parseInt(b).toString(16)).slice(-2).toUpperCase();
    }


    // enter
    document.querySelectorAll('#rgb-r, #rgb-g, #rgb-b').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // Trigger RGB apply action
                let r = document.getElementById('rgb-r').value;
                let g = document.getElementById('rgb-g').value;
                let b = document.getElementById('rgb-b').value;

                const validatedRgb = validateRgbValues(r, g, b);
                updateAllFieldsFromRGB(validatedRgb.r, validatedRgb.g, validatedRgb.b);
            }
        });
    });

    document.querySelectorAll('#cmyk-c, #cmyk-m, #cmyk-y, #cmyk-k').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // Trigger CMYK apply action
                let c = document.getElementById('cmyk-c').value;
                let m = document.getElementById('cmyk-m').value;
                let y = document.getElementById('cmyk-y').value;
                let k = document.getElementById('cmyk-k').value;

                const validatedCmyk = validateCmykValues(c, m, y, k);

                const rgb = cmykToRgb(validatedCmyk.c, validatedCmyk.m, validatedCmyk.y, validatedCmyk.k);
                updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
            }
        });
    });

    document.querySelectorAll('#hsv-h, #hsv-s, #hsv-v').forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                // Trigger HSV apply action
                let h = document.getElementById('hsv-h').value;
                let s = document.getElementById('hsv-s').value;
                let v = document.getElementById('hsv-v').value;

                const validatedHsv = validateHsvValues(h, s, v);

                const rgb = hsvToRgb(validatedHsv.h, validatedHsv.s, validatedHsv.v);
                updateAllFieldsFromRGB(rgb.r, rgb.g, rgb.b);
            }
        });
    });
