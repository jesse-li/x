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

2016-07-29 根据pm的需求新增自动滑动方法 修改点击和滑动操作的判定