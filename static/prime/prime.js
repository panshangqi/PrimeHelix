
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

$('#create_pictures_btn').on('click', function (e) {
    m_side_length = $('#side_length_input').val();
    m_segment_start = $('#segment_start').val();
    m_segment_end = $('#segment_end').val();
    m_segment_count = $('#segment_count').val();
    console.log(m_type, m_side_length,m_segment_start,m_segment_end, m_segment_count)
    m_side_length = parseInt(m_side_length)
    if(m_type == 'square'){
        var helix = Angle4Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle4Center(helix)
        console.log('center:', center)
        var numbers = getAngle4Numbers(helix, center)
        console.log('numbers:',numbers)
        m_numbers = numbers;
        paintAngle4Numbers(helix, numbers)

    }else if(m_type == 'triangle'){
        var helix = Angle3Cell(m_side_length, m_canvas_width,m_segment_start)
        var center = getAngle3Center(helix)
        console.log('center:', center)
        var numbers = getAngle3Numbers(helix, center)
        m_numbers = numbers;
        console.log('numbers:',numbers)
        paintAngle3Numbers(helix, numbers)

    }else if(m_type == 'sexangle'){
        var helix = Angle6Cell(m_side_length, m_canvas_width,m_segment_start)

        var center = getAngle6Center(helix)
        console.log('center:', center)
        var numbers = getAngle6Numbers(helix, center)
        m_numbers = numbers;
        console.log(numbers)
        paintAngle6Numbers(helix, numbers)
    }
})
$('#to_hide_btn').on('click', function () {

    hideAngleNumbers(m_numbers)
})

$('#mark_prime_btn').on('click',function () {
    markAnglePrime(m_numbers)
})

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
//导出图片
$('#save_picture_btn').click(function(){
    var This = this;
    html2canvas(document.getElementById("canvas_bg")).then(function(canvas){
        /*
        document.getElementById('export_content').innerHTML = '';
        var dom = document.getElementById('export_content').appendChild(canvas);
        dom.setAttribute('id','image');
        exportDialog.showDialog();
        */
        //alert(0)
        exportDialog.showDialog();
        document.getElementById('dialog_content').innerHTML = "";
        var dom = document.getElementById('dialog_content').appendChild(canvas);
        dom.setAttribute('id','image');
        console.log(canvas)
        /*
        var filename = "teset_tesst.png"
        This.href=document.getElementById('dialog_content').toDataURL("image/png");
        This.download = filename;
        */
        setTimeout(function () {
            downloadCanvas(This,'image','旅行商问题图片.png');
        },450)

        //exportDialog.hideDialog();
    });
})
$('#download_btn').click(function () {
    downloadCanvas(this,'image','旅行商问题图片.png');
    exportDialog.hideDialog();
})
function downloadCanvas(link,canvasId,filename){
    link.href=document.getElementById(canvasId).toDataURL("image/png");
    link.download = filename;
}





