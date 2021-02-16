const qiniu = require("qiniu");
const QiniuManager = require("./utils/QiniuManager");
var accessKey = "vp8-Un6KvnWmRaN3WYY5w1l84rY1nri0ecJ31rq0";
var secretKey = "fQeEyqUiUX6eXFBY8XggqrQJDHBwD9PtuqvH6t3K";
var localFile = "C:/Users/apache/Desktop/TestFile 22.md";
var key = "TestFile 223.md";
const manager = new QiniuManager(accessKey, secretKey, "reactcloud");
// manager
//   .uploadFile(key, localFile)
//   .then((data) => {
//     console.log("上传成功" + data);
//     manager.deleteFile(key);
//   })
//   .then((data) => {
//     console.log("删除成功");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// manager.getBucketDomain().then((data) => {
//   console.log(data);
// });
//上传文件
// manager
//   .uploadFile(key, localFile)
//   .then((data) => {
//     console.log("上传成功");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
//获取下载链接
manager
  .generateDownloadLink(key)
  .then((data) => {
    console.log(data);
    return manager.generateDownloadLink("TestFile 22.md");
  })
  .then((data) => {
    console.log(data);
  });

// manager.deleteFile(key);
// var publicBucketDomain = "qokkmqq9p.hd-bkt.clouddn.com";
