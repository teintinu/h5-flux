
import React = require('react')

//import { TodoTextInput } from 'todotextinput';

function newtodo(x:string) {

    var newtodo = React.createClass(
      <__React.ComponentSpec<{},{}>>
      {
        render: function() {
            return React.createElement('header', null, React.createElement('h1', null, x))
        },
        clickHandle: function () {
            x="1";
            this.setState({})
        }
    })

    return newtodo
}
