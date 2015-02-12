
(function(){
	var Socket = {
		init : function(msgFn,chatFn){
			this.socket = new io.connect(null,{port:3000});
			this.socket.on('message',msgFn);
			this.socket.on('chat',chatFn);
		},
		enter : function(nickName){
			this.socket.emit('enter',{nickName:nickName})
		},
		send : function(chat,nickName){
			this.socket.emit('newchat',{chat:chat, nickName:nickName});
		},
	
	};

	var View = function(){
		this.cut = $(".cut");
		this.chatView = $(".chatView");
		this.chatViewWrap = $(".chatViewWrap");
		this.chat = $(".chat");
		this.sendBtn = $(".send");
		this.nickName = this.getNickName();
		$(".chat").focus();
		$(".chat").keydown(function(e){
			if(e.which ==13){
				this.send();
			}
		}.bind(this));
		Socket.init(this.msgFn.bind(this),this.receive.bind(this));
		Socket.enter(this.nickName);

	};
	View.prototype.msgFn = function(data){
		this.chatView.append("<span style='color:red'>"+data.nickName + "님이 입장하셨습니다.</span><br/>" );
		this.cut.html(data.clients);

	};
	View.prototype.send = function(){
		var chat = this.chat.val();
		if(chat.length>200){
			chat = chat.splice(0,200);
		}
		if(chat.trim()!=""){
			Socket.send(this.chat.val(),this.nickName);
			this.chat.val('');
		}
	};
	View.prototype.receive = function(data){
		this.chatView.append("<span>"+data.nickName +" : "+ data.chat +"</span><br/>");
		this.chatViewWrap.animate({scrollTop:this.chatView.height()},100);
	};
	View.prototype.getNickName = function(){
		return prompt("닉네임을 입력해주세요", '') || "Nhn 호구" 
	};


	var a = new View();

})();

