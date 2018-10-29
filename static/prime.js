var sqrt3 = Math.sqrt(3)

//正六边形
// 边长（元素个数）， 画布宽度
function Angle6Paint(n, width){

    var _max = n*2 - 1;  //直径
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var index = 0;
    $('#canvas_bg').html('')
    for(var i=0;i<_max;i++){
        var left = 0;
        var end = 0;
        if(i < n ){
            left = s_left - 0.5*i;
            end = n + i;
        }else{
            left = (i - n + 1)*0.5;
            end = _max + n - i - 1;
        }
        for(var j=0;j<end;j++){
            var x = left + j;
            var y = sqrt3 * i / 2;
            var _x = x * rate;
            var _y = y * rate;
            console.log(_x , _y)
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle6.png" style="width: '+width+'px"/>';
            html += '</div>'
            $('#canvas_bg').append(html)
            index++;
        }
    }
}

//Angle6Paint(2, 600)

function Angle3Paint(n, width){
    var _max = n;
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var index = 0;
    $('#canvas_bg').html('')
    for(var i=0;i<_max;i++){
        var left = s_left - 0.5*i;
        var end = i + 1;

        for(var j=0;j<end;j++){
            var x = left + j;
            var y = sqrt3 * i / 2;
            var _x = x * rate;
            var _y = y * rate;
            console.log(_x , _y)
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle3.png" style="width: '+width+'px"/>';
            html += '</div>'
            $('#canvas_bg').append(html)
            index++;
        }
    }
}

//Angle3Paint(1, 600)

function Angle4Paint(n, width){
    var _max = n;
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var index = 0;
    $('#canvas_bg').html('')
    for(var i=0;i<_max;i++){
        for(var j=0;j<_max;j++){
            var x = j;
            var y = i;
            var _x = x * rate;
            var _y = y * rate;
            console.log(_x , _y)
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle4.png" style="width: '+width+'px"/>';
            html += '</div>'
            $('#canvas_bg').append(html)
            index++;
        }
    }
}

Angle4Paint(5, 600)