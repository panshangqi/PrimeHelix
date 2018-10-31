

function Angle3Cell(n, width, start){
    var _max = n;
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var points = [];
    var unit = rate;
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
            //console.log(_x , _y)
            points.push({
                x: _x,
                y: _y,
                i: i,
                j: j,
                src_img: 'angle3.png',
                dst_img: 'angle3_mark.png'
            })
            /*
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle3.png" style="width: '+width+'px"/>';
            html += '</div>'
            $('#canvas_bg').append(html)
            */
            index++;
        }
    }
    return {
        points: points,
        unit: unit,
        n: n,
        start
    }
}

//Angle3Paint(1, 600)
//获取中心
function getAngle3Center(helix){
    /*
    2  [1 , 0]
    3  [2 , 1]
     4  [2 , 1]
     5  [3 , 1]
     6  [4 , 2]
     7  [4 , 2]
     8  [5 , 2]
     9  [6 , 3]
     10  [6 , 3]
     11  [7 , 3]
     12  [8 , 4]
     13  [8 , 4]
      ......
      总结规律
     */

    var points = helix.points;
    var n = helix.n;
    if(points.length < 1){
        return null;
    }
    if(n == 1){
        return points[0];
    }else if(n == 2){
        return points[1];
    }
    var ii = 1;
    var jj = 0;
    var k = 2;
    var s = [0,1,1]
    for(var i=3;i<=n;i++){

        ii += s[k];
        console.log(ii)
        k++;
        k = k % 3;

        if(i%3==0){
            jj++;
        }

    }
    var agv_i = ii;
    var agv_j = jj;
    for(var p of points){
        if(agv_i == p.i && agv_j == p.j){
            return p;
        }
    }
    return null;
}

//获取螺旋坐标队列
//单位图形坐标， 单位长度px，中心点
function getAngle3Numbers(helix, center){
    /*

            /\
           /  \
          /    \
    b 1  /      \   a 0
        /        \
       /__________\
           c   2


    */
    var points = helix.points;
    var unit = helix.unit;
    var start = helix.start;
    var add = 2;
    var side = 0; //offset 循环id
    var offset = {
        0: [-1,-1],
        1: [1,0],
        2: [0,1]
    }
    var used = {}
    for(var p of points){
        used[p.i+'_'+p.j] = p;
    }
    var ii = center.i;
    var jj = center.j;
    center.value = start;
    start++;
    var queue = [];
    queue.push(center)

    ii = ii;
    jj = jj + 1;
    if(used[ii+'_'+jj]){
        used[ii+'_'+jj].value = start;
        queue.push(used[ii+'_'+jj])
        start ++;
    }

    var all_count = points.length;

    while(queue.length < all_count){

        var _offset = offset[side];
        for(var i=0;i<add;i++){
            ii = ii + _offset[0];
            jj = jj + _offset[1];
            //console.log('iijj',ii, jj)
            if(used[ii+'_'+jj]){
                //console.log('used')
                used[ii+'_'+jj].value = start;
                queue.push(used[ii+'_'+jj])
                start ++;
            }
        }

        add ++;
        side++;
        side = side % 3;
    }

    return queue;
}

//渲染数字
function paintAngle3Numbers(helix, numbers){
    var unit = helix.unit;
    var idx = 0;
    var width = 1 * unit;
    var height = width * 2 * sqrt3 / 3;
    var fontSize = parseInt(unit / 2.5);
    fontSize = fontSize < 12 ? 12 : fontSize;

    for(var num of numbers){
        idx ++;
        var fx = num.x;
        var fy = num.y;

        //console.log(_x , _y)
        var html = '<div class="point" id="point_'+ num.value +'" style="left: '+fx+'px; top: '+fy+'px">';
        var width = unit*(1+0.02);
        html += '<img src="../static/img/angle3.png" style="width: '+width+'px"/>';
        html += '<div class="number" style="left: '+0+'px; top: '+0+'px">'+num.value+'</div>';
        html += '</div>'
        $('#canvas_bg').append(html)
    }
    $('#canvas_bg').find('.number').css({
        width: width + 'px',
        height: height + 'px',
        'text-align': 'center',
        'line-height': height + 'px',
        'font-size': fontSize + 'px'
    })
}