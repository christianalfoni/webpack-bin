import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import styles from './styles.css';
import {
  isObject,
  isArray,
  isString,
  isBoolean,
  isNumber,
  isNull,
  isError,
  isFunction,
  isCircular
} from './utils';

function renderType(props) {
  if (props.value === undefined) {
    return null;
  }

  if (isError(props.value)) {
    return <ErrorValue {...props}/>
  }

  if (isFunction(props.value)) {
    return <FunctionValue {...props}/>
  }

  if (isCircular(props.value)) {
    return <CircularValue {...props}/>
  }

  if (isArray(props.value.value)) {
    return (
      <ArrayValue {...props}/>
    );
  }
  if (isObject(props.value.value)) {
    return (
      <ObjectValue {...props}/>
    );
  }

  return (
    <Value {...props}/>
  );

}

function ObjectValue(props) {
  const renderProperty = (key, value, index, hasNext) => {
    return (
      <div className={styles.objectProperty} key={index}>
        <div className={styles.objectPropertyValue}>{renderType({
          ...props,
          path: props.path.concat('value', key),
          value: value,
          hasNext: hasNext,
          propertyKey: key
        })}</div>
      </div>
    );
  };

  const renderKeys = (keys) => {
    if (keys.length > 3) {
      return keys.slice(0, 3).join(', ') + '...'
    }
    return keys.join(', ');
  };

  const {value, hasNext, path, highlight} = props;
  const isSelected = String(props.selectedPath) === String(path);

  if (value.isCollapsed) {
    return (
      <div
        className={highlight && isSelected ? styles.highlightObject : styles.object}
        onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}>
        {props.propertyKey ? props.propertyKey + ': ' : null}
        <strong>{'{ '}</strong>{renderKeys(Object.keys(value.value))}<strong>{' }'}</strong>
        {hasNext ? ',' : null}
      </div>
    );
  } else if (props.propertyKey) {
    const keys = Object.keys(value.value);
    return (
      <div className={highlight && isSelected ? styles.highlightObject : styles.object}>
        <div onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}>{props.propertyKey}: <strong>{'{ '}</strong></div>
        {keys.map((key, index) => renderProperty(key, value.value[key], index, index < keys.length - 1))}
        <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
      </div>
    );
  } else {
    const keys = Object.keys(value.value);
    return (
      <div className={highlight && isSelected ? styles.highlightObject : styles.object}>
        <div onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}><strong>{'{ '}</strong></div>
        {keys.map((key, index) => renderProperty(key, value.value[key], index, index < keys.length - 1))}
        <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
      </div>
    );
  }
}

function ArrayValue(props) {

  const renderItem = (item, index, hasNext) => {
    return (
      <div className={styles.arrayItem} key={index}>
        {renderType({
          ...props,
          propertyKey: null,
          path: props.path.concat('value', index),
          value: item,
          hasNext: hasNext
        })}
      </div>
    );
  }
  const {value, hasNext, path, highlight} = props;
  const isSelected = String(props.selectedPath) === String(path);

  if (value.isCollapsed) {
    return (
      <div
        className={highlight && isSelected ? styles.highlightArray : styles.array}
        onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}>
        {props.propertyKey ? props.propertyKey + ': ' : null}
        <strong>{'[ '}</strong>{value.value.length}<strong>{' ]'}</strong>
        {hasNext ? ',' : null}
      </div>
    );
  } else if (props.propertyKey) {
    return (
      <div className={highlight && isSelected ? styles.highlightArray : styles.array}>
        <div onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}>{props.propertyKey}: <strong>{'[ '}</strong></div>
        {value.value.map((item, index) => renderItem(item, index, index < value.value.length - 1))}
        <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
      </div>
    );
  } else {
    return (
      <div className={highlight && isSelected ? styles.highlightArray : styles.array}>
        <div onClick={() => !highlight || isSelected ? props.onTogglePath({path}) : props.onSelectPath({path})}><strong>{'[ '}</strong></div>
        {value.value.map((item, index) => renderItem(item, index, index < value.value.length - 1))}
        <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
      </div>
    );
  }
}

function ErrorValue(props) {
  return (
    <div className={styles.error}>
      {props.value.message}
    </div>
  );
}

function Value(props) {
  let className = styles.string;
  const isSelected = String(props.selectedPath) === String(props.path);
  if (isNumber(props.value)) className = styles.number;
  if (isBoolean(props.value)) className = styles.boolean;
  if (isNull(props.value)) className = styles.null;
  return (
    <div className={className}>
      <div onClick={() => props.onSelectPath({path: props.path})} className={props.highlight && isSelected ? styles.highlightValue : null}>
        {props.propertyKey ? props.propertyKey + ': ' : <span/>}
        <span>{isString(props.value) ? '"' + props.value + '"' : String(props.value)}</span>
        {props.hasNext ? ',' : null}
      </div>
    </div>
  );
}

function FunctionValue(props) {
  const isSelected = String(props.selectedPath) === String(props.path);
  return (
    <div onClick={() => props.onSelectPath({path: props.path})} className={props.highlight && isSelected ? styles.highlightFunction : null}>
      {props.propertyKey ? props.propertyKey + ': ' : <span/>}
      <span className={styles.functionKeyword}>function </span>
      <span className={styles.functionName}>{props.value.name}</span>
      {props.hasNext ? ',' : null}
    </div>
  );
}

function CircularValue(props) {
  const isSelected = String(props.selectedPath) === String(props.path);
  return (
    <div onClick={() => props.onSelectPath({path: props.path})} className={props.highlight && isSelected ? styles.highlightFunction : null}>
      {props.propertyKey ? props.propertyKey + ': ' : <span/>}
      <span className={styles.circular}>[Circular]</span>
      {props.hasNext ? ',' : null}
    </div>
  );
}

function Inspector(props) {
  return renderType({
    value: props.value,
    propertyKey: null,
    hasNext: false,
    path: props.path,
    highlight: props.highlight,
    onTogglePath: props.onTogglePath,
    onSelectPath: props.onSelectPath,
    selectedPath: props.selectedPath
  });
}
export default Inspector;
