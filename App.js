import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'; 
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import NavigationBar from './components/NavigationBar/NavigationBar';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import 'tachyons';
import './App.css';
import apiURL from './apiUrl';

const paticleOptions = {
  particles: {
    number: {
      value: 40
    },
    density: {
      enable: true,
      value_area: 800
    },
    line_linked: {
      enable: true
    }
  }
};

const initialState = {
  input: '',
  imageURL: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (userData) => {
    this.setState({user: {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      entries: userData.entries,
      joined: userData.joined
    }});
  }

  // componentDidMount() {
  //   fetch(apiURL)
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(err => console.log(err));
  // }

  calculateFaceLocation(data) {
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const clarifaiFacesRegions = data.outputs[0].data.regions;
    const boundingBoxes = clarifaiFacesRegions.map((region) => {
      const {bounding_box} = region.region_info;

      return({
        left: bounding_box.left_col * width,
        top: bounding_box.top_row * height,
        right: width - (bounding_box.right_col * width),
        bottom: height - (bounding_box.bottom_row * height)
      })
    })
    return boundingBoxes;
  }

  displayFaceBoundary = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
//a403429f2ddf4b49b307e318f00e528b
  onImageSubmit = () => {

    this.setState({
      imageURL: this.state.input,
      boxes: []
    });

    fetch(apiURL + '/imageApi', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log(response.outputs[0].data.regions.length);
      if(response){
        fetch(apiURL + '/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,
            entryCount: response.outputs[0].data.regions.length
          })
        })
        .then(response => response.json())
        .then(entryCount => 
          this.setState(
            Object.assign(
              this.state.user, 
              {entries: entryCount}
            )
          )
        )
        .catch(err => console.log);
      }
      this.displayFaceBoundary(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }
  
  onRouteChange = (route) => {
    if(route === 'home') {
      this.setState({isSignedIn:true});
    } else if(route === 'signout') {
      this.setState(initialState);
      return;
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, boxes } = this.state; 
    return (
      <div className='App'>
        <Particles 
          className='particles' 
          params={paticleOptions} 
        />
        <NavigationBar>
          <Logo/>
          <Navigation 
            isSignedIn={isSignedIn}
            onRouteChange={this.onRouteChange} />
        </NavigationBar>
        { route === 'home' 
          ? <div>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange = {this.onInputChange} 
                onImageSubmit = {this.onImageSubmit} />
              <FaceRecognition 
                boxes={boxes} 
                imageURL={imageURL}/>
            </div>
          : (
            route === 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
        }
      </div>
    );
  }
}

export default App;