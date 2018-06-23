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
  'line-cap': 'round',
  'line-join': 'round',
};

const linePaint = {
  'line-color': 'red',
  'line-width': 3,
};

const symbolPaint = {
  'text-color': 'red',
};

const circleLayout = { visibility: 'visible' };
const circlePaint = {
  'circle-color': 'red',
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      geo: null,
      zipOn: false,
    };
  }

  componentDidMount() {
    axios.get('https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ny_new_york_zip_codes_geo.min.json')
      .then(res => this.setState({ geo: res.data }));
  }
  handleClick = () =>{
    const { zipOn } = this.state;
    this.setState({zipOn:!zipOn})
  }
  render() {
    const { zipOn,geo } = this.state
    return (
      <div>
        <button onClick={this.handleClick}>{zipOn + ''}</button>
        <Map
          style={style}
          containerStyle={mapStyle}
          center={[-73.935242, 40.730610]}
        >
          <GeoJSONLayer
            data={zipOn ? null:geo}
            lineLayout={lineLayout}
            linePaint={linePaint}
            symbolLayout={symbolLayout}
            symbolPaint={symbolPaint}
          />
        </Map>
      </div>
    );
  }
}

export default App;