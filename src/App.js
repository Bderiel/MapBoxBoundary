import React, { Component } from 'react';
import ReactMapboxGl, { Layer, GeoJSONLayer } from 'react-mapbox-gl';
import axios from 'axios';

const accessToken = 'pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2o0MHp2cGtiMGFrajMycG5nbzBuY2pjaiJ9.QDApU0XH2v35viSwQuln5w';
const style = 'mapbox://styles/mapbox/streets-v9';

const Map = ReactMapboxGl({
  accessToken,
});

const mapStyle = {
  height: '100vh',
  width: '100vw',
};

const symbolLayout = {
  'text-field': '{place}',
  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
  'text-offset': [0, 0.6],
  'text-anchor': 'top',
};

const lineLayout = {
  'fill-color': 'blue',
  // 'line-join': 'round',
};

const linePaint = {
  'line-color': 'red',
  'line-width': 3,
};


class App extends Component {
  constructor() {
    super();
    this.state = {
      geo: null,
      center: [-73.935242, 40.730610],
      zipcode:'',
      currZip:null

    };
  }

  componentDidMount() {
    axios.get('https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ny_new_york_zip_codes_geo.min.json')
      .then(res =>{
        this.setState({ geo: res.data })        
      })
  }
  handleClick = () =>{
    const { geo,zipcode } = this.state;
    const allzip = geo.features.filter(el => el.properties.ZCTA5CE10 === zipcode)
    console.log(allzip,'all')
    if(!allzip.length) return;
    this.setState({
      center: allzip[0].geometry.coordinates[0][0],
      currZip: { ...this.state.geo, features:allzip }
})
  }
  handleChange = (evt) =>{
    this.setState({
      zipcode:evt.target.value,
    })
  }

  render() {
    const { zipcode, geo, center, currZip } = this.state
    return (
      <div>
        <input onChange={this.handleChange}/>
        <button onClick={this.handleClick}>Search</button>
        <Map
          style={style}
          containerStyle={mapStyle}
          center={center}
        >
          <GeoJSONLayer
            data={currZip}
            linePaint={linePaint}
          />
        </Map>
      </div>
    );
  }
}

export default App;