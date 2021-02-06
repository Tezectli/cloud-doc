const fs = window.require("fs").promises;
const path = window.require("path");

const fileHelper = {
  readFile: (path) => {
    return fs.readFile(path, { encoding: "utf8" });
  },
  writeFile: (path, content) => {
    return fs.writeFile(path, content, { encoding: "utf8" });
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath);
  },
  deleteFile: (path) => {
    return fs.unlink(path);
  },
};

//以下为测试使用
// const testPath = path.join(__dirname, "helper.js");
// const testWritePath = path.join(__dirname, "hellow.md");
// const renamePath = path.join(__dirname, "rename.md");
// fileHelper.readFile(testPath).then((data) => {
//   console.log(data);
// });
// fileHelper.writeFile(testWritePath, "##hellow world").then(() => {
//   console.log("写入成功");
// });
// fileHelper.renameFile(testWritePath, renamePath).then(() => {
//   console.log("重命名成功");
// });
// fileHelper.deleteFile(renamePath).then(() => {
//   console.log(`${renamePath}删除成功`);
// });

export default fileHelper;
