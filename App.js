/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MapLayout from './maplayout';
import Geolocation from '@react-native-community/geolocation';
import {lineString as makeLineString} from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import Geocoder from 'react-native-geocoding';
import {accessToken, apiKey} from './config'
// import Geolocation from 'react-native-geolocation-service';

const directionsClient = MapboxDirectionsFactory({accessToken});
const App = () => {

  const [ currentLongitude, setCurrentLongitude ] = useState(0);
  const [ currentLatitude, setCurrentLatitude] = useState(0);
  const [ destLongitude, setDestLongitude ] = useState(0);
  const [ destLatitude, setDestLatitude] = useState(0);
  const [ locationStatus, setLocationStatus ] = useState('');
  const [ currentAddress, setCurrentAddress ] = useState('');
  const [loading, setLoading] = useState(false)
  const [route, setRoute] = useState(null);

  useEffect(() => {
    Geocoder.init(apiKey);
    setLoading(true)
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
            fetchRoute()
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        
        //Setting Longitude state
        setCurrentLatitude(currentLatitude);

        // get current address
        Geocoder.from(currentLatitude, currentLongitude)
          .then(json => {
          var addressComponent = json.results[0].formatted_address;
            // console.log(json.results[0].formatted_address);
            setCurrentAddress(addressComponent)
            setLoading(false)
          })
          .catch(error => console.warn(error));
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change
        setLocationStatus('You are Here');

        //getting the Longitude from the location json        
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000
      },
    );
  };

  const fetchRoute = async () => {
    const reqOptions = {
      waypoints: [
        {coordinates: [Number(currentLongitude), Number(currentLatitude)]},
        {coordinates: [destLongitude, destLatitude]},
      ],
      profile: 'driving-traffic',
      geometries: 'geojson',
    };

    const res = await directionsClient.getDirections(reqOptions).send();

    const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
    setRoute(newRoute);
  };

  const onChangeText = (e) =>{
    Geocoder.from(e)
		.then(json => {
			var location = json.results[0].geometry.location;
			console.log(location);
      setDestLatitude(location.lat)
      setDestLongitude(location.lng)
		}).then(()=>{
      fetchRoute()
    })
		.catch(error => console.warn(error));
  }

  return (
      // <SafeAreaView>
        <View style={{flex:1 }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder="Enter your destination"
          />
          <View style={{flex:0.5, backgroundColor:"#ffffff", alignItems:"center"}}>
            <Text>Your current location</Text>
            <Text style={{fontWeight:"bold", fontSize:16}}> {currentAddress}</Text>
          </View>
          <View style={{flex:4.5, alignItems:"center", justifyContent:"center"}} >
            {loading ?
            <Text style={{fontSize:32, color:"#000"}}>Map Data is Loading...</Text>:
            <MapLayout 
              currentLatitude={currentLatitude} currentLongitude={currentLongitude}
              destLatitude={destLatitude} destLongitude={destLongitude}
              route={route}
            />}
          </View>
        </View>
      // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius:35,
    borderColor:"#EEEEEE"
  },
});

export default App;
