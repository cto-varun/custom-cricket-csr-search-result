"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = templateComponent;
var _react = _interopRequireWildcard(require("react"));
var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));
var _merge = _interopRequireDefault(require("lodash/merge"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const {
  hasOwnProperty
} = Object.prototype;
function templateComponent(props) {
  const {
    properties,
    component,
    data = [],
    store = {},
    responseData = [],
    loading = undefined,
    error = undefined,
    payload = undefined,
    templateClassName,
    workflow = []
  } = props;
  const [externalData, updateExternalData] = (0, _react.useState)({});
  const [updateTemplateCount, setUpdateTemplateCount] = (0, _react.useState)(0);
  function updateTemplateData(input) {
    let shouldOverwrite = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const clonedOldObj = (0, _cloneDeep.default)(externalData);
    let mergedObj;
    // If the input is an object, merge it with the existing object.
    if (typeof input === 'object') {
      if (shouldOverwrite) {
        mergedObj = input;
      } else {
        mergedObj = (0, _merge.default)(clonedOldObj, input);
      }
    }
    // Otherwise increment the count by one and assign the input to that key.
    else {
      mergedObj = (0, _merge.default)(clonedOldObj, {
        [updateTemplateCount]: input
      });
      setUpdateTemplateCount(updateTemplateCount + 1);
    }
    updateExternalData(mergedObj);
  }
  (0, _react.useEffect)(() => {
    if (workflow.length > 0) {
      workflow.map(item => {
        if (hasOwnProperty.call(item, 'didMountWorkflowData')) {
          updateTemplateData(item.didMountWorkflowData);
        }
        return item;
      });
    }
  }, []);
  function resetTemplateData() {
    updateExternalData({});
    setUpdateTemplateCount(0);
  }
  (0, _react.useEffect)(() => {
    if (component && component.id) {
      window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`] = updateTemplateData;
      window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`] = resetTemplateData;
    }
    return () => {
      if (component && component.id) {
        delete window[window.sessionStorage?.tabId][`${component.id}updateTemplateData`];
        delete window[window.sessionStorage?.tabId][`${component.id}resetTemplateData`];
      }
    };
  });
  function getContent() {
    if (externalData && externalData.type) {
      if (externalData.type === 'error') {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: "imei-search--error"
        }, externalData.message);
      }
      if (externalData.type === 'success') {
        return /*#__PURE__*/_react.default.createElement("div", {
          className: "imei-search--success"
        }, externalData.message, ' ');
      }
      if (externalData.type == '') {
        {
          return /*#__PURE__*/_react.default.createElement("div", null, externalData.message);
        }
      }
    }
    return null;
  }
  const ui = getContent();
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: templateClassName && templateClassName ? templateClassName : 'template-component'
  }, ui));
}
module.exports = exports.default;