import React from 'react';
import ReactDOM from 'react-dom';
import {ReactRoot} from "../react-root";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ReactRoot />, div);
  ReactDOM.unmountComponentAtNode(div);
});
