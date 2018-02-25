import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

var defaultState = {
  todo: {
    items: []
  }
};


function addTodo(name, description) {
 return {
   type: 'ADD_TODO',
   name: name,
   description:description,
   completed: false
 };
}

function completeTodo(index) {
  return {
    type: 'COMPLETE_TODO',
    index: index
  };
}

function deleteTodo(index) {
  return {
    type: 'DELETE_TODO',
    index: index
  };
}

function clearTodo() {                                           //CLEAR ACTION THAT WILL BE SENT TO REDUCER
 return {
   type: 'CLEAR_TODO'
 };
}


function todoApp(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      var newState = Object.assign({}, state);
      newState.todo.items.push({
        name: action.name,
        description: action.description,
        completed: false
      });

      return newState;

    case 'COMPLETE_TODO':
      var newState = Object.assign({}, state);
      newState.todo.items[action.index].completed = true;
      return newState;

    case 'DELETE_TODO':
      var items = [].concat(state.todo.items);
      items.splice(action.index, 1);
      return Object.assign({}, state, {
        todo: {
          items: items
        }
      });

      case 'CLEAR_TODO':                                        //REDUCER THAT ACCEPTS THE CLEAR ACTION
        return Object.assign({}, state,{
          todo:{
            items:[]
          }
        });

    default:
      return state;
  }
};

var store = createStore(todoApp, defaultState);

class ClearButton extends React.Component{                      //INVOKE THE CLEAR METHOD AND RENDER THE CLEAR BUTTON
  clearTodo(){
    store.dispatch(clearTodo());
  }

  render(){
    return(
      <button onClick={this.clearTodo.bind(this)}>CLEAR LIST</button>
    );
  }
}

class AddTodoForm extends React.Component {

  constructor(props) { //class constructor to assign the initial this.state
    super(props);//call the base constructor with props
    this.state = {
      name: '',
      description: ''
    };
    this.onnameChanged=this.onnameChanged.bind(this);
    this.onDescriptionChanged=this.onDescriptionChanged.bind(this);
    this.onFormSubmit=this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addTodo(this.state.name, this.state.description));
    this.setState({ name: '' });
    this.setState({ description: '' });
  }

  onnameChanged(e) {
    this.setState({ name: e.target.value });
  }

  onDescriptionChanged(e) {
    this.setState({ description: e.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <input type="text" placeholder="Name"
               onChange={this.onnameChanged}
               value={this.state.name} />

        <input type="text" placeholder="Description"
              onChange={this.onDescriptionChanged}
              value={this.state.description} />
        <input type="submit" value="Add" />
      </form>
    );
  }
}

class TodoItem extends React.Component {
  onDeleteClick() {
    store.dispatch(deleteTodo(this.props.index));
  }

  onCompletedClick() {
    store.dispatch(completeTodo(this.props.index));
  }

  render() {
    return (
      <li>
        <a href="#" onClick={this.onCompletedClick.bind(this)}
           style={{textDecoration: this.props.completed ? 'line-through' : 'none'}}>
         {this.props.name}
         {this.props.description}

        </a>
        <a href="#" onClick={this.onDeleteClick.bind(this)}
           style={{textDecoration: 'none'}}>
         [X]
        </a>
      </li>

    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        items: state.todo.items
      });
    });
  }

  render() {
    var items = [];

    this.state.items.forEach((item, index) => {
      items.push(<TodoItem
        key={index}
        index={index}
        name={item.name}
        description={item.description}
        completed={item.completed}
      />);
    });

    if (!items.length) {
      return (
        <p>
          <i>Please add something to do.</i>
        </p>
      );
    }

    return (
      <ol>{ items }</ol>
    );
  }
}

ReactDOM.render(
  <div>
    <h1>Todo</h1>
    <AddTodoForm />
    <TodoList />
    <ClearButton />
  </div>,
  document.getElementById('app')
);
