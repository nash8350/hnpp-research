import React from 'react';
import Content, { HTMLContent } from '../components/Content';

const handleKeyPress = (event, onFilterChange) => {
  if(event.key == 'Enter'){
    onFilterChange(event);
  }
}

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

export default ({date, search, category, onFilterChange}) => (
  <div>
    <div className="field">
      <label className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Search</label>
      <div className="control">
        <input type="text" name="search" className="search-box" onKeyPress={(e) => handleKeyPress(e, onFilterChange)} />
      </div>
    </div>
    <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Categories</h1>
    <div className="field">
      <div className="control">
        <label className="radio">
          <input type="radio" name="category" value="" checked={category == ""} onChange={onFilterChange}/>
          <span className="horiz-padded">Show all</span>
        </label>
      </div>
    </div>
    {categories.map(categoryName => (
      <div className="field" key={categoryName}>
        <div className="control">
          <label className="radio">
            <input type="radio" name="category" value={categoryName} checked={category == categoryName} onChange={onFilterChange}/>
            <span className="horiz-padded">{categoryName}</span>
          </label>
        </div>
      </div>
    ))}
    <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Date</h1>
    <div className="field">
      <div className="control">
        <label className="radio">
          <input type="radio" name="date" value="" checked={date == ""} onChange={onFilterChange}/>
          <span className="horiz-padded">All time</span>
        </label>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <label className="radio">
          <input type="radio" name="date" value="2010" checked={date == "2010"} onChange={onFilterChange}/>
          <span className="horiz-padded">Since 2010</span>
        </label>
      </div>
    </div>
    <div className="field">
      <div className="control">
        <label className="radio">
          <input type="radio" name="date" value="2000" checked={date == "2000"} onChange={onFilterChange}/>
          <span className="horiz-padded">Since 2000</span>
        </label>
      </div>
    </div>
  </div>
);
