import React from 'react';
import PropTypes from 'prop-types';

const Filter = (props) => {

  const onTextChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div className="filter-container">
      <label>{props.label}</label>
      <input type={props.type} min="0" placeholder={props.placeholder} onChange={onTextChange} />
    </div>
  );
};

Filter.propTypes = {
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string
};

Filter.defaultProps = {
  placeholder: '',
  type: 'text'
};

export default Filter;