
var m_type = 'square';
var m_side_length = 4;
var m_segment_start = 0;
var m_segment_end = 0;
var m_segment_count = 0;
var m_canvas_width = $('#canvas_bg').width() - 10;
var m_points = [];
var m_rate = 1;
var m_numbers = [];
$('#selector').on('change',function (e) {
    var _type = $(this).children('option:selected').attr('name');//这就是selected的值
    console.log('onchange:' + _type)
    m_type = _type;
})
//作答
$('#start_answer_btn').on('click', function (e) {
    $(this).attr('disabled', true);

    $('#stopwatch-btn-reset').click(); //重置时间
    $('#stopwatch-btn-start').click();

    m_side_length = parseInt($('#side_length_input').val());
    m_segment_start = parseInt($('#segment_start').val());
    m_side_length = parseInt(m_side_length)
    console.log('开始作答')
    console.log(m_type, m_side_length,m_segment_start)
    if(m_type == 'square'){
        var helix = Angle4Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle4Center(helix)
        //console.log('center:', center)
        var numbers = getAngle4Numbers(helix, center)
        //console.log('numbers:',numbers)
        m_numbers = numbers;
        paintAngle4Numbers(helix, numbers, false)

    }else if(m_type == 'triangle'){
        var helix = Angle3Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle3Center(helix)
        //console.log('center:', center)
        var numbers = getAngle3Numbers(helix, center)
        m_numbers = numbers;
        //console.log('numbers:',numbers)
        paintAngle3Numbers(helix, numbers, false)

    }else if(m_type == 'sexangle'){
        var helix = Angle6Cell(m_side_length, m_canvas_width,m_segment_start)

        var center = getAngle6Center(helix)
        console.log('center:', center)
        var numbers = getAngle6Numbers(helix, center)
        m_numbers = numbers;
        //console.log(numbers)
        paintAngle6Numbers(helix, numbers, false)
    }
})

$('#submit_answer_btn').click(function () {
    $('#start_answer_btn').removeAttr('disabled')

    $('#stopwatch-btn-pause').click();
    var result_time = $('#time_result').html();
    //计算结果
    var correct_count = 0;
    var error_count = 0;
    var all_prime = 0;
    $('#canvas_bg').find('.number').each(function () {
        var selected = $(this).attr('select');
        var _value = parseInt($(this).html())
        var is_prime = isPrime(_value);
        if(is_prime){
            all_prime ++;
        }
        if(selected == 'true'){
            if(is_prime){
                correct_count++;
            }
            else{
                error_count ++;
            }

        }
       // console.log(_value);
    })

    //alert(correct_count+','+error_count+','+result_time)
    //$('#all_number').html(all_prime)
    $('#right_number').html(correct_count)
    $('#error_number').html(error_count)
    $('#answer_time').html(result_time)
    $('#answer_score').html(correct_count-error_count)
    $('#resultModal').modal('show')
})



//出题
$('#create_pictures_btn').on('click', function (e) {
    m_side_length = parseInt($('#side_length_input').val());
    m_segment_start = parseInt($('#segment_start').val());
    m_segment_end = parseInt($('#segment_end').val());
    m_segment_count = parseInt($('#segment_count').val());
    console.log(m_type, m_side_length,m_segment_start,m_segment_end, m_segment_count)
    m_side_length = parseInt(m_side_length)
    if(m_type == 'square'){
        var helix = Angle4Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle4Center(helix)
        //console.log('center:', center)
        var numbers = getAngle4Numbers(helix, center)
        //console.log('numbers:',numbers)
        m_numbers = numbers;
        paintAngle4Numbers(helix, numbers, true)

    }else if(m_type == 'triangle'){
        var helix = Angle3Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle3Center(helix)
        console.log('center:', center)
        var numbers = getAngle3Numbers(helix, center)
        m_numbers = numbers;
        //console.log('numbers:',numbers)
        paintAngle3Numbers(helix, numbers, true)

    }else if(m_type == 'sexangle'){
        var helix = Angle6Cell(m_side_length, m_canvas_width,m_segment_start)

        var center = getAngle6Center(helix)
        console.log('center:', center)
        var numbers = getAngle6Numbers(helix, center)
        m_numbers = numbers;
        //console.log(numbers)
        paintAngle6Numbers(helix, numbers, true)
    }
})
$('#to_hide_btn').on('click', function () {

    hideAngleNumbers(m_numbers)
})

$('#mark_prime_btn').on('click',function () {
    markAnglePrime(m_numbers)
})
//选手操作
if(type != 'question'){
    $('#stopwatch-btn-reset').click();
    var s_map = ['angle4.png','angle4_mark.png','angle3.png','angle3_mark.png','angle6.png','angle6_mark.png'];
    var ids = {
        'square':0,
        'triangle':2,
        'sexangle':4
    }
    $('#canvas_bg').on('click','.point',function () {
        var $bgimg = $(this).find('img.cell');
        var $number = $(this).find('.number');
        var selected = $number.attr('select')
        var id = parseInt(ids[m_type]);
        console.log(ids[m_type],selected);
        if(!selected || selected == 'false'){
            $number.attr('select','true')
            $bgimg.attr('src','../static/img/' + s_map[id+1])
            $number.css({
                'color':'#fff'
                }
            )
        }else{
            $number.attr('select','false')
            $bgimg.attr('src','../static/img/' + s_map[id])
            $number.css({
                    'color':'#000'
                }
            )
        }
    })
    $('#canvas_bg').find('.jian').on('click',function (event) {
        event.stopPropagation();    //  阻止事件冒泡
        return false
    })
}

//蒙层
var errorDialogEx = function (ele) {
    var self = this;
    self.showDialog = function(){
        ele.css({'display':'block'});
        //ele.fadeIn(300);
    }
    self.hideDialog = function() {
        ele.css({'display':'none'});
    }
    ele.on('click',function(){
        ele.css({'display':'none'});
    })
}

var exportDialog = new errorDialogEx($('#dialog_ex'));
//批量生成图片
$('#convert_data_btn').click(async function () {
    //初始化
    $('#canvas_save').empty();
    $('#download_bar').css('width',0+'%')
    $('#_a').html(0);
    $('#_b').html(0);

    $('#downloadModal').modal({backdrop: 'static', keyboard: false})
    m_side_length = $('#side_length_input').val();
    m_segment_start = parseInt($('#segment_start').val());
    m_segment_end = parseInt($('#segment_end').val());
    m_side_length = parseInt(m_side_length)
    console.log('开始批量生成图片')
    console.log(m_type, m_side_length,m_segment_start,m_segment_end)

    var all_num = (m_segment_end - m_segment_start + 1)*3;
    var img_count = 0;
    for(var ki=m_segment_start; ki<=m_segment_end; ki++)
    {

        if(m_type == 'square'){
            var helix = Angle4Cell(m_side_length, m_canvas_width,ki)
            var center = getAngle4Center(helix)
            //console.log('center:', center)
            var numbers = getAngle4Numbers(helix, center)
            //console.log('numbers:',numbers)
            m_numbers = numbers;
            paintAngle4Numbers(helix, numbers, false)

        }else if(m_type == 'triangle'){
            var helix = Angle3Cell(m_side_length, m_canvas_width,ki)
            var center = getAngle3Center(helix)
            //console.log('center:', center)
            var numbers = getAngle3Numbers(helix, center)
            m_numbers = numbers;
            //console.log('numbers:',numbers)
            paintAngle3Numbers(helix, numbers, false)

        }else if(m_type == 'sexangle'){
            var helix = Angle6Cell(m_side_length, m_canvas_width,ki)

            var center = getAngle6Center(helix)
            console.log('center:', center)
            var numbers = getAngle6Numbers(helix, center)
            m_numbers = numbers;
            //console.log(numbers)
            paintAngle6Numbers(helix, numbers, false)
        }

        /*
        html2canvas(document.getElementById("canvas_bg")).then(function(canvas){
            var dataURL = canvas.toDataURL('image/png')
            dataArr.push(dataURL)
            downloadImage(dataURL, 'hahaha.png')
        })
        */
        var filename = m_type + '_' + ki + '_' + (ki + m_numbers.length -1) + '_hide';
        $('#canvas_title').html('格子总数：' + m_numbers.length)
        await getDataUrl(filename);
        img_count ++;
        var _process = parseInt(img_count*100 /all_num)
        $('#download_bar').css('width',_process+'%')
        $('#_a').html(img_count);
        $('#_b').html(all_num);

        markAnglePrimeNotBumber(m_numbers)
        filename = m_type + '_' + ki + '_' + (ki + m_numbers.length-1) + '_mark_no_number';
        $('#canvas_title').html('格子总数：' + m_numbers.length)
        await getDataUrl(filename);
        img_count ++;
        var _process = parseInt(img_count*100 /all_num)
        $('#download_bar').css('width',_process+'%')
        $('#_a').html(img_count);
        $('#_b').html(all_num);

        //标记素数
        markAnglePrime(m_numbers)
        filename = m_type + '_' + ki + '_' + (ki + m_numbers.length-1) + '_mark';
        $('#canvas_title').html('格子总数：' + m_numbers.length)
        await getDataUrl(filename);
        img_count ++;
        var _process = parseInt(img_count*100 /all_num)
        $('#download_bar').css('width',_process+'%')
        $('#_a').html(img_count);
        $('#_b').html(all_num);
    }

})

async function getDataUrl(filename){
    return new Promise(function(resolve, reject){
        html2canvas(document.getElementById("canvas_box")).then(function(canvas){
            var dataURL = canvas.toDataURL('image/png')
            //dataArr.push(dataURL)
            downloadImage(dataURL, filename + '.png')
            resolve(null)
        })
    });

}
function downloadImage(url, name) {
    const aLink = document.createElement('a')
    aLink.setAttribute('id','imagexx');
    document.getElementById('canvas_save').appendChild(aLink);
    aLink.download = name
    aLink.href = url
    aLink.dispatchEvent(new MouseEvent('click', {}))
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
});
}



//禁止用F5键
document.onkeydown = function()
{
    if ( event.keyCode==116)
    {
        event.keyCode = 0;
        event.cancelBubble = true;
        return false;
    }
}
