xSwiper初始化方法：
 var swiper = new xSwiper();
相关参数说明：

obody（Jquery对象，滑动主体）

new xSwiper({
  obody:$(element)
});

ochild(Jquery对象，滑动个体)

new xSwiper({
  ochild:$(element)
});

succ(funtion类型,每次滑动结束后的回调函数)

new xSwiper({
  succ：function(index,ochild)//接受两个参数，一个是当前滚动的index，一个ochild对象
});

css3（布尔值，是否使用css动画，默认使用(如果不使用，需要position:absolute布局）

bindclick(funtion类型,ochild点击回调)

speed（number类型，滑动的速度）

autoplay (布尔值，默认false)

autospeed （number，切换速度，默认2000）

absolutely （布尔值，宽度是否占满全屏，默认值true）

chaos （number，轮播主体的高度，默认不开启，是否开启混乱模式处理，解决轮播图大小不一的情况，因为会增加计算，非特殊情况建议不开启）

2016-07-29 根据pm的需求新增自动滑动方法 修改点击和滑动操作的判定

2016-08-01 完善left运动逻辑，新增非全屏的处理方法

2016-08-10 解决safari中window resize，alter导致touch事件堵塞的问题，新增上下滑动判断，新增一种解决轮播图大小不一的模式（chaos）