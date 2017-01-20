
import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import styles from './styles.css';
import canControl from '../../computed/canControl';

const loadedModes = ['js'];

@Cerebral({
  selectedFileIndex: 'bin.selectedFileIndex',
  files: 'bin.currentBin.files',
  isLoadingBin: 'bin.isLoadingBin',
  isRunning: 'bin.isRunning',
  forceUpdateCode: 'bin.forceUpdateCode',
  vimMode: 'bin.vimMode',
  hasJoinedLive: 'live.hasJoined',
  canControl: canControl
})
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onCodeChange = this.onCodeChange.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (
      this.props.selectedFileIndex !== prevProps.selectedFileIndex ||
      (!prevProps.forceUpdateCode && this.props.forceUpdateCode) ||
      (
        !this.props.canControl &&
        prevProps.files[prevProps.selectedFileIndex].content !== this.props.files[this.props.selectedFileIndex].content
      ) ||
      this.props.files.length !== prevProps.files.length

    ) {
      this.setMode();
      this.setEditorValue(this.props.selectedFileIndex === -1 ? '' : this.props.files[this.props.selectedFileIndex].content);
      this.codemirror.getDoc().clearHistory();
    }

  }
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: this.props.selectedFileIndex === -1 ? '' : this.props.files[this.props.selectedFileIndex].content,
      mode: this.getMode(),
      theme: 'learncode',
      matchTags: {bothTags: true},
      lint: false,
      lineNumbers: true,
      readOnly: true,
      indentUnit: 2
    });
    this.codemirror.on('change', this.onCodeChange);
    this.setMode();
  }
  setEditorValue(value) {
    this.isUpdatingCode = true;
    this.codemirror.setValue(value);
    this.isUpdatingCode = false;
  }
  getMode() {
    if (this.props.selectedFileIndex === -1) {
      return 'jsx';
    }
    const name = this.props.files[this.props.selectedFileIndex].name;
    const ext = name.split('.')[name.split('.').length - 1];
    switch (ext) {
      case 'js':
        return 'jsx';
      case 'css':
        return 'css';
      case 'ts':
        return 'text/typescript';
      case 'tsx':
        return 'text/typescript';
      case 'coffee':
        return 'text/x-coffeescript';
      case 'less':
        return 'text/x-less';
      case 'scss':
        return 'text/x-sass';
      case 'styl':
        return 'text/x-styl';
      case 'html':
        return 'htmlmixed';
      case 'vue':
        return 'htmlmixed';
      case 'json':
        return 'application/json';
      case 'jade':
        return {name: 'jade', alignCDATA: true};
      case 'handlebars':
        return {name: 'handlebars', base: 'text/html'};
      default:
        return false;
    }
  }
  setMode() {
    const mode = this.getMode();

    // JavaScript (eslint with JSX)
    if (mode === 'jsx') {

      const setJsxMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/jsx/jsx.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setJsxMode();
      } else {
        return require.ensure([], () => {
          setJsxMode();
        });
      }

    }

    if (mode === 'css') {

      const setCssMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/css/css.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setCssMode();
      } else {
        return require.ensure([], () => {
          setCssMode();
        });
      }

    }

    if (mode === 'text/typescript') {

      const setTypescriptMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/javascript/javascript.js');;
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setTypescriptMode();
      } else {
        return require.ensure([], () => {
          setTypescriptMode();
        });
      }

    }

    if (mode === 'text/x-coffeescript') {

      const setCoffeeMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/coffeescript/coffeescript.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setCoffeeMode();
      } else {
        return require.ensure([], () => {
          setCoffeeMode();
        });
      }

    }

    if (mode === 'text/x-less') {
      const setLessMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/css/css.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setLessMode();
      } else {
        return require.ensure([], () => {
          setLessMode();
        });
      }

    }

    if (mode === 'text/x-sass') {

      const setSassMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/sass/sass.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setSassMode();
      } else {
        return require.ensure([], () => {
          setSassMode();
        });
      }

    }

    if (mode === 'text/x-styl') {

      const setStylusMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/stylus/stylus.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setStylusMode();
      } else {
        return require.ensure([], () => {
          setStylusMode();
        });
      }

    }

    if (mode === 'htmlmixed') {

      const setHtmlMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/htmlmixed/htmlmixed.js');
        require('codemirror/addon/edit/matchtags.js');
        require('codemirror/addon/edit/closetag.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setHtmlMode();
      } else {
        return require.ensure([], () => {
          setHtmlMode();
        });
      }

    }

    if (mode === 'application/json') {

      const setJsonMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/javascript/javascript.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        return setJsonMode();
      } else {
        return require.ensure([], () => {
          setJsonMode();
        });
      }

    }

    if (mode.name === 'jade') {

      const setJadeMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/jade/jade.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedModes.indexOf(mode) >= 0) {
        return setJadeMode();
      } else {
        return require.ensure([], () => {
          setJadeMode();
        });
      }

    }

    if (mode.name === 'handlebars') {

      const setHandlebarsMode = function () {
        loadedModes.push(mode);
        require('codemirror/mode/handlebars/handlebars.js');
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        return setHandlebarsMode();
      } else {
        return require.ensure([], () => {
          setHandlebarsMode();
        });
      }

    }

    this.codemirror.setOption('lint', false);
    this.codemirror.setOption('mode', mode);

  }
  onCodeChange(instance, event) {
    if (!this.isUpdatingCode) {
      if (event.text.length === 2 && !event.text[0] && !event.text[1]) {
        event.text = ['\n'];
      }

      this.props.signals.bin.codeChanged({
        from: event.from,
        to: event.to,
        text: event.text
      });
    }
  }
  render() {
    return (
      <div className={styles.wrapper}>
        <div style={{height: '100%'}} ref="code"></div>
      </div>
    );
  }
}

export default CodeEditor;
