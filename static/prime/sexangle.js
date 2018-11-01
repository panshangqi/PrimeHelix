//正六边形
// 边长（元素个数）， 画布宽度
//绘制边长为n的正六边形框架集合
function Angle6Cell(n, width, start){
    var points = [];
    var _max = n*2 - 1;  //直径
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var unit = rate;
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
            //console.log(_x , _y)
            points.push({
                x: _x,
                y: _y,
                i: i,
                j: j,
                src_img: 'angle6.png',
                dst_img: 'angle6_mark.png'
            })
            /*
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle6.png" style="width: '+width+'px"/>';
            var offset_x = 1 * rate / 2;
            var offset_y = offset_x * 2 * sqrt3 / 3;
            html += '<div class="center" style="left: '+offset_x+'px; top: '+offset_y+'px"/>';
            html += '</div>'
            $('#canvas_bg').append(html)
            */
            index++;
        }
    }
    return {
        points: points,
        unit: unit,  //每个cell的实际像素
        n: n,  //每边的cell个数
        start
    }
}
//获取中心
function getAngle6Center(helix){
    var points = helix.points;
    if(points.length < 1){
        return null;
    }

    var agv_i = helix.n - 1;
    var agv_j = Math.floor((2 * helix.n - 1) / 2)
    for(var p of points){
        if(agv_i == p.i && agv_j == p.j){
            return p;
        }
    }
    return null;
}

//获取螺旋坐标队列
//单位图形坐标， 单位长度px，中心点
function getAngle6Numbers(helix, center){
    /*
           c  2
      d 3/----\  b  1
       /      \
       \      / a  0
     e 4\____/
           f  5
    */
    var points = helix.points;
    var unit = helix.unit;
    var start = helix.start
    var isMap = {
        0: 0,
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 2
    }
    var offset = {
        0: [-1,1],
        1: [-1,-1],
        2: [0,-1],
        3: [1,0],
        4: [1,0],
        5: [0,1]
    }
    var used = {}
    for(var p of points){
        used[p.i+'_'+p.j] = p;
    }
    var ii = center.i;
    var jj = center.j;
    console.log(ii, jj)
    var queue = [];
    center.value = start;
    start++;
    queue.push(center)
    var side = 0;
    var all_count = points.length;

    while(queue.length < all_count){
        if(side > 0 && side % 6 ==0){
            for(var i=0;i<6;i++){
                isMap[i] ++;
            }
            side = side % 6;
        }
        side = side % 6;
        if(isMap[side] == 0){
            ii = ii;
            jj = jj + 1;
            //console.log('iijj',ii, jj)
            if(used[ii+'_'+jj]){
                used[ii+'_'+jj].value = start;
                queue.push(used[ii+'_'+jj])
                start++;
            }
        }else{
            var bian = isMap[side];
            var _offset = offset[side];
            for(var i=0;i<bian;i++){
                ii = ii + _offset[0];
                jj = jj + _offset[1];
                //console.log('iijj',ii, jj)
                if(used[ii+'_'+jj]){
                    used[ii+'_'+jj].value = start;
                    queue.push(used[ii+'_'+jj])
                    start++;
                }
            }
        }

        side ++;
    }

    return queue;

}
//渲染数字
function paintAngle6Numbers(helix, numbers){
    var unit = helix.unit;

    var width = 1 * unit;
    var height = width * 2 * sqrt3 / 3;
    var fontSize = parseInt(unit / 2.5);
    fontSize = fontSize < 12 ? 12 : fontSize;

    for(var num of numbers){

        var fx = num.x;
        var fy = num.y;

        var html = '<div class="point" id="point_'+num.value+'" style="left: '+fx+'px; top: '+fy+'px">';
        var width = unit*(1+0.02);
        html += '<img src="../static/img/angle6.png" style="width: '+width+'px"/>';
        //var offset_x = 1 * rate / 2;
        //var offset_y = offset_x * 2 * sqrt3 / 3;
        //html += '<div class="center" style="left: '+offset_x+'px; top: '+offset_y+'px"/>';
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


function pointDis(p1, p2){
    return (p1.x - p2.x)*(p1.x - p2.x) + (p1.y - p2.y)*(p1.y - p2.y);
}
function getAngle(cen, first, second){
    const M_PI = 3.1415926535897;
    var ma_x = first.x - cen.x;
    var ma_y = first.y - cen.y;
    var mb_x = second.x - cen.x;
    var mb_y = second.y - cen.y;
    var v1 = (ma_x * mb_x) + (ma_y * mb_y);
    var ma_val = Math.sqrt(ma_x * ma_x + ma_y * ma_y);
    var mb_val = Math.sqrt(mb_x * mb_x + mb_y * mb_y);
    var cosM = v1 / (ma_val * mb_val);
    var angleAMB = Math.acos(cosM) * 180 / M_PI;
    return angleAMB;
}
console.log('>>>>>>>>>>>>>>>>>')
//var angles = getAngle({x:1,y:0},{x:0,y:0},{x:2,y:-2})
//console.log(angles);

