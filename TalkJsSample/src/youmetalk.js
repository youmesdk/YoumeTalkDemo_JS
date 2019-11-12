var youmetalk = new YouMeTalk;

var g_userID = "userID";
var g_roomName = "room";
var g_roleType = 0;

var addTips = function( strTips ){
    var event = new cc.EventCustom("Tips");
    event.setUserData( strTips );
    cc.eventManager.dispatchEvent( event );
}

youmetalk.OnEvent = function( event,  errorcode, channel, param )
{
    /**
     param 大部分回调里都是 userid
     */
    cc.log("OnEvent:event_"+event + ",error_" + errorcode + ",channel_" + channel + ",param_" + param)
    switch( event ){
         case 0: //YOUME_EVENT_INIT_OK:
            cc.log("Talk 初始化成功");
            addTips("初始化成功");
            break;
        case 1://YOUME_EVENT_INIT_FAILED:
            cc.log("Talk 初始化失败");
            addTips("初始化失败");
            break;
        case 2://YOUME_EVENT_JOIN_OK:
        {
            cc.log("Talk 进入频道成功，频道："+channel+" 用户id:"+param);
            addTips( "进入频道成功，ID：" + channel  );
            var event = new cc.EventCustom("EnterRoom");
            cc.eventManager.dispatchEvent( event );
        }
            break;
        case 3://YOUME_EVENT_JOIN_FAILED:
            cc.log("Talk 进入频道:"+channel+"失败");
            addTips("Talk 进入频道失败");
            break;
        case 4://YOUME_EVENT_LEAVED_ONE:
            addTips("退出频道");
            cc.log("Talk 离开单个频道:"+channel);
            break;
        case 5://YOUME_EVENT_LEAVED_ALL:
            addTips("退出所有频道");
            cc.log("Talk 离开所有频道，这个回调channel参数为空字符串");
            break;
        case 6://YOUME_EVENT_PAUSED:
            addTips("暂停");
            cc.log("Talk 暂停");
            break;
        case 7://YOUME_EVENT_RESUMED:
            addTips("恢复");
            cc.log("Talk 恢复");
            break;
        case 8://YOUME_EVENT_SPEAK_SUCCESS:///< 切换对指定频道讲话成功（适用于多频道模式）
            break;
        case 9://YOUME_EVENT_SPEAK_FAILED:///< 切换对指定频道讲话失败（适用于多频道模式）
            break;
        case 10://YOUME_EVENT_RECONNECTING:///< 断网了，正在重连
            cc.log("Talk 正在重连");
            break;
        case 11://YOUME_EVENT_RECONNECTED:///< 断网重连成功
            cc.log("Talk 重连成功");
            break;
        case 12://YOUME_EVENT_REC_FAILED:///< 通知录音启动失败（此时不管麦克风mute状态如何，都没有声音输出）
            cc.log("录音启动失败,%d",errorcode);
            break;
        case 13://YOUME_EVENT_BGM_STOPPED:///< 通知背景音乐播放结束
            cc.log("背景音乐播放结束,path:%s",param);
            addTips( "背景音乐播放结束" );
            break;
        case 14://YOUME_EVENT_BGM_FAILED:///< 通知背景音乐播放失败
            cc.log("背景音乐播放失败,%d",errorcode);
            addTips( "背景音乐播放失败" );
            break;
        case 16://YOUME_EVENT_OTHERS_MIC_ON:///< 其他用户麦克风打开
            cc.log("其他用户麦克风打开,userid:%s",param);
            break;
        case 17://YOUME_EVENT_OTHERS_MIC_OFF:///< 其他用户麦克风关闭
            cc.log("其他用户麦克风关闭,userid:%s",param);
            break;
        case 18://YOUME_EVENT_OTHERS_SPEAKER_ON:///< 其他用户扬声器打开
            cc.log("其他用户扬声器打开,userid:%s",param);
            break;
        case 19://YOUME_EVENT_OTHERS_SPEAKER_OFF: ///< 其他用户扬声器关闭
            cc.log("其他用户扬声器关闭,userid:%s",param);
            break;
        case 20://YOUME_EVENT_OTHERS_VOICE_ON: ///< 其他用户进入讲话状态
            cc.log("用户id：%s 开始讲话",param);
            break;
        case 21://YOUME_EVENT_OTHERS_SPEAKER_OFF: ///< 其他用户停止讲话
            cc.log("用户id：%s 停止讲话",param);
            break;
        case 22://YOUME_EVENT_MY_MIC_LEVEL: ///< 自己的麦克风的语音音量级别
            cc.log("我当前讲话的音量级别是,数值：%d",errorcode);
            break;
        case 23://YOUME_EVENT_MIC_CTR_ON: ///< 自己的麦克风被其他用户打开
            cc.log("自己的麦克风被其他用户打开，userid：%s",param);
            break;
        case 24://YOUME_EVENT_MIC_CTR_OFF: ///< 自己的麦克风被其他用户关闭
            cc.log("自己的麦克风被其他用户关闭，userid：%s",param);
            break;
        case 25://YOUME_EVENT_SPEAKER_CTR_ON: ///< 自己的扬声器被其他用户打开
            cc.log("自己的扬声器被其他用户打开，userid：%s",param);
            break;
        case 26://YOUME_EVENT_SPEAKER_CTR_OFF: ///< 自己的扬声器被其他用户关闭
            cc.log("自己的扬声器被其他用户关闭，userid：%s",param);
            break;
        case 27://YOUME_EVENT_LISTEN_OTHER_ON: ///< 取消屏蔽某人语音
            cc.log("取消屏蔽某人语音，userid：%s",param);
            break;
        case 28://YOUME_EVENT_LISTEN_OTHER_OFF: ///< 屏蔽某人语音
            cc.log("屏蔽某人语音,userid：%s",param);
            break;
        default:
            break;
    }
};


//主播排班、礼物排行想RestAPI接口的回调
youmetalk.OnRequestRestApi = function( requestid, errcode, command, result ){
    
}

//频道内用户列表的回调
// channel: 频道
// memberListJsonString: 变化的用户列表
// isUpdate: false为第一次查询，true为增量通知
youmetalk.OnMemberChange = function ( channel,  memberListJsonString, isUpdate){
    cc.log("OnMemberChange:%s,%s", channel,  memberListJsonString );
}

