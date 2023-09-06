// https://github.com/Durden-T/BUPTtakeCourse

var courses = [
    '自由空间光通信中的自适应光学',
    //'体育专项(下)[男]',
    //'3D打印创新实践（双创）',
];
//抢课时间间隔，单位为ms，抢课50ms, 捡漏300ms
var interval = 1000;
//禁止改动
var targets = [];

var running;

function getCourses() {
    let params = {
        sEcho: 1,
        iColumns: 13,
        iDisplayStart: 0,
        iDisplayLength: 200,
    };
    let paths = [
        //'/jsxsd/xsxkkc/xsxkBxxk?skxq_xx0103=&kcxx=&skls=&skxq=&skjc=&sfym=false&sfct=false&sfxx=false&glyx=false', //必修选课
        //'/jsxsd/xsxkkc/xsxkXxxk?skxq_xx0103=&kcxx=&skls=&skxq=&skjc=&sfym=false&sfct=false&sfxx=false&glyx=false', //选修选课
        '/jsxsd/xsxkkc/xsxkGgxxkxk?kcxx=&skls=&skxq=&skjc=&sfym=false&sfct=false&szjylb=&sfxx=true', //公选
        //kcxx:课程信息  skls:上课老师  skxq:上课星期  skjc:上课节次  sfym:是否已满  sfct:是否冲突  sfxx:是否限选  szjylb:公选课类别

    ];
    for (let path of paths)
        $.post(path, params, processData);
}

function processData(resp) {
    let data = $.parseJSON(resp).aaData;
    for (let course of data){
        if (courses.indexOf(course.kcmc) != -1){
            targets.push([course.kch, course.jx0404id]);
        }
    }
}

function takeCourses(targets) {
    if (!targets.length)
        getCourses();
    for (var target of targets){
        var kcid = target[0]
        var jx0404id = target[1]
        $.ajax({
            url: "/jsxsd/xsxkkc/ggxxkxkOper"+"?kcid="+kcid+"&cfbs=null",
            data: {
                kcid: kcid,
                jx0404id: jx0404id
            }
        });
    }
    console.log('running......');
}

function start() {
    running = window.setInterval(takeCourses, interval, targets);
    console.log('start');
}

function stop() {
    window.clearInterval(running);
    console.log('stop');
}

start();