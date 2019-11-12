

var TeamLayer = cc.Layer.extend({
    labelTips : null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.loadUI();

        //Talk消息事件注册
        this.addVoiceEventListener();

        //进入房间，设置初始的麦克风，扬声器状态和音量
        //小队频道，麦克风和扬声器都要
        youmetalk.talk_SetMicrophoneMute( false);
        youmetalk.talk_SetSpeakerMute( false );
        youmetalk.talk_SetVolume(70);

        return true;
    },

    addVoiceEventListener: function () {
        var mythis = this;
        //收到YoumeTalk的提示消息
        var tipsListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"Tips",
            callback:function (event) {
                var tips = event.getUserData();
                mythis.addTips( tips );
            }
        });
        cc.eventManager.addListener( tipsListener ,1);
    },
                                

    addTips : function ( tips ){
        this.labelTips.setString( tips );
    },

    loadUI: function () {
        var visibleSize =  cc.director.getVisibleSize();

        var labelID = cc.LabelTTF("", "Arial", 40);
        labelID.setFontFillColor( cc.color.WHITE );
        labelID.setPosition( 20, visibleSize.height - 80 );
        labelID.setAnchorPoint( 0,0) ;
        this.addChild( labelID );
        labelID.setString( "用户:"+ g_userID );

        var labelRoom = cc.LabelTTF("", "Arial", 40);
        labelRoom.setFontFillColor( cc.color.WHITE );
        labelRoom.setPosition( 20, visibleSize.height - 160 );
        labelRoom.setAnchorPoint( 0,0) ;
        this.addChild( labelRoom );
        labelRoom.setString( "频道:"+ g_roomName );

        var btnExit = ccui.Button();
        btnExit.setTitleFontSize(80);
        btnExit.setPosition(visibleSize.width - 100 , 10);
        btnExit.setAnchorPoint(0.5, 0 );
        btnExit.setTitleText("退出");
        btnExit.setTitleColor( cc.color.WHITE );
        this.addChild( btnExit );
        btnExit.addClickEventListener( function () {
            //取消事件注册
            cc.eventManager.removeCustomListeners("Tips");

            /**
             *  功能描述:退出所有语音频道
             *
             *  @return 错误码，详见YouMeConstDefine.h定义
            */
            var errorcode = youmetalk.talk_LeaveChannelAll();
            if( 0 === errorcode )
            {
                cc.log("调用退出所有频道成功\n");
            }
            else
            {
                cc.log("调用退出所有频道失败，错误码：%d\n",  errorcode);
            }

            //切换回登录界面
            var scene = new LoginScene();
            cc.director.replaceScene( scene );
        });

        var btnPause = ccui.Button();
        btnPause.setTitleFontSize( 80 );
        btnPause.setPosition(visibleSize.width /2 ,  280);
        btnPause.setAnchorPoint(0.5, 0 );
        btnPause.setTitleText("暂停");
        btnPause.setTitleColor( cc.color.WHITE );
        this.addChild( btnPause );
        btnPause.addClickEventListener( function () {
            /**
             *  功能描述: 暂停通话，释放麦克风等设备资源
             *  @return YOUME_SUCCESS - 成功
             *          其他 - 具体错误码
            */
            var errorcode = youmetalk.talk_PauseChannel();
            if( 0 === errorcode )
            {
                cc.log("调用暂停成功\n");
            }
            else
            {
                cc.log("调用暂停失败，错误码：%d\n",  errorcode);
            }
        });

        var btnResume = ccui.Button();
        btnResume.setTitleFontSize( 80 );
        btnResume.setPosition(visibleSize.width /2 ,  180);
        btnResume.setAnchorPoint(0.5, 0 );
        btnResume.setTitleText("恢复");
        btnResume.setTitleColor( cc.color.WHITE );
        this.addChild( btnResume );
        btnResume.addClickEventListener( function () {
            /**
             *  功能描述: 恢复通话
             *  @return YOUME_SUCCESS - 成功
             *          其他 - 具体错误码
            */
            var errorcode = youmetalk.talk_ResumeChannel();
            if( 0 === errorcode )
            {
                cc.log("调用恢复成功\n");
            }
            else
            {
                cc.log("调用恢复失败，错误码：%d\n",  errorcode);
            }
        });

        this.labelTips = cc.LabelTTF("", "Arial", 40);
        this.labelTips.setFontFillColor( cc.color.WHITE );
        this.labelTips.setPosition( 0,0 );
        this.labelTips.setAnchorPoint( 0,0) ;
        this.addChild( this.labelTips );
    }
});

var TeamScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new TeamLayer();
        this.addChild(layer);
    }
});
