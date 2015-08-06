(function($){
    var x1, x2, y1, y2;
    var mouseDown = false;
    var eraseFlag = 0;//判断是否在使用橡皮

    $.fn.extend({
        paintBoard: function(){
            var othis = $(this);
            var canvas = othis.children('canvas');
            var context = canvas[0].getContext('2d');
            var aColor = generateColor(26);

            context.lineWidth = 1;
            context.lineCap = 'round';

            
            colorBoard(othis.find('.colorBoard')[0], aColor);
            DrawLine(canvas[0]);

            othis.on('click', '.erase', function() {
                erase(canvas[0]);
            });

            othis.on('click', '.pen', function() {
                DrawLine(canvas[0]);
            });

            othis.on('click', '.init', function(e) {
                context.clearRect(0, 0, canvas[0].width, canvas[0].height);
            });

            othis.on('click', '.colorBoard li', function(e) {
                context.strokeStyle = e.target.dataset.color;
            });

            othis.on('change', '.lineWidth', function(e) {
                context.lineWidth = $(e.target).val();
            });
        }
    });

    function DrawLine(canvas) {
        var context = canvas.getContext('2d');
        context.strokeStyle = "black";
        canvas.addEventListener('mousedown', function(e){
            mouseDown = true;
            x1 = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
            y1 = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
        });

        canvas.addEventListener('mouseup', function(e){
            mouseDown = false;
        });

        // 鼠标移出时也清空画笔状态
        canvas.addEventListener('mouseout', function(e){
            mouseDown = false;
        });

        canvas.addEventListener('mousemove', function(e){
            if(mouseDown && eraseFlag === 0) {
                x2 = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
                y2 = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();

                x1 = x2;
                y1 = y2;
            }
        });
    }

    function erase(canvas) {
        var context = canvas.getContext('2d');
        context.strokeStyle = "white";
        canvas.addEventListener('mousedown', function(e){
            if(eraseFlag === 1) {
                mouseDown = true;
                x1 = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
                y1 = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
                    context.clearRect(x1, y1, context.lineWidth, context.lineWidth); 
            }
        });

        canvas.addEventListener('mouseup', function(e){
            mouseDown = false;
        });

        // 鼠标移出时也清空画笔状态
        canvas.addEventListener('mouseout', function(e){
            mouseDown = false;
        });

        canvas.addEventListener('mousemove', function(e){
            if(eraseFlag === 1 && mouseDown) {
                mouseDown = true;
                x2 = e.clientX - canvas.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
                y2 = e.clientY - canvas.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.stroke();

                x1 = x2;
                y1 = y2;
            }
        });
    }

    function colorBoard(obj, arr) {
        /*
            @obj：dom元素
            @arr：颜色代码数组
        */
        var docFrag = document.createDocumentFragment();
        arr.forEach(function(value) {
            var li = document.createElement('li');
            li.dataset.color = value;
            li.style.backgroundColor = value;
            docFrag.appendChild(li);
        });
        obj.appendChild(docFrag);
    }

    function generateColor(num) {
        // @num 要生成的color数目
        var arr = [], color = '#';
        for(var i=0; i<num; i++) {
            while(color.length < 7) {
                color += '0123456789abcdef'[parseInt(Math.random()*16)];
            }
            arr.push(color);
            color = '#';
        }
        return arr;
    }

})(jQuery);


/*  @页面坐标
    UIEvent.pageX(Y) 相对于页面左上角的坐标（非规范属性）
    MouseEvent.clientX(Y)相对于视窗左上角的坐标，无视窗口是否横向滚动
    MouseEvent.offsetX(Y)
    返回距离event.target左上角padding的坐标
    MouseEvent.screenX(Y)
    返回距离屏幕左上角的坐标

    HTMLElement.offsetLeft(..)返回元素的偏移坐标
    
*/

/*  @存储
    canvas.toDataURL(type(默认png), num(0-1压缩质量)) 保存为base64编码
*/


/*  @事件绑定的一些引申只是
    fn.prototype.apply(othis, [arguments]);
    fn.prototype.call(othis, argv1, argv2...);
    作用都是调用fn并修改fn的默认this对象为othis。

    fn.prototype.bind(othis, argv1, argv2...);
    复制并返回fn函数(ps:fn函数会带有argv1,argv2等初始化参数)，this改为othis;

    Array.prototype.slice(begin, end) 根据begin和end复制一个数组 
*/