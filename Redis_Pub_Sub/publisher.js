var redis = require('ioredis');
/*const conn = new redis({
  host: 'redis-18786.c270.us-east-1-3.ec2.cloud.redislabs.com',
  port: '18786',
  password: '*****',
});*/
const conn = new redis();

conn.config('SET', 'notify-keyspace-events', 'Ex');

conn.on('connect', function () {
  console.log('Hello');
});

exports.Set_Message = function (key, value) {
  conn.setex(key, 10, value);
  console.log('Done');
};
