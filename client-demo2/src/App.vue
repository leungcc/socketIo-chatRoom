<template>
  <div id="app">
    <!--登录表单-->
    <div v-if="!hasLogin" @keyup.enter="joinRoom">
      <p>
        <label>请输入昵称</label>
        <input type="text" v-model="username">
      </p>
      <p>
        <label>请输入房间号</label>
        <input type="text" v-model="roomId">
      </p>
      <p>
        <button @click="joinRoom">登录</button>
      </p>
    </div>

    <!--登录后可见内容-->
    <div v-if="hasLogin">
      <div class="chat-cnt-wrap">
        <p 
          v-for="(item,index) in chatMsgList" 
          :key="index"
          class="chat-single-line"
          :class="{'chat-self': socket.id === item.socketId}">
          <label class="chat-username">{{ item.username }}</label>
          <span class="chat-cnt">{{ item.message }}</span>
        </p>
      </div>
      <div @keyup.enter="sendMsg">
        <input type="text" v-model="chatMsg">
        <button @click="sendMsg">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  created() {},
  components: {
    HelloWorld
  },
  data() {
    return {
      username: "",
      roomId: null,
      socket: null,

      hasLogin: false,
      chatMsg: "", //聊天消息

      chatMsgList: [] //聊天消息列表
    };
  },
  methods: {
    joinRoom() {
      if(!this.username || !this.roomId) {
        alert('请输入用户名和房间号')
        return;
      }
      this.hasLogin = true;

      //与服务器建立socket连接
      const socket = io.connect("localhost:2019?name=" + this.username);
      const room = this.roomId;
      this.socket = socket;

      console.log(socket);

      //真正加入房间
      if (room !== "") {
        console.log("Joining room " + room);
        socket.emit("create or join", room);
      }

      socket.on("empty", room => {
        console.log(`Room ${room} is empty`);
      });

      socket.on("join", room => {
        console.log(`Making request to join room ${room}`);
      });

      socket.on("log", array => {
        console.log(array);
      });

      socket.on("message", this.getMsg);
    },
    
    /**
     * @desc 发送消息
     */
    sendMsg() {
      this.socket.emit("message", this.chatMsg);
    },

    /**
     * @desc 收到消息
     * @param {Object} data
     */
    getMsg(data) {
      this.chatMsgList.push(data);
      if(this.chatMsgList.length > 10) {
        this.chatMsgList.shift();
      }
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.chat-cnt-wrap {
  height: 400px;
}
.chat-cnt-wrap .chat-single-line {
  width: 500px;
  overflow: hidden;
  margin: 10px auto;
  /*height: 30px;*/
  line-height: 30px;
  display: flex;

}
.chat-cnt-wrap .chat-single-line.chat-self {
  flex-direction: row-reverse;
}
.chat-cnt-wrap .chat-single-line .chat-username {
  width: 100px;
  text-align: right;
  padding: 0 6px;
}
.chat-cnt-wrap .chat-single-line.chat-self .chat-username {
  text-align: left;
}
.chat-cnt-wrap .chat-single-line .chat-cnt {
  min-height: 30px;
  line-height: 30px;
  border-radius: 4px;
  background-color: #48C95C;
  max-width: 400px;
  padding: 0 6px;
  color: #fff;
} 
.chat-cnt-wrap .chat-single-line.chat-self .chat-cnt {
  background-color: #3F56AA;
}


</style>
