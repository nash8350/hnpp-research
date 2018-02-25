import React from 'react';
import Content, { HTMLContent } from '../components/Content';

export default () => (
    <div className="container">
      <h1 className="is-size-6 has-text-weight-bold is-bold-light vert-padded">Date</h1>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value=""/>
            <span className="horiz-padded">All time</span>
          </label>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value="2010"/>
            <span className="horiz-padded">Since 2010</span>
          </label>
        </div>
      </div>
      <div className="field">
        <div className="control">
          <label className="radio">
            <input type="radio" name="date" value="2000"/>
            <span className="horiz-padded">Since 2000</span>
          </label>
        </div>
      </div>
    </div>
);
