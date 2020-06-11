var OSC = require('osc')
var WebSocket = require('ws');
var Emocore = require('emocore')
var conf = require('./config.js')

conf.emo.socket = new WebSocket('ws://localhost:54321'),

var emo = (new Emocore(conf.emo)).newSession({ project:'OSC', status:'active' })
var osc = new OSC.UDPPort({ localAddress:conf.osc.host, localPort:57000, broadcast:true, metadata: true })

osc.open()

console.log('starting..')

var send = (str, evt) => Object.keys(evt[str]).map(key => osc.send({
   address:`/emotiv/${str}/${key}`, 
   args:[ { type:'f', value: evt[str][key] } ]
}))

var _send = (str, evt) => osc.send({
  timeTag: { native:new Date().getTime() },
  packets: Object.keys(evt[str]).map(key => ({ 
    address:`/emotiv/${str}/${key}`, 
    args:[ { type:'f', value: evt[str][key] } ]
  }, conf.osc.host, conf.osc.port))
})

oscPort.on('ready', () => {
  console.log('OSC READY')
  conf.osc.streams.map(str => emo.on(str, evt => send(str, evt)))
})
