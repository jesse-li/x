window.alert=function(txt){//处理safari中alter导致touch出错的问题（由于暂时还没找到解决的办法，先这样处理）
	console.log(txt)
}
var xSwiper = function(option) {
	var _this = this;//实例化xSwiper对象
	_this.obody = option.obody;//轮播主体
	_this.ochild = option.ochild;//轮播个体
	_this.succ = option.succ;//每次运动结束后的回调函数
	_this.css3 = option.css3===undefined||option.css3===true?true:false;//是否使用css动画，布尔值，默认使用(如果不使用，需要position:absolute布局)
	_this.absolutely = option.absolutely === undefined || option.absolutely === true ? true : false//轮播是否全屏，默认是	
	//_this.index = 0;//记录轮播到了第几条(应该不需要用户设置，，，，考虑私有化)
	_this.bindclick = option.bindclick;//绑定轮播个体点击事件
	_this.autoplay = option.autoplay;
	_this.autospeed = option.autospeed||2000;
	//_this.thatIndex = option.thatIndex;//传入一个Number类型，直接轮播到当前的index
	//_this.t = true;//轮播控制器，控制频繁点击的情况(应该不需要用户设置，，，，考虑私有化)
	_this.speed = option.speed||700;
	_this.chaos = option.chaos;
	_this._init();
}
xSwiper.prototype = {
	_init: function() {//_init方法调用一些主要的函数
		var _this = this;
		_this.index = 0;
		_this.t = true;
		_this.timerAuto=null;
		_this.width = 0;
		_this._widthF();
		_this._startF();
		_this._moveF();
		_this._endF();
		_this._cancel();
		_this.close = false;
		//_this._first(_this.thatIndex);//不需要用户来传，用户只要调用实例对象的_first方法就可以进行指定滚动
		_this._resizeF();
		if(_this.autoplay){
			_this._autoPlayF()
		}
		
	},
	_first: function(index) {//当点击轮播个体时，传入当前的index，进入图片浏览模式，并通过index计算该轮播到什么位置
		var _this = this;
		/*if (_this.thatIndex || _this.thatIndex === 0) {*/
			_this.index = index;
			if(_this.css3){
				_this.obody.css({
					"transform": "translate3d(" + (-_this.index * _this.width) + "px,0px,0px)"
					//"transition-duration": _this.speed+"ms"
	
				});
			}else{
				_this.obody.css({
					"left":-(_thisindex*_this.width)+"px"
				})
			}
			
			if (_this.succ && typeof(_this.succ) === "function") {
				_this.succ(_this.index, _this.ochild);
			}
			
		/*}*/
	},
	_autoPlayF:function(){
		var _this = this;
		_this.timerAuto=setTimeout(function(){
			if(_this.index >=_this.ochild.length-1){
				_this.index = 0;
			}else{
				_this.index += 1;
			}
			if(_this.css3){
				_this.obody.css({
					"transform": "translate3d(" + (-_this.index * _this.width) + "px,0px,0px)",
					"transition-duration": _this.speed+"ms"
				});
			}else{
				_this.obody.animate({"left":-_this.index * _this.width },_this.speed)
			}
			
			if (_this.succ && typeof(_this.succ) === "function") {
				_this.succ(_this.index, _this.ochild);
			}
			_this._autoPlayF();
		},_this.autospeed)
	},
	_widthF: function() {//计算并设置主体和个体宽度的方法，默认全屏
		var _this = this;
		if(_this.absolutely){
			_this.width = $(window).width();
		}else{
			_this.width = _this.obody.parent().width();
		}
		_this.obody.width(_this.ochild.length * _this.width);
		_this.ochild.width(_this.width);
		if(!_this.css3){//如果不使用css3滚动，需要设置外层的高度
			_this.obody.parent().height(_this.obody.height())
		}
		if(_this.chaos){//2016-08-10混乱模式处理 （苦逼的处理比例不一样的图片）
			var img = _this.obody.find("img");
			_this.obody.parent().height(_this.chaos);
			_this.ochild.height(_this.chaos)
			for(var i=0,j=img.length;i<j;i+=1){
				if(img[i].complete){
					var marTop = Math.abs($(img[i]).height()-_this.chaos)/2;
					if($(img[i]).height()>_this.chaos){
						$(img[i]).css("margin-top",-marTop);
					}else{
						$(img[i]).css("margin-top",marTop);
					}
				}else{
					(function(k){
						$(img[k]).on("load",function(){
							var marTop = Math.abs($(img[k]).height()-_this.chaos)/2;
							if($(img[k]).height()>_this.chaos){
								$(img[k]).css("margin-top",-marTop);
							}else{
								$(img[k]).css("margin-top",marTop);
							}
						})
					})(i)
					
				}
			}
		}
	},
	_startF: function() {//绑定主体的touchstart事件，用于计算滑动的初始X坐标
		var _this = this;
		_this.obody.on("touchstart",
			function(e) {
				_this.startX = e.originalEvent.targetTouches[0].pageX;
				_this.startY = e.originalEvent.targetTouches[0].pageY;
				_this.close = false;
			});
	},
	_moveF: function() {//绑定主体的touchmove事件，用于计算滑动的结束X坐标，又close开关控制不会调用运动方法，减少频繁调用引起的bug
		var _this = this;
		_this.obody.on("touchmove",
			function(e) {
				clearTimeout(_this.timerAuto);
				if(_this.autoplay){
					_this._autoPlayF();
				}
				_this.moveX = e.originalEvent.targetTouches[0].pageX;
				_this.moveY = e.originalEvent.targetTouches[0].pageY;
				_this.close = true;
			})

	},
	_endF: function() {//绑定主体的touchend事件，用于滑动结束后进行相关运动
		var _this = this;
		_this.obody.on("touchend", function(e) {
			_this._movefution(e)
		});

	},
	_cancel:function(){
		var _this = this;
		_this.obody.on("touchcancel", function(e) {
			e.preventDefault();
		});
	},
	_movefution: function(e) {//具体的运动方法
		var _this = this;
		
			if(Math.abs(_this.moveX-_this.startX)>50&&_this.close){//控制器，必须用户滑动结束且上一次运动结束才调用 2016-7-29修改点击和滑动的判定
				if(_this.t){
					_this.t = false;
					
					if (_this.moveX && _this.moveX > _this.startX) {//判断滑动的方向
				
						if (_this.css3) {//使用css3
							if (_this.index === 0) {//通过index来判断是否该滑动
								_this.t = true;
								return;
		
							} else {
								_this.index -= 1;
								_this.obody.css({
									"transform": "translate3d(" + (-_this.index * _this.width) + "px,0px,0px)",
									"transition-duration": _this.speed+"ms"
		
								});
								setTimeout(function() {//延迟事件，当滑动结束后调用函数，并将控制器设为true
										if (_this.succ && typeof(_this.succ) === "function") {
											_this.succ(_this.index, _this.ochild);
		
										}
										_this.t = true;
		
									},
									0);
		
		
							}
		
						} else {//使用传统的定位进行运动
							
								if(_this.index === 0){
								setTimeout(function() {
										_this.t = true;
		
									},
									0);
								return;
		
							} else {
								_this.index -= 1;
								_this.obody.animate({
										"left": "+=" + _this.width
		
									},
									_this.spped,
									function() {
										if (_this.succ && typeof(_this.succ) === "function") {
											_this.succ(_this.index, _this.ochild);
		
										}
										setTimeout(function() {
												_this.t = true;
		
											},
											0);
		
		
									});
		
		
							}
		
						}

			} else if (_this.moveX && _this.moveX < _this.startX) {
				
				if (_this.css3) {
					
						if(_this.index >= _this.ochild.length-1){
						setTimeout(function() {
								_this.t = true;

							},
							0);
						return;

					} else {
						_this.index += 1;
						_this.obody.css({
							"transform": "translate3d(" + (-_this.index * _this.width) + "px,0px,0px)",
							"transition-duration": _this.speed+"ms"

						});
						setTimeout(function() {
								if (_this.succ && typeof(_this.succ) === "function") {
									_this.succ(_this.index, _this.ochild);

								}
								_this.t = true;

							},
							0);

					}

				} else {
					
						if(_this.index >= _this.ochild.length-1){
						_this.t = true;
						return;

					} else {
						_this.index += 1;
						_this.obody.animate({
								"left": "-=" + _this.width

							},
							_this.speed,
							function() {
								if (_this.succ && typeof(_this.succ) === "function") {
									_this.succ(_this.index, _this.ochild);

								}
								setTimeout(function() {
										_this.t = true;

									},
									0);


							});


					}

				}

			}
		}
		}else {
			
			if(Math.abs(_this.moveY-_this.startY)<5||!_this.close){
				if (_this.bindclick && typeof(_this.bindclick) === "function") {//绑定主体点击事件
					_this.bindclick(_this.index);
	
				}
			}
			
		} 

	},
	_resizeF: function() {//绑定页面resize事件，触发后轮播初始化
		var _this = this,nowWidth=$(window).width();
		$(window).on("resize",
			function() {
				if(nowWidth != $(window).width()){
					nowWidth = $(window).width();
					_this._widthF();
					_this.index = 0;
					_this.ochild.width(_this._width);
					if (_this.css3) {
						_this.obody.css("transform", "translate3d(0px,0px,0px)");
					}
					_this.obody.css("left", "0");
					if (_this.succ && typeof(_this.succ) === "function") {
						_this.succ(_this.index);
	
					}
				}
				
			})


	}

}