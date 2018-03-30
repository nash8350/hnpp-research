import React from 'react';
import ArrowDropDown from 'material-ui-icons/ArrowDropDown';

const categories = [
  "Symptoms",
  "Diagnosis",
  "Case Studies",
  "Prevalence",
  "Genetics",
  "Physiopathology",
  "Biochemistry",
  "Therapies"
]

export default class CitationTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableWidth = 800;
    this.state = {
      showFilters: false
    }
  }

  handleKeyPress = (event, onFilterChange) => {
    if(event.key == 'Enter'){
      onFilterChange(event);
    }
  }
  
  handleFilterClick = (event) =>{
    this.setState({
      showFilters: !this.state.showFilters
    })
  }

  render() {
    return (
  <div>
    <div className="is-hidden-desktop" style={{padding: "0 0 1em 0"}}>
      <button className="button" onClick={this.handleFilterClick}>
        <span>Filter</span>
        <span className="icon is-small">
          <ArrowDropDown/>
        </span>
      </button>
    </div>
    <div className={this.state.showFilters ? "" : "is-hidden-touch"}>
      <div className="field">
        <label className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Search</label>
        <div className="control">
          <input type="text" name="search" className="search-box" onKeyPress={(e) => handleKeyPress(e, this.props.onFilterChange)} />
        </div>
      </div>
      <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Categories</h1>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="category" value="" checked={this.props.category == ""} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">Show all</span>
          </label>
        </div>
      </div>
      {categories.map(categoryName => (
        <div className="field" key={categoryName}>
          <div className="control">
            <label className="radio">
              <input type="radio" name="category" value={categoryName} checked={this.props.category == categoryName} onChange={this.props.onFilterChange}/>
              <span className="horiz-padded">{categoryName}</span>
            </label>
          </div>
        </div>
      ))}
      <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Date</h1>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value="" checked={this.props.date == ""} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">All time</span>
          </label>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value="2010" checked={this.props.date == "2010"} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">Since 2010</span>
          </label>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value="2000" checked={this.props.date == "2000"} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">Since 2000</span>
          </label>
        </div>
      </div>
      <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Availability</h1>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="availability" value="" checked={this.props.availability == ""} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">All</span>
          </label>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="availability" value="free" checked={this.props.availability == "free"} onChange={this.props.onFilterChange}/>
            <span className="horiz-padded">Free full text</span>
          </label>
        </div>
      </div>
    </div>
  </div>
    )
  }
}
