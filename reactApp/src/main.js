import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import styles from './main.css';
import PropTypes from 'prop-types';
import ImageUploader from 'react-image-uploader';

var defaultState = {
  product: {
    items: []
  }
};


function addProduct(image, name, description, price, category, quantity) {
 return {
   type: 'ADD_PRODUCT',
   image: image,
   name: name,
   description: description,
   price: price,
   category: category,
   quantity: quantity,
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
        image: action.image,
        name: action.name,
        description: action.description,
        price: action.price,
        category: action.category,
        quantity: action.quantity
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
      <button id="delete" onClick={this.clearProduct.bind(this)}>CLEAR LIST</button>
    );
  }
}

class ImageUpload extends React.Component {

    constructor(props) {
        super(props);
         this.state = { pictures: [] };
         this.onDrop = this.onDrop.bind(this);
    }

    onDrop(picture) {
      console.log(picture);
        this.setState({
            pictures: this.state.pictures,
        });

    }

    render() {
        return (
            <ImageUploader

            />
        );
    }
}


class AddProductForm extends React.Component {

  constructor(props) { //class constructor to assign the initial this.state
    super(props);//call the base constructor with props
    this.state = {
      image: [],
      name: '',
      description: '',
      price: '',
      category: 'Food',
      quantity: ''
    };
    this.onImageChanged=this.onImageChanged.bind(this);
    this.onNameChanged=this.onNameChanged.bind(this);
    this.onDescriptionChanged=this.onDescriptionChanged.bind(this);
    this.onPriceChanged=this.onPriceChanged.bind(this);
    this.onCategoryChanged=this.onCategoryChanged.bind(this);
    this.onQuantityChanged=this.onQuantityChanged.bind(this);
    this.onFormSubmit=this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addProduct(this.state.image,this.state.name, this.state.description, this.state.price, this.state.category, this.state.quantity));
    this.setState({ image: []});
    this.setState({ name: '' });
    this.setState({ description: '' });
    this.setState({ price: ''});
    this.setState({ category: 'food'});
    this.setState({ quantity: ''});
  }

  onImageChanged(e){
    this.setState({ image: e.target.value});
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
        <input type="text" id ="textbox" placeholder="Name"
               onChange={this.onNameChanged}
               value={this.state.name} />

        <input type="text" id ="textbox" placeholder="Description"
              onChange={this.onDescriptionChanged}
              value={this.state.description} />


        <input type="number" id ="textbox" placeholder="Price"
              onChange={this.onPriceChanged}
              value={this.state.price} />

        <select value={this.state.category} onChange={this.onCategoryChanged}>
            <option value="Food">Food</option>
            <option value="Handcraft Item">Handcraft Item</option>
            <option value="Homemade Item">Homemade Item</option>
        </select>

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

  render() {
    return (
      <li class="flex-container">
         <div class="img"><ImageUpload /></div>
         <div class="flex-item">Name: {this.props.name}</div>
         <div class="flex-item">Description: {this.props.description}</div>
         <div class="flex-item">Price: RM{this.props.price}</div>
         <div class="flex-item">Category: {this.props.category}</div>
         <div class="flex-item">Quantity: {this.props.quantity}</div>

        <a href="#" onClick={this.onDeleteClick.bind(this)}
           class="deleteProduct"style={{textDecoration: 'none'}}>
         Delete Product
        </a>

      </li>


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
        image={item.image}
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
          <i>Please add a Product.</i>
        </p>
      );
    }

    return (
      <ol class="flex-bigContainer">{ items }</ol>
    );
  }
}

ReactDOM.render(
  <div>
    <h1>Products</h1>
    <AddProductForm />
    <ProductList />
    <ClearButton />
  </div>,
  document.getElementById('app')
);
