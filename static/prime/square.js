function Angle4Cell(n, width, start){
    var _max = n;
    var s_left = (n-1)/2;
    var rate = parseInt(width/_max);
    var unit = rate;
    var index = 0;
    var points = []

    for(var i=0;i<_max;i++){
        for(var j=0;j<_max;j++){
            var x = j;
            var y = i;
            var _x = x * rate;
            var _y = y * rate;
            points.push({
                x: _x,
                y: _y,
                i: i,
                j: j,
                src_img: 'angle4.png',
                dst_img: 'angle4_mark.png'
            })

            index++;
        }
    }
    return {points, unit, n, start}
}


//Angle3Paint(1, 600)
//获取中心
function getAngle4Center(helix){
    /*
    1 [0,0]
    2  [1 , 0]
    3  [1 , 1]
     4  [2 , 1]
     5  [2 , 2]
     6  [3 , 2]
     7  [3 , 3]
     8  [4 , 3]

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
    }
    var ii = 0;
    var jj = 0;
    var ki = 1;
    var kj = 0;
    var s = [0,1]

    for(var i=2;i<=n;i++){

        ii += s[ki];
        jj += s[kj];


        ki ++;
        kj ++;

        ki = ki % 2;
        kj = kj % 2;
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
function getAngle4Numbers(helix, center){
    /*
        b  1
    ______________
    |            |
    |            |
 c 2|            |  a  0
    |            |
    |____________|

         d  3
    */
    var points = helix.points;
    var unit = helix.points;
    var start = helix.start;
    var add = 2;
    var side = 0; //offset 循环id
    var offset = {
        0: [-1,0],
        1: [0,-1],
        2: [1,0],
        3: [0,1]
    }
    var used = {}
    for(var p of points){
        used[p.i+'_'+p.j] = p;
    }
    var ii = center.i;
    var jj = center.j;

    var queue = [];
    center.value = start;
    queue.push(center)
    start ++;

    var side = 3;  //从底边开始向右旋转
    var add = 0;
    var k = 1;
    var s = [0, 1];

    var all_count = points.length;

    while(queue.length < all_count){
        add += s[k];

        var _offset = offset[side];
        for(var i=0;i<add;i++){
            ii = ii + _offset[0];
            jj = jj + _offset[1];
            //console.log('iijj',ii, jj)
            if(used[ii+'_'+jj]){
                //console.log('used')
                used[ii+'_'+jj].value = start;
                queue.push(used[ii+'_'+jj])
                start++;
            }
        }

        k++;
        k = k % 2;

        side++;
        side = side % 4;
    }

    return queue;
}

//渲染数字
function paintAngle4Numbers(helix, numbers){
    var unit = helix.unit;
    var idx = 0;
    var width = 1 * unit;
    var height = width * 2 * sqrt3 / 3;
    var fontSize = parseInt(unit / 2.5);
    fontSize = fontSize < 12 ? 12 : fontSize;
    $('#canvas_bg').empty();
    for(var num of numbers){
        idx ++;
        var fx = num.x;
        var fy = num.y;

        //console.log(_x , _y)
        var html = '<div class="point" id="point_'+ num.value +'" style="left: '+fx+'px; top: '+fy+'px">';
        var width = unit*(1+0.02);
        html += '<img src="../static/img/angle4.png" style="width: '+width+'px"/>';
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
//一键隐藏
function hideAngleNumbers(numbers){

    $('#canvas_bg').find('.number').each(function () {
        var val = parseInt($(this).html());
        if(val == numbers[0].value || val == numbers[numbers.length-1].value){
            $(this).show();
        }else{
            $(this).fadeOut(300);
        }

    })

}
//标记素数
function markAnglePrime(numbers){

    for(var num of numbers){
        var $point = $('#point_' + num.value)
        var $number = $point.find('.number');
        var $img = $point.find('img');
        console.log(num.dst_img)
        if(isPrime(num.value)){
            $img.attr('src','../static/img/' + num.dst_img)
            $number.css({
                'color': '#fff'
            })
        }

    }
}


function isPrime(num) {
    // 不是数字或者数字小于2
    if(typeof num !== "number" || !Number.isInteger(num)) {
        // Number.isInterget 判断是否为整数
        return false
    }
    //2是质数
    if(num == 2) {
        return true
    } else if(num % 2 == 0) {  //排除偶数
        return false
    }
    //依次判断是否能被奇数整除，最大循环为数值的开方
    var squareRoot = Math.sqrt(num)
    //因为2已经验证过，所以从3开始；且已经排除偶数，所以每次加2
    for(var i = 3; i <= squareRoot; i += 2) {
        if(num % i === 0) {
            return false
        }
    }
    return true
}