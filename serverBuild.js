const cp = require('child_process');
const path = require('path');

const start = (opts) => {
  console.log('builder serverBuild', opts);
  process.env.KOS_PUBLISH_ENV = opts;
  const child = cp.fork(path.join(__dirname, 'build.js'));
  child.on('message', data => {
    if (data === 'restart') {
      child.kill('SIGINT');
      console.log('serverbuild', data);
    }
  });
  
  child.on('exit', code => code && process.exit(code));
};

module.exports = start;