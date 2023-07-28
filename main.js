var canvas = document.getElementById("glslCanvas");
var sandbox = new GlslCanvas(canvas);
canvas.style.width = '100%';
canvas.style.height = '100%';

function parseQuery (qstr) {
    var query = {};
    var a = qstr.split('&');
    for (var i in a) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1]);
    }
    return query;
}

function load(url) {
    fetch(url)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Error getting shader. Status code: ' + response.status);
                return;
            }
            return response.text();
        })
        .then(function(content) {
            sandbox.load(content);
            document.getElementById("title").innerHTML = "Noise Shader";
            document.getElementById("author").innerHTML = "Simulated Generation";
        })
}

load('noiseShader.glsl');

