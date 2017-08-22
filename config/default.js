const env = process.env.NODE_ENV || 'development'
let dbUrl = 'mongodb://blog_runner:safeblog@127.0.0.1:27017/blog-app'
let avatarDomain = 'https://api.xmxmxm.me'
if (env === 'development') {
  // dbUrl = 'mongodb://127.0.0.1:27017/blog',
  dbUrl = 'mongodb://blog:a263656@ds133281.mlab.com:33281/mdatabase',
  avatarDomain = 'http://localhost:3001'
}
module.exports.setConfig = () => {
  process.env = {
    MONGOOSE_CONNECT: dbUrl,
    // MONGOOSE_CONNECT: 'mongodb://blog:a263656@ds133281.mlab.com:33281/mdatabase',
    SECRET_KEY: 'secret',
    domain: avatarDomain
  }
}
