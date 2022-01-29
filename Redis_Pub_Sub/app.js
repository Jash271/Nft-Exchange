/*var redis = require('ioredis');
const conn = new redis({
  host: 'redis-18786.c270.us-east-1-3.ec2.cloud.redislabs.com',
  port: '18786',
  password: '******',
});

conn.config('SET', 'notify-keyspace-events', 'Ex');

conn.on('connect', function () {
  console.log('Hello');
});

conn.setex('foo', 10, 'bar');
const sub = conn.duplicate();
sub.subscribe('__keyevent@0__:expired');
sub.on('message', function (channel, message) {
  console.log(message);
  console.log('Finish');
});
*/

const func = require('./publisher').Set_Message;
func('foo', 'bar');
