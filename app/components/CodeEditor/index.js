
import '!style!css!./lint.css';
import '!style!css!./../../../node_modules/codemirror/lib/codemirror.css';
import '!style!css!./CodeEditorStyle.css';
import 'codemirror/addon/lint/lint.js';
import React, { PropTypes } from 'react';
import { Decorator as Cerebral, Link } from 'cerebral-view-react';
import CodeMirror from 'codemirror';
import 'codemirror/keymap/vim.js';
import styles from './styles.css';

const loadedLinters = ['js'];

@Cerebral({
  selectedFileIndex: 'bin.selectedFileIndex',
  files: 'bin.currentBin.files',
  isLoadingBin: 'bin.isLoadingBin',
  isRunning: 'bin.isRunning',
  forceUpdateCode: 'bin.forceUpdateCode',
  vimMode: 'bin.vimMode'
})
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onCodeChange = this.onCodeChange.bind(this);
    this.onUpdateLinting = this.onUpdateLinting.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (this.props.isLoadingBin || this.props.isRunning) {
      this.codemirror.setOption('readOnly', true);
    } else {
      this.codemirror.setOption('readOnly', false);
    }
    if (
      this.props.selectedFileIndex !== prevProps.selectedFileIndex ||
      (prevProps.isLoadingBin && !this.props.isLoadingBin) ||
      (!prevProps.forceUpdateCode && this.props.forceUpdateCode)
    ) {
      this.setModeAndLinter();
      this.codemirror.setValue(this.props.files[this.props.selectedFileIndex].content);
    }

    if (this.props.vimMode) {
      this.codemirror.setOption('keyMap', 'vim');
    } else {
      this.codemirror.setOption('keyMap', 'default');
    }
  }
  componentDidMount() {
    this.codemirror = CodeMirror(this.refs.code, {
      value: this.props.files[this.props.selectedFileIndex].content,
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
  getMode() {
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
      case 'elm':
        return 'elm';
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
        this.codemirror.setValue(this.codemirror.getValue());
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
        this.codemirror.setValue(this.codemirror.getValue());
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
        this.codemirror.setValue(this.codemirror.getValue());
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
        this.codemirror.setValue(this.codemirror.getValue());
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

    this.codemirror.setOption('mode', mode);

    return false;
  }
  onUpdateLinting(errors) {
    this.props.signals.bin.linted({
      isValid: !Boolean(errors.length)
    });
  }
  onCodeChange() {
    this.props.signals.bin.codeChanged({
      code: this.codemirror.getDoc().getValue()
    });
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
