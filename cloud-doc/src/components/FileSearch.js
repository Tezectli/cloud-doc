import React, { Component, useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../hooks/useKeyPress";
const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  let node = useRef(null);

  const closeSearch = () => {
    setInputActive(false);
    setValue("");
    onFileSearch("");
  };
  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value);
    }
    if (escPressed && inputActive) {
      closeSearch();
    }
    // const handleInputEvent = (event) => {
    //   const { keyCode } = event;
    //   if (keyCode === 13 && inputActive) {
    //     onFileSearch(value);
    //   } else if (keyCode === 27 && inputActive) {
    //     closeSearch(event);
    //   }
    // };
    // document.addEventListener("keyup", handleInputEvent);
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent);
    // };
  });
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);
  return (
    <div className="d-flex leftHeight align-items-center">
      {!inputActive && (
        <div className="d-flex justify-content-between align-items-center">
          <span className="">{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => {
              setInputActive(true);
            }}
          >
            <FontAwesomeIcon icon={faSearch} title="搜索" />
            {/* 搜索 */}
          </button>
        </div>
      )}
      {inputActive && (
        <div className="d-flex justify-content-between align-items-center input-group-sm">
          <input
            className="form-control"
            value={value}
            ref={node}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          ></input>
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon icon={faTimes} title="关闭" />
          </button>
        </div>
      )}
    </div>
  );
};
//React类型检查
FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
};
//React默认属性
FileSearch.defaultProps = {
  title: "我的啦啦啦啦啦",
};
export default FileSearch;
