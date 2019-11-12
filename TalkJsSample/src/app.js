
var LoginLayer = cc.Layer.extend({
    idInput: null,
    roomInput: null,
    labelTips : null,
    ctor: function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        this.loadUI();
        this.addVoiceEventListener();
        
        return true;
    },

    //用户ID和房间ID，只能包含数字，字母和_
    isKeyValid: function ( strID ){
        if( strID.length === 0 ){
            return false;
        }

        for( var i = 0 ; i < strID.length; i++ ){
            var c = strID.charAt( i );

            if( c == '_' ||
                (c >= '0' && c <= '9') ||
                ( c >= 'a' && c <= 'z') ||
                ( c >= 'A' && c <= 'Z')){
                continue;
            }
            else{
                return false;
            }
        }
        return true;
    },

    addVoiceEventListener: function ( ){
        var mythis = this;
        
        //进入房间成功，切换场景
        var enterListener = cc.EventListener.create({
            event:cc.EventListener.CUSTOM,
            eventName:"EnterRoom",
            callback:function (event) {
                //取消事件注册
                cc.eventManager.removeCustomListeners("Tips");
                cc.eventManager.removeCustomListeners("EnterRoom");

                var scene = null;
                switch( g_roleType ){
                    case 1:{
                        scene = new TeamScene();
                    }
                        break;
                    case 3:{
                        scene = new HostScene();
                    }
                        break;
                    case 5:{
                        scene = new HostScene();
                    }
                        break;
                    default:
                        break;
                }
                cc.director.replaceScene( scene );
            
            }
        });
        cc.eventManager.addListener( enterListener ,1);

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

    loginChatRoom: function ( roleType ){
        g_userID =  this.idInput.getString();
        g_roomName = this.roomInput.getString();
        g_roleType = roleType;

        if( !this.isKeyValid( g_userID ) ){
            this.addTips( "用户名错误");
            cc.log( "用户名错误");
            return ;
        }

        if( !this.isKeyValid( g_roomName ) ){
            this.addTips("频道ID错误");
            cc.log("频道ID错误");
            return ;
        }

        cc.log("user:%s,roomName:%s, role:%d\n", g_userID, g_roomName , g_roleType);
 
        //YOUME
        /*!
         *  进入房间
         *
         *  @param pUserID   用户ID
         *  @param pChannelID 频道ID
         *  @param eUserRole 用户角色（YouMeUserRole）
         *  @param bCheckRoomExist 是否检查频道存在时才加入，默认为false: true 当频道存在时加入、不存在时返回错误（多用于观众角色），false 无论频道是否存在都加入频道
         *  @return 错误码
        */
        var ymErrorcode = youmetalk.talk_JoinChannelSingleMode( g_userID,g_roomName, g_roleType,false );
        if( 0  === ymErrorcode)
        {
            cc.log("调用进入房间成功\n");
        }
        else
        {
            cc.log("调用进入房间失败，错误码：%d\n",  ymErrorcode);
        }
    },

    loadUI: function () {
        cc.log("loadUI\n");
        var labelX = 50;
        var visibleSize = cc.director.getVisibleSize();

        var labelID = cc.LabelTTF("输入用户ID", "Arial", 80);
        labelID.setPosition(labelX, 600);
        labelID.setAnchorPoint(0, 0);
        this.addChild(labelID);

        var labelRoom = cc.LabelTTF("输入频道ID", "Arial", 80);
        labelRoom.setPosition(labelX, 450);
        labelRoom.setAnchorPoint(0, 0);
        this.addChild(labelRoom);

        this.idInput = cc.EditBox(cc.size(400, 100), "res/chat_bottom_textfield.png");
        this.idInput.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.idInput.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.idInput.setAnchorPoint(0, 0);
        this.idInput.setFontColor(cc.color.BLACK);
        this.idInput.setPosition(labelX + 450, 600);
        this.idInput.setMaxLength(10);
        this.addChild(this.idInput);
        this.idInput.setString( g_userID );

        this.roomInput = cc.EditBox(cc.size(400, 100), "res/chat_bottom_textfield.png");
        this.roomInput.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.roomInput.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.roomInput.setAnchorPoint(0, 0);
        this.roomInput.setFontColor(cc.color.BLACK);
        this.roomInput.setPosition(labelX + 450, 450);
        this.addChild(this.roomInput);
        this.roomInput.setMaxLength(10);
        this.roomInput.setString( g_roomName );

        var myThis  = this;

        var btnTeam = ccui.Button();
        btnTeam.setTitleFontSize(80);
        btnTeam.setPosition(visibleSize.width/2 , 280);
        btnTeam.setAnchorPoint(0.5,0);
        btnTeam.setTitleText("小队频道");        
        btnTeam.addClickEventListener(  function () {
            cc.log("进入小队频道");
            myThis.loginChatRoom( 1 );
        } );
        this.addChild(btnTeam);

        var btnListener = ccui.Button();
        btnListener.setTitleFontSize(80);
        btnListener.setPosition(visibleSize.width/2 , 180);
        btnListener.setAnchorPoint(0.5,0);
        btnListener.setTitleText("主播频道-听众");        
        btnListener.addClickEventListener(  function () {
            cc.log("进入主播频道-听众");
            myThis.loginChatRoom( 3 );
        } );
        this.addChild(btnListener);

        var btnHost = ccui.Button();
        btnHost.setTitleFontSize(80);
        btnHost.setPosition(visibleSize.width/2 , 80);
        btnHost.setAnchorPoint(0.5,0);
        btnHost.setTitleText("主播频道-主播");        
        btnHost.addClickEventListener(  function () {
            cc.log("进入主播频道-主播");
            myThis.loginChatRoom( 5 );
        } );
        this.addChild(btnHost);

        this.labelTips = cc.LabelTTF("", "Arial", 40);
        this.labelTips.setFontFillColor( cc.color.WHITE );
        this.labelTips.setPosition( 0,0 );
        this.labelTips.setAnchorPoint( 0,0) ;
        this.addChild( this.labelTips );
    }
});

var LoginScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LoginLayer();
        this.addChild(layer);
    }
});

