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

const linePaint = {
  'line-color': 'red',
  'line-width': 3,
};

const fillPaint = {
  'fill-color': 'green',
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      geo: null,
      center: [-73.935242, 40.730610],
      zipcode:'',
      currZip:null,
      zoom: [11],
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
    if(!allzip.length) return;
    const center = allzip[0].geometry.type === 'Polygon' ? allzip[0].geometry.coordinates[0][0] : allzip[0].geometry.coordinates[0][0][0]
    this.setState({
      center: center,
      currZip: { ...this.state.geo, features:allzip },
      zoom: [12]
})
  }
  handleChange = (evt) =>{
    this.setState({
      zipcode:evt.target.value,
    })
  }

  render() {
    const { zipcode, geo, center, currZip,zoom } = this.state
    return (
      <div>
        <input onChange={this.handleChange}/>
        <button disabled={!geo} onClick={this.handleClick}>Search</button>
        <Map
          style={style}
          containerStyle={mapStyle}
          center={center}
          zoom={zoom}
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