import React from 'react';
import { Route } from 'react-router'
import App from './default.jsx'
import About from './about.jsx'

export default (
  <Route path="/" component={App}>
    <Route path="about" component={About} />
  </Route>
)
