import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './filters.css';
import Filter from './Filter';

class Filters extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: props.filters.name,
      age: props.filters.age
    }
  }

  onNameChanged = (name) => {
    this.setState({ name }, this.filterList);
  };

  onAgeChanged = (age) => {
    this.setState({ age }, this.filterList);
  };

  filterList = () => {
    let parsedAge = this.state.age;
    try {
      parsedAge = parseInt(this.state.age, 10);
    } catch (e) {
      parsedAge = undefined;
    }
    this.props.onFilter(this.state.name, parsedAge);
  };

  render() {
    const { name, age } = this.state;
    return (
      <div className="filter-container">
        <Filter label="Filter by name:" value={name} placeholder="name..." onChange={this.onNameChanged} />
        <Filter label="Filter by age:" type="number" value={age} placeholder="age..." onChange={this.onAgeChanged} />
      </div>
    );
  }
}

Filters.propTypes = {
  onFilter: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.number,
  })
};

Filters.defaultProps = {};

export default Filters;