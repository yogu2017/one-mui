/**
 * 作者：dailc rayChenDay
 * 时间：2016-03-10 18:12:45
 * 描述：  html5 视频播放方案,两种实现:
		1.iOS和Android中内联播放
		2.iOS和Android中全屏播放  
	注: ios版本无法 preload视频
 */
(function() {
	//是否采用内联播放模式
	var isInlinePlay = false;
	var videoMedia = document.getElementById('videoMedia');
	//获取视频应该得宽和高
	var videoWidth = Zepto('#videoContainer').attr('offsetWidth');
	var videoHeight = Zepto('#videoContainer').attr('offsetHeight');

	//普通初始化
	init();
	//plus下的初始化
	mui.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		Zepto('#TypeSwitch').show();
	});
	/**
	 * @description 初始化 
	 */
	function init() {
		//隐藏选择控件栏
		Zepto('#TypeSwitch').hide();
		Zepto('.switchBtn').on('tap', switchPlayType);
		//给视频也点击播放,用来在内联时控制某些android的暂停
		//因为某些机型被改的控制栏自动隐藏了
		Zepto('#videoMedia').on('tap', function() {
			play();
		});
		Zepto('#playvideo').on('tap', function() {
			play();
		});
		//console.log('视频宽:' + videoWidth + ',高:' + videoHeight);
	};
	/**
	 * @description 播放
	 */
	function play() {
		//console.log('readyState:' + videoMedia.readyState);

		//内联播放时,隐藏图片,非内联直接就用原生打开了
		//ios下的非内联也可以(不是必须)隐藏图片
		//普通浏览器也要隐藏,ios plus下也要隐藏
		//android下因为非内联使用原生播放的,所以直接隐藏video
		if (isInlinePlay || !(window.plus && plus.os.name == 'Android')) {
			switchDefaultImgShow(false);
		}
		var url = videoMedia.getElementsByTagName('source')[0].src;
		playHtml5Video(url, videoMedia, function(isPlay) {
			if (isPlay) {
				//console.log('播放了');
			} else {
				//console.log('暂停了');
			}
		}, isInlinePlay);
	};
	/**
	 * @description 播放Html5视频
	 * plus下android:通过NJS,在android上用原生播放器打开视频
	 * plus下iOS:直接play视频,会自动调用原生播放器播放
	 * 非plus下: 直接play视频
	 * @param {String} url 视频的地址,可以是网络地址或者本地地址
	 * @param {HTMLElement} mediaTarget 目标video的dom对象
	 * @param {Function} callback(isPlay) 回调函数,true为正在播放,false为暂停,
	 * 只有非plus情况才能回调
	 * @param {Boolean} isInlinePlay 是否内联播放,默认为false
	 * ios 下内联播放:  	  非全屏,h5播放方式
	 * ios 下非内联播放:  全屏,h5播放方式
	 * Android 下内联播放:  	  非全屏,h5播放方式
	 * Android 下非内联播放:  全屏,NJS原生播放器播放方式
	 */
	function playHtml5Video(url, mediaTarget, callback, isInlinePlay) {
		if (!url || !mediaTarget) {
			//url 和video元素不存在
			return;
		}
		isInlinePlay = isInlinePlay || false;

		if (window.plus && plus.os.name == 'Android' && !isInlinePlay) {
			//非内联模式下的plus下的android才用到
			var Intent = plus.android.importClass("android.content.Intent");
			var Uri = plus.android.importClass("android.net.Uri");
			var main = plus.android.runtimeMainActivity();
			var intent = new Intent(Intent.ACTION_VIEW);
			var uri = Uri.parse(url);
			intent.setDataAndType(uri, "video/*");
			main.startActivity(intent);
		} else {
			if (!isInlinePlay) {
				//如果是非内敛,ios需要去除内联样式
				mediaTarget.removeAttribute('webkit-playsinline');
			} else {
				mediaTarget.setAttribute('webkit-playsinline', 'webkit-playsinline');
			}
			if (mediaTarget.paused || mediaTarget.ended) {
				//暂停时播放
				if (mediaTarget.ended) {
					mediaTarget.currentTime = 0;
				}
				mediaTarget.play();
				callback && callback(true);
			} else {
				//播放时暂停
				mediaTarget.pause();
				callback && callback(false);
			}
		}
	};
	/**
	 * @description 更换视频默认图的显示,内联模式下隐藏
	 * 否则显示
	 * @param {Boolean} isShow
	 */
	function switchDefaultImgShow(isShow) {
		if (isShow) {
			Zepto('#playvideo').show();
			Zepto('#videoMedia').css('width', '1px');
			Zepto('#videoMedia').css('height', '1px');
		} else {
			Zepto('#playvideo').hide();
			Zepto('#videoMedia').css('width', videoWidth);
			Zepto('#videoMedia').css('height', videoHeight);
		}
	};
	/**
	 * @description 更换播放类型
	 * @param {Event} e
	 */
	function switchPlayType(e) {
		Zepto(e.target).addClass('choosed').siblings().removeClass('choosed');
		if (e.target.id == 'inlinePlayBtn') {
			//内联播放
			isInlinePlay = true;
		} else {
			//非内联
			isInlinePlay = false;
			
		}
		//这个模式隐藏video,防止点击重复冲突,并暂停
		videoMedia.pause();
		switchDefaultImgShow(true);
	};
	/**
	 * @description 打印一些属性
	 */
	function logProperties() {
//		console.log('readyState:' + videoMedia.readyState);
//		console.log('currentTime :' + videoMedia.currentTime);
//		console.log('duration   :' + videoMedia.duration);
//		console.log('buffered  :' + (videoMedia.buffered.length > 0 && videoMedia.buffered.end(0)) || 0);
//		console.log('ended:' + videoMedia.ended);
//		console.log('paused:' + videoMedia.paused);
//		console.log('networkState:' + videoMedia.networkState);
//		console.log('*******************');
	};
	//resume
	document.addEventListener("resume", function() {
		console.log('Page resume事件');
	});
	//pause
	document.addEventListener("pause", function() {
		console.log('Page pause事件');
	});
	//这个监听为监听到获取元数据
	videoMedia.addEventListener('loadedmetadata', function() {
		console.log('loadedmetadata,获取到元数据');
		logProperties();
	});
	//这个监听为监听到loadstart
	videoMedia.addEventListener('loadedmetadata', function() {
		console.log('loadedmetadata');
		logProperties();
	});
	//这个监听为监听到 suspend
	videoMedia.addEventListener('suspend', function() {
		console.log('suspend');
		logProperties();
	});
	//这个监听为监听到 play
	videoMedia.addEventListener('play', function() {
		console.log('play');
		logProperties();
	});
	//这个监听为监听到 waiting
	videoMedia.addEventListener('waiting', function() {
		console.log('waiting');
		logProperties();
	});
	//这个监听为监听到 durationchange
	videoMedia.addEventListener('durationchange', function() {
		console.log('durationchange:' + '获取到视频长度');
		logProperties();
	});
	//这个监听为监听到 loadeddata
	videoMedia.addEventListener('loadeddata', function() {
		console.log('loadeddata');
		logProperties();
	});
	//这个监听为监听到 canplay
	videoMedia.addEventListener('canplay', function() {
		console.log('canplay');
		logProperties();
	});
	//这个监听为监听到 playing
	videoMedia.addEventListener('playing', function() {
		console.log('playing:' + '开始播放');
		logProperties();
	});
	//这个监听为监听到 canplaythrough
	videoMedia.addEventListener('canplaythrough', function() {
		console.log('canplaythrough:' + '可以流畅播放');
		logProperties();
	});
	//这个监听为监听到 progress
	videoMedia.addEventListener('progress', function() {
		console.log('progress:' + '持续下载');
		logProperties();
	});
	//这个监听为监听到 timeupdate
	videoMedia.addEventListener('timeupdate', function() {
		//		console.log('timeupdate:' + '播放进度变化');
		//		logProperties();
	});
	//这个监听为监听到 seeking
	videoMedia.addEventListener('seeking', function() {
		console.log('seeking:');
		logProperties();
	});
	//这个监听为监听到 seeked
	videoMedia.addEventListener('seeked', function() {
		console.log('seeked:' + '播放完毕');
		logProperties();
	});
	//这个监听为监听到 resize
	videoMedia.addEventListener('resize', function() {
		console.log('resize:');
		logProperties();
	});

})();