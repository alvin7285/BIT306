import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import ImageUploader from 'react-image-uploader';

var defaultState = {
  product: {
    items: []
  }
};


function addProduct(picture, name, description, price, category, quantity) {
 return {
   type: 'ADD_PRODUCT',
   picture: picture,
   name: name,
   description: description,
   price: price,
   category: category,
   quantity: quantity,
   completed: false
 };
}

function deleteProduct(index) {
  return {
    type: 'DELETE_PRODUCT',
    index: index
  };
}

function clearProduct() {                                           //CLEAR ACTION THAT WILL BE SENT TO REDUCER
 return {
   type: 'CLEAR_PRODUCT'
 };
}


function productApp(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      var newState = Object.assign({}, state);
      newState.product.items.push({
        picture: action.picture,
        name: action.name,
        description: action.description,
        price: action.price,
        category: action.category,
        quantity: action.quantity,
      });
      return newState;

    case 'DELETE_PRODUCT':
      var items = [].concat(state.product.items);
      items.splice(action.index, 1);
      return Object.assign({}, state, {
        product: {
          items: items
        }
      });

      case 'CLEAR_PRODUCT':                                        //REDUCER THAT ACCEPTS THE CLEAR ACTION
        return Object.assign({}, state,{
          product:{
            items:[]
          }
        });

    default:
      return state;
  }
};

var store = createStore(productApp, defaultState);

class ClearButton extends React.Component{                      //INVOKE THE CLEAR METHOD AND RENDER THE CLEAR BUTTON
  clearProduct(){
    store.dispatch(clearProduct());
  }

  render(){
    return(
      <button onClick={this.clearProduct.bind(this)}>CLEAR LIST</button>
    );
  }
}

class AddProductForm extends React.Component {

  constructor(props) { //class constructor to assign the initial this.state
    super(props);//call the base constructor with props
    this.state = {
      picture: [],
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: ''
    };
    this.onDrop = this.onDrop.bind(this);
    this.onNameChanged=this.onNameChanged.bind(this);
    this.onDescriptionChanged=this.onDescriptionChanged.bind(this);
    this.onPriceChanged=this.onPriceChanged.bind(this);
    this.onCategoryChanged=this.onCategoryChanged.bind(this);
    this.onQuantityChanged=this.onQuantityChanged.bind(this);
    this.onFormSubmit=this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addProduct(this.state.picture, this.state.name, this.state.description, this.state.price, this.state.category, this.state.quantity));
    this.setState({ picture: []});
    this.setState({ name: '' });
    this.setState({ description: '' });
    this.setState({ price: ''});
    this.setState({ category: ''});
    this.setState({ quantity: ''});
  }

  onDrop(picture) {
    console.log(picture);
    this.setState({
      picture: this.state.picture.concat(picture),
    });
  }

  onNameChanged(e) {
    this.setState({ name: e.target.value });
  }

  onDescriptionChanged(e) {
    this.setState({ description: e.target.value });
  }

  onPriceChanged(e) {
    this.setState({ price: e.target.value });
  }

  onCategoryChanged(e) {
    this.setState({ category: e.target.value });
  }

  onQuantityChanged(e) {
    this.setState({ quantity: e.target.value });
  }

  render() {
    return (

      <form onSubmit={this.onFormSubmit}>
        <ImageUploader onUpload={this.onDrop}/>

        <input type="text" id ="textbox" placeholder="Name"
               onChange={this.onNameChanged}
               value={this.state.name} />

        <input type="text" id ="textbox" placeholder="Description"
              onChange={this.onDescriptionChanged}
              value={this.state.description} />


        <input type="float" id ="textbox" placeholder="Price"
              onChange={this.onPriceChanged}
              value={this.state.price} />

        <input type="text" id ="textbox" placeholder="Category"
              onChange={this.onCategoryChanged}
              value={this.state.category} />

        <input type="number" id ="textbox" placeholder="Quantity"
              onChange={this.onQuantityChanged}
              value={this.state.quantity} />

        <input type="submit" value="Add" />
      </form>
    );
  }
}

class ProductItem extends React.Component {
  onDeleteClick() {
    store.dispatch(deleteProduct(this.props.index));
  }

  onCompletedClick() {
    store.dispatch(completeProduct(this.props.index));
  }

  render() {
    var product = [console.log(picture),
                  this.props.name,
                  this.props.description,
                  this.props.price,
                  this.props.category,
                  this.props.quantity,
                  <a href="#" onClick={this.onDeleteClick.bind(this)}
                     style={{textDecoration: 'none'}}>
                   [X]
                  </a>];
    return (
         <ol> {product} </ol>


    );
  }
}

class ProductList extends React.Component {
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
        items: state.product.items
      });
    });
  }

  render() {
    var items = [];

    this.state.items.forEach((item, index) => {
      items.push(<ProductItem
        key={index}
        index={index}
        picture={item.picture}
        name={item.name}
        description={item.description}
        price={item.price}
        category={item.category}
        quantity={item.quantity}
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
    <h1>Product</h1>
    <AddProductForm />
    <ProductList />
    <ClearButton />
  </div>,
  document.getElementById('app')
);
