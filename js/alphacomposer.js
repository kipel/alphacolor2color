function validateHex(color) {
    return /^#?([a-f0-9]{3}$)|([a-f0-9]{6}$)/i.test(color);
}

function validateRGB(color) {
    if (/([0-9]{1,3},){2}[0-9]{1,3}$/.test(color)) {
        var channels = color.split(",");
        for (var i = 0; i < 3; i++) {
            if (parseInt(channels[i], 10) > 255) return false;
        }
        return true;
    }
    return false;
}

function alphaCompose(color, alpha, background) {
    var newR = Math.floor(alpha * color[0] + (1 - alpha) * background[0]);
    var newG = Math.floor(alpha * color[1] + (1 - alpha) * background[1]);
    var newB = Math.floor(alpha * color[2] + (1 - alpha) * background[2]);

    return [newR, newG, newB];
}

function rgbToHex(color) {
    // from http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx/
    var rgb = color[2] | (color[1] << 8) | (color[0] << 16);
    if (rgb == 0) return "#000000";
    return "#" + rgb.toString(16);
}

function hexToRgb(color) {
    var c = "";
    var l = color.length;
    var channels = Array(3);
    if (color.substring(0,1) === "#") {
        l--;
        c = color.substring(1, l);
    }
    else {
        c = color;   
    }

    if (l == 6) {
        channels[0] = c.substring(0,2);
        channels[1] = c.substring(2,4);
        channels[2] = c.substring(4,6);
    }
    else {
        channels[0] = c.charAt(0) + c.charAt(0);
        channels[1] = c.charAt(1) + c.charAt(1);
        channels[2] = c.charAt(2) + c.charAt(2);
    }

    return [hexToInt(channels[0]), hexToInt(channels[1]), hexToInt(channels[2])];
}

function hexToInt(num) {
    return parseInt(num, 16);
}

function alphaToColor() {
    var colors = $("#input-colors").val().split("\n");
    var alpha = parseFloat($("#alpha").val());
    if (alpha < 0.0 || alpha > 1.0) {
        promptError('0.0 <= Alpha <= 1.0');
        return;
    }
    var output = "";

    var bkg = [255, 255, 255];
    colors.forEach(function(color) {
        if (validateHex(color)) {
            var c = alphaCompose(hexToRgb(color), alpha, bkg);
            output += rgbToHex(c) + "\n";
        }
        else if (validateRGB(color)) {
            var c = alphaCompose(color.split(","), alpha, bkg);
            output += rgbToHex(c) + "\n";
        }
        else {
            promptError("Wrong Input Color Format");
            return;
        }
    });
    $("#output-color").val(output);
}

function promptError(e) {
    $("#error-prompt").text(e);
}