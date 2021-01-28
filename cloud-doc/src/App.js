// import logo from "./logo.svg";
import "./App.css";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import defaultFiles from "./utils/defaultFiles";
import BottomBtn from "./components/BottomBtn";
import TabList from "./components/TabList";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
function App() {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFileID, setActiveFileID] = useState("");
  const [openedFileIDs, setOpenedFilesIDs] = useState([]);
  const [unsavedFilesIDs, setUnsavedFilesIDs] = useState([]);
  //用于存储搜索数据的数组
  const [searchedFiles, setSearchedFiles] = useState([]);
  //找到打开的文件id
  const openedFiles = openedFileIDs.map((openID) => {
    return files.find((file) => file.id == openID);
  });
  //fileclick函数
  const fileClick = (fileID) => {
    //set current active file
    setActiveFileID(fileID);
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
    const tabsWithout = openedFileIDs.filter((fileID) => fileID != id);
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
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.body = value;
      }
      return file;
    });
    setFiles(newFiles);
    if (!unsavedFilesIDs.includes(id)) {
      setUnsavedFilesIDs([...unsavedFilesIDs, id]);
    }
  };
  //找到激活的文件id
  const activeFile = files.find((file) => {
    return file.id == activeFileID;
  });
  //删除文件函数
  const deleteFile = (id) => {
    //过滤不要的id
    const newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);
    //关闭tab
    tabClose(id);
  };
  const updateFileName = (id, title) => {
    //找到对应id的文件并更新
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.title = title;
        file.isNew = false;
      }
      return file;
    });
    setFiles(newFiles);
  };
  const fileSearch = (keyword) => {
    //过滤器来寻找所需文件
    const newFiles = files.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  };
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : files;
  //新建文件方法
  const createNewFile = () => {
    console.log("新建");
    const newID = uuidv4();
    const newFiles = [
      ...files,
      {
        id: newID,
        title: "",
        body: "##请输入新的Markdown文件",
        createdAt: new Date().getTime(),
        isNew: true,
      },
    ];
    setFiles(newFiles);
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
