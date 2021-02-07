import React, { Component, useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import useKeyPress from "../hooks/useKeyPress";
import usecontextMenu from "../hooks/useContextMenu";
import { getParentNode } from "../utils/helper";

//添加node.js插件
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue("");
    //如果正在修改新建的文件时
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };
  const clickItem = usecontextMenu(
    [
      {
        label: "打开",
        click: () => {
          //取得对应位置的参数
          const parentElement = getParentNode(clickItem.current, "file-item");
          if (parentElement) {
            onFileClick(parentElement.dataset.id);
          }
        },
      },
      {
        label: "重命名",
        click: () => {
          const parentElement = getParentNode(clickItem.current, "file-item");
          setEditStatus(parentElement.dataset.id);
          setValue(parentElement.dataset.title);
        },
      },
      {
        label: "删除",
        click: () => {
          const parentElement = getParentNode(clickItem.current, "file-item");
          onFileDelete(parentElement.dataset.id);
        },
      },
    ],
    ".file-list"
  );
  // useEffect(() => {
  //   const menu = new Menu();
  //   menu.append(
  //     new MenuItem({
  //       label: "打开",
  //       click: () => {
  //         console.log("clikong file");
  //       },
  //     })
  //   );
  //   menu.append(
  //     new MenuItem({
  //       label: "重命名",
  //       click: () => {
  //         console.log("renmae file");
  //       },
  //     })
  //   );
  //   menu.append(
  //     new MenuItem({
  //       label: "删除",
  //       click: () => {
  //         console.log("delet file");
  //       },
  //     })
  //   );
  //   const handleContextMenu = (e) => {
  //     menu.popup({ window: remote.getCurrentWindow() });
  //   };
  //   window.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     window.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // });
  const enterPressed = useKeyPress(13); //代表enter键
  const escPressed = useKeyPress(27); //代表esc键
  //键盘响应事件
  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    //当输入标题为空时不能进行enter操作
    if (enterPressed && editStatus && value.trim() !== "") {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editStatus) {
      closeSearch(editItem);
    }
    // const handleInputEvent = (event) => {
    //   const { keyCode } = event;
    //   if (keyCode === 13 && editStatus) {
    //     const editItem = files.find((file) => file.id === editStatus);
    //     onSaveEdit(editItem.id, value);
    //     setEditStatus(false);
    //     setValue("");
    //   } else if (keyCode === 27 && editStatus) {
    //     closeSearch(event);
    //   }
    // };
    // document.addEventListener("keyup", handleInputEvent);
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent);
    // };
  });
  //   useEffect(() => {
  //     if (editStatus) {
  //       node.current.focus();
  //     }
  //   }, [editStatus]);
  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    // console.log(newFile);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);
  return (
    <ul className="list-group list-group-flush file-list row">
      {files.map((file) => (
        <li
          className="list-group-item bg-light d-flex align-items-center file-item"
          key={file.id}
          data-id={file.id}
          data-title={file.title}
        >
          {file.id !== editStatus && !file.isNew && (
            <>
              <span className="col-2">
                <FontAwesomeIcon icon={faMarkdown} title="文档" />
              </span>
              <span
                className="col-6 c-link"
                onClick={() => {
                  onFileClick(file.id);
                }}
              >
                {file.title}
              </span>
              <button
                type="button"
                className="icon-button col-1"
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
              >
                <FontAwesomeIcon icon={faEdit} title="编辑" />
              </button>
              <button
                type="button"
                className="icon-button col-1"
                onClick={() => {
                  onFileDelete(file.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} title="删除" />
              </button>
            </>
          )}

          {(file.id === editStatus || file.isNew) && (
            <>
              <div className="d-flex justify-content-between align-items-center input-group-sm">
                <input
                  className="form-control col-10"
                  value={value}
                  placeholder="请输入新标题"
                  onChange={(e) => {
                    setValue(e.target.value);
                  }}
                ></input>
                <button
                  type="button"
                  className="icon-button col-2"
                  onClick={() => {
                    closeSearch(file);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} title="关闭" />
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};
FileList.propTypes = {
  fiels: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func,
};
export default FileList;
