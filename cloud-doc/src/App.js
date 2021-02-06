// import logo from "./logo.svg";
import "./App.css";
import {
  faPlus,
  faFileImport,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import fileHelper from "./utils/fileHelper";
import { flattenArr, objToArr } from "./utils/helper";
import BottomBtn from "./components/BottomBtn";
import TabList from "./components/TabList";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
//node.js 原生模块引用
// const electron = require("electron");
// const app = electron.app;
const { join, basename, extname, dirname } = window.require("path");
const { remote } = window.require("electron");
//使用低版本安装包解决store-electron引入报错
const Store = window.require("electron-store");
const fileStore = new Store({ name: "Files Data" });
//精简文件的信息结构函数,去掉body和isNew等信息
const saveFilesToStore = (files) => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt,
    };
    return result;
  }, {});
  fileStore.set("files", filesStoreObj);
};

function App() {
  const [files, setFiles] = useState(fileStore.get("files") || {});
  const filesArr = objToArr(files);
  const savedLocation = remote.app.getPath("documents");
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFilesIDs] = useState([]);
  const [unsavedFilesIDs, setUnsavedFilesIDs] = useState([]);
  //用于存储搜索数据的数组
  const [searchedFiles, setSearchedFiles] = useState([]);
  //找到打开的文件id
  //1.旧遍历方法
  // const openedFiles = openedFileIDs.map((openID) => {
  //   return files.find((file) => file.id == openID);
  // });
  //新遍历方法
  const openedFiles = openedFileIDs.map((openID) => {
    return files[openID];
  });
  //fileclick函数
  const fileClick = (fileID) => {
    //set current active file
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }
    //add new fileID to openedFiles
    //判断当前是否有重复file打开
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFilesIDs([...openedFileIDs, fileID]);
    }
  };
  //onTabclick判断点击当前的文件并激活
  const tabClick = (fileID) => {
    setActiveFileID(fileID);
  };
  //删除功能
  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFilesIDs(tabsWithout);
    //判断关闭之后
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0]);
    } else {
      setActiveFileID("");
    }
  };
  //值的更新
  const fileChange = (id, value) => {
    //1.旧方法
    // const newFiles = files.map((file) => {
    //   if (file.id === id) {
    //     file.body = value;
    //   }
    //   return file;
    // });
    // setFiles(newFiles);
    const newFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: newFile });

    if (!unsavedFilesIDs.includes(id)) {
      setUnsavedFilesIDs([...unsavedFilesIDs, id]);
    }
  };
  //找到激活的文件id
  //1.旧方法
  // const activeFile = files.find((file) => {
  //   return file.id == activeFileID;
  // });
  //改变state结构后的新方法
  const activeFile = files[activeFileID];
  //删除文件函数
  const deleteFile = (id) => {
    //过滤不要的id
    //1.旧方法
    // const newFiles = files.filter((file) => file.id !== id);
    // setFiles(newFiles);
    //关闭tab
    // tabClose(id);
    //2.新数据结构的方法
    // delete files[id];
    // setFiles(files);
    // tabClose(id);
    //3.使用数据持久化保存之后重构
    fileHelper.deleteFile(files[id].path).then(() => {
      delete files[id];
      setFiles(files);
      saveFilesToStore(files);
      tabClose(id);
    });
  };
  const updateFileName = (id, title, isNew) => {
    //newPath
    //如果不是新文件，判断isNew为false
    const newPath = isNew
      ? join(savedLocation, `${title}.md`)
      : join(dirname(files[id].path), `${title}.md`);

    //找到对应id的文件并更新
    //1.旧方法
    // const newFiles = files.map((file) => {
    //   if (file.id === id) {
    //     file.title = title;
    //     file.isNew = false;
    //   }
    //   return file;
    // });
    // setFiles(newFiles);
    //新方法
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      const oldpath = files[id].path;
      fileHelper.renameFile(oldpath, newPath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  };
  const fileSearch = (keyword) => {
    //过滤器来寻找所需文件
    const newFiles = filesArr.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  };
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;
  //新建文件方法
  const createNewFile = () => {
    console.log("新建");
    const newID = uuidv4();
    //1.旧方法
    // const newFiles = [
    //   ...files,
    //   {
    //     id: newID,
    //     title: "",
    //     body: "##请输入新的Markdown文件",
    //     createdAt: new Date().getTime(),
    //     isNew: true,
    //   },
    // ];
    // setFiles(newFiles);
    //2.新方法
    const newFile = {
      id: newID,
      title: "",
      body: "##请输入新的Markdown文件",
      createdAt: new Date().getTime(),
      isNew: true,
    };
    setFiles({ ...files, [newID]: newFile });
  };

  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
      setUnsavedFilesIDs(unsavedFilesIDs.filter((id) => id !== activeFile.id));
    });
  };

  //导入文件
  const importFiles = () => {
    console.log("导入");
    remote.dialog
      .showOpenDialog({
        title: "选择导入的Markdown文件",
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "Markdown files",
            extensions: ["md"],
          },
        ],
      })
      .then((paths) => {
        // console.log(res.canceled)
        // console.log(res.filePaths)
        console.log(paths.filePaths);
        if (true) {
          console.log("gik");
          const filteredPaths = paths.filePaths.filter((path) => {
            const alreadyAdded = Object.values(files).find((file) => {
              return file.path === path;
            });
            return !alreadyAdded;
          });
          const importFilesArr = filteredPaths.map((path) => {
            return {
              id: uuidv4(),
              title: basename(path, extname(path)),
              path,
            };
          });
          console.log(importFilesArr);
          const newFiles = { ...files, ...flattenArr(importFilesArr) };
          console.log(newFiles);
          setFiles(newFiles);
          saveFilesToStore(newFiles);
          if (importFilesArr.length > 0) {
            remote.dialog.showMessageBox({
              type: "info",
              title: `成功导入${importFilesArr.length}了文件`,
              message: `成功导入${importFilesArr.length}了文件`,
            });
          }
        }
        // console.log(importFilesArr);
      });
  };
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          {/* -----FilesSearch----- */}
          <FileSearch title="我的云文档" onFileSearch={fileSearch} />
          {/* -----FileList----- */}
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onSaveEdit={updateFileName}
          />
          {/* -----BottomBtn----- */}
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-secondary"
                icon={faPlus}
                onBtnclick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-dark"
                icon={faFileImport}
                onBtnclick={importFiles}
              />
            </div>
          </div>
        </div>
        {/* -----right-panel----- */}
        <div className="col-9 right-panel bg-white">
          {!activeFile && (
            <div className="start-page">请选择创建新的 markdown 文档</div>
          )}
          {activeFile && (
            <>
              <TabList
                files={openedFiles}
                activeId={activeFileID}
                unsaveIds={unsavedFilesIDs}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                key={activeFile && activeFileID.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {
                  fileChange(activeFile.id, value);
                }}
                options={{
                  minHeight: "475px",
                }}
              />
              <BottomBtn
                text="保存"
                colorClass="btn-secondary"
                icon={faSave}
                onBtnclick={saveCurrentFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
