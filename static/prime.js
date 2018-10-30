var sqrt3 = Math.sqrt(3)
var m_type = 'sexangle';
var m_side_length = 2;
var m_segment_start = 0;
var m_segment_end = 0;
var m_segment_count = 0;
var m_canvas_width = $('#canvas_bg').width();
var m_points = [];
var m_rate = 1;
$('#selector').on('change',function (e) {
    var _type = $(this).children('option:selected').attr('name');//这就是selected的值
    console.log('onchange:' + _type)
    m_type = _type;
})

$('#create_pictures_btn').on('click', function (e) {
    m_side_length = $('#side_length_input').val();
    m_segment_start = $('#segment_start').val();
    m_segment_end = $('#segment_end').val();
    m_segment_count = $('#segment_count').val();
    console.log(m_type, m_side_length,m_segment_start,m_segment_end, m_segment_count)
    m_side_length = parseInt(m_side_length)
    if(m_type == 'square'){
        Angle4Paint(m_side_length, m_canvas_width)
    }else if(m_type == 'triangle'){
        Angle3Paint(m_side_length, m_canvas_width)
    }else if(m_type == 'sexangle'){
        Angle6Paint(m_side_length, m_canvas_width)
        var center = getAngle6Center()
        //console.log(center)
        var numbers = getAngle6Numbers(center)
        console.log('numbers:')
        console.log(numbers)
        paintAngle6Numbers(numbers)
    }
})
function paintAngle6Numbers(numbers){
    var idx = 0;
    var width = 1 * m_rate;
    var height = width * 2 * sqrt3 / 3;
    var fontSize = parseInt(m_rate / 2.5);
    fontSize = fontSize < 12 ? 12 : fontSize;

    for(var num of numbers){
        idx ++;
        var fx = num.x;
        var fy = num.y;
        var html = '<div class="number" style="left: '+fx+'px; top: '+fy+'px">'+idx+'</div>';
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

function getAngle6Numbers(center){
/*
       c  2
  d 3/----\  b  1
   /      \
   \      / a  0
 e 4\____/
       f  5
*/
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
    for(var p of m_points){
        used[p.i+'_'+p.j] = p;
    }
    var ii = center.i;
    var jj = center.j;
    console.log(ii, jj)
    var queue = [];
    queue.push(center)
    var side = 0;
    var all_count = m_points.length;
    var count = 0;
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
                queue.push(used[ii+'_'+jj])
            }
        }else{
            var bian = isMap[side];
            var _offset = offset[side];
            for(var i=0;i<bian;i++){
                ii = ii + _offset[0];
                jj = jj + _offset[1];
                //console.log('iijj',ii, jj)
                if(used[ii+'_'+jj]){
                    console.log('used')
                    queue.push(used[ii+'_'+jj])
                }
            }
        }

        side ++;
        count ++;
        if(count > 100){
            break;
        }
    }

    return queue;

}
function getAngle6Center(){
    if(m_points.length < 1){
        return;
    }
    var avg_x = 0;
    var avg_y = 0;
    for(var point of m_points){
        avg_x += point.x;
        avg_y += point.y;
    }
    avg_x = avg_x / m_points.length;
    avg_y = avg_y / m_points.length;
    var avg = {
        x: avg_x,
        y: avg_y
    }
    var min = m_canvas_width * m_canvas_width * 2;
    var temp = m_points[0];
    for(var point of m_points){
        var len = pointDis(avg, point);
        if(len < min){
            min = len;
            temp = point;
        }
    }
    return temp;
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
//正六边形
// 边长（元素个数）， 画布宽度
function Angle6Paint(n, width){
    m_points = [];
    var _max = n*2 - 1;  //直径
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    m_rate = rate;
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
            m_points.push({
                x: _x,
                y: _y,
                i: i,
                j: j
            })
            var html = '<div class="point" style="left: '+_x+'px; top: '+_y+'px">';
            var width = rate*(1+0.02);
            html += '<img src="../static/img/angle6.png" style="width: '+width+'px"/>';
            var offset_x = 1 * rate / 2;
            var offset_y = offset_x * 2 * sqrt3 / 3;
            html += '<div class="center" style="left: '+offset_x+'px; top: '+offset_y+'px"/>';
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
    m_rate = rate;
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
    m_rate = rate;
    var index = 0;
    $('#canvas_bg').html('')
    for(var i=0;i<_max;i++){
        for(var j=0;j<_max;j++){
            var x = j;
            var y = i;
            var _x = x * rate;
            var _y = y * rate;
            //console.log(_x , _y)
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