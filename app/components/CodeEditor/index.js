
import '!style!css!./lint.css';
import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import 'codemirror/addon/lint/lint.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import 'codemirror/keymap/vim.js';
import styles from './styles.css';
import canControl from '../../computed/canControl';

const loadedLinters = ['js'];

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
    this.onUpdateLinting = this.onUpdateLinting.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.isLoadingBin || this.props.isRunning || !this.props.canControl) {
      this.codemirror.setOption('readOnly', this.props.canControl ? true : 'nocursor');
    } else {
      this.codemirror.setOption('readOnly', false);
    }
    if (
      this.props.selectedFileIndex !== prevProps.selectedFileIndex ||
      (!prevProps.forceUpdateCode && this.props.forceUpdateCode) ||
      (
        !this.props.canControl &&
        prevProps.files[prevProps.selectedFileIndex].content !== this.props.files[this.props.selectedFileIndex].content
      ) ||
      this.props.files.length !== prevProps.files.length

    ) {
      this.setModeAndLinter();
      this.setEditorValue(this.props.selectedFileIndex === -1 ? '' : this.props.files[this.props.selectedFileIndex].content);
      this.codemirror.getDoc().clearHistory();
    }

    if (this.props.vimMode) {
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'default');
    }
  }
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: this.props.selectedFileIndex === -1 ? '' : this.props.files[this.props.selectedFileIndex].content,
      mode: this.getMode(),
      theme: 'learncode',
      matchTags: {bothTags: true},
      autoCloseTags: true,
      gutters: ['CodeMirror-lint-markers'],
      lint: false,
      lineNumbers: true,
      indentUnit: 2,
      extraKeys: {
        Tab(cm) {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
          cm.replaceSelection(spaces);
        }
      }
    });
    this.codemirror.on('change', this.onCodeChange);
    this.setModeAndLinter();
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
      case 'coffee':
        return 'text/x-coffeescript';
      case 'less':
        return 'text/x-less';
      case 'scss':
        return 'text/x-sass';
      case 'html':
        return 'htmlmixed';
      case 'json':
        return 'application/json';
      case 'jade':
        return {name: 'jade', alignCDATA: true};
      case 'handlebars':
        return {name: 'handlebars', base: 'text/html'};
      default:
        return 'jsx';
    }
  }
  setModeAndLinter() {
    const mode = this.getMode();

    // JavaScript (eslint with JSX)
    if (mode === 'jsx') {

      const setJsxModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/jsx/jsx.js');
        const eslint = require('./linters/jsx');
        const linter = require('./js-lint.js');
        this.codemirror.setOption('lint', {
          getAnnotations: linter(CodeMirror, eslint),
          onUpdateLinting: this.onUpdateLinting
        });
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setJsxModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested();
        return require.ensure([], () => {
          setJsxModeAndLinter();
          this.props.signals.bin.linterLoaded();
        });
      }

    }

    if (mode === 'css') {

      const setCssModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/css/css.js');
        const lintExport = require('./linters/css.js');
        window.CSSLint = lintExport.CSSLint;
        const linter = require('codemirror/addon/lint/css-lint.js');
        this.codemirror.setOption('lint',  {
          onUpdateLinting: this.onUpdateLinting
        });
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setCssModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested();
        return require.ensure([], () => {
          setCssModeAndLinter();
          this.props.signals.bin.linterLoaded();
        });
      }

    }

    if (mode === 'text/typescript') {

      const setTypescriptModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/javascript/javascript.js');
        this.codemirror.setOption('lint', false);
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setTypescriptModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested({noLint: true});
        return require.ensure([], () => {
          setTypescriptModeAndLinter();
          this.props.signals.bin.linterLoaded({noLint: true});
        });
      }

    }

    if (mode === 'text/x-coffeescript' && loadedLinters.indexOf(mode) === -1) {

      const setCoffeeModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/coffeescript/coffeescript.js');
        window.CoffeeScript = require('./coffee-script');
        const coffeeLint = require('coffeelint');
        const linter = require('./coffee-lint.js');
        this.codemirror.setOption('lint', {
          getAnnotations: linter(CodeMirror, coffeeLint),
          onUpdateLinting: this.onUpdateLinting
        });
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
        this.props.signals.bin.linterLoaded();
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setCoffeeModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested();
        return require.ensure([], () => {
          setCoffeeModeAndLinter();
          this.props.signals.bin.linterLoaded();
        });
      }

    }

    if (mode === 'text/x-less') {
      const setLessModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/css/css.js');
        this.codemirror.setOption('lint', false);
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setLessModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested({noLint: true});
        return require.ensure([], () => {
          setLessModeAndLinter();
          this.props.signals.bin.linterLoaded({noLint: true});
        });
      }

    }

    if (mode === 'text/x-sass') {

      const setSassModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/sass/sass.js');
        this.codemirror.setOption('lint', false);
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setSassModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested({noLint: true});
        return require.ensure([], () => {
          setSassModeAndLinter();
          this.props.signals.bin.linterLoaded({noLint: true});
        });
      }

    }

    if (mode === 'htmlmixed') {

      const setHtmlModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/htmlmixed/htmlmixed.js');
        require('codemirror/addon/edit/matchtags.js');
        require('codemirror/addon/edit/closetag.js');
        const htmlhint = require('htmlhint');
        const linter = require('./html-lint.js');
        this.codemirror.setOption('lint', {
          getAnnotations: linter(CodeMirror, htmlhint.HTMLHint),
          onUpdateLinting: this.onUpdateLinting
        });
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setHtmlModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested();
        return require.ensure([], () => {
          setHtmlModeAndLinter();
          this.props.signals.bin.linterLoaded();
        });
      }

    }

    if (mode === 'application/json') {

      const setJsonModeAndLinter = function () {
        loadedLinters.push(mode);
        require('codemirror/mode/javascript/javascript.js');
        const jsonLint = require('./linters/json.js');
        const linter = require('./json-lint.js');
        this.codemirror.setOption('lint', {
          getAnnotations: linter(CodeMirror, jsonLint),
          onUpdateLinting: this.onUpdateLinting
        });
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setJsonModeAndLinter();
      } else {
        this.props.signals.bin.linterRequested();
        return require.ensure([], () => {
          setJsonModeAndLinter();
          this.props.signals.bin.linterLoaded();
        });
      }

    }

    if (mode.name === 'jade') {

      const setJadeMode = function () {
        require('codemirror/mode/jade/jade.js');
        this.codemirror.setOption('lint', false);
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setJadeMode();
      } else {
        this.props.signals.bin.linterRequested({noLint: true});
        return require.ensure([], () => {
          setJadeMode();
          this.props.signals.bin.linterLoaded({noLint: true});
        });
      }

    }

    if (mode.name === 'handlebars') {

      const setHandlebarsMode = function () {
        require('codemirror/mode/handlebars/handlebars.js');
        this.codemirror.setOption('lint', false);
        this.codemirror.setOption('mode', mode);
        this.setEditorValue(this.codemirror.getValue());
      }.bind(this);

      if (loadedLinters.indexOf(mode) >= 0) {
        setHandlebarsMode();
      } else {
        this.props.signals.bin.linterRequested({noLint: true});
        return require.ensure([], () => {
          setHandlebarsMode();
          this.props.signals.bin.linterLoaded({noLint: true});
        });
      }

    }

    this.codemirror.setOption('mode', mode);

    return false;
  }
  onUpdateLinting(errors) {
    this.props.signals.bin.linted({
      isValid: !Boolean(errors.length)
    });
  }
  onCodeChange(instance, event) {
    if (!this.isUpdatingCode) {
      if (event.text.length === 2) {
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
        <div style={{flex: 1, height: '100%'}} ref="code"></div>
      </div>
    );
  }
}

export default CodeEditor;
