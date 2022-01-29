var redis = require('ioredis');
/*const sub = new redis({
  host: 'redis-18786.c270.us-east-1-3.ec2.cloud.redislabs.com',
  port: '18786',
  password: '******',
});*/
const sub = new redis();

sub.config('SET', 'notify-keyspace-events', 'Ex');

sub.on('connect', function () {
  console.log('Hello');
});

sub.subscribe('__keyevent@0__:expired');
sub.on('message', function (channel, message) {
  console.log(message);
  console.log('Finish');
});
