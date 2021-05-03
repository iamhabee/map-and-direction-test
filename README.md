Map And Direction is a simple react native mobile app
below are the steps to clone and run on your local machine and test with either emulator or real devices that has GPS functionality

Open your terminal on your local machine and run the following command
- git clone https://github.com/iamhabee/map-and-direction-test.git
- npm install
- connect your real device through usb cord or wireless connection/ start emulator
- react-native run-android

The lists of dependencies, version and their uses used includes

- @react-native-mapbox-gl/maps --- ^8.2.0-beta2 for getting the map view
- @mapbox/mapbox-sdk --- ^0.12.1 for getting map directions
- @turf/helpers --- ^6.3.0 for connecting the routes lines
- @react-native-community/geolocation --- ^2.0.2 for getting the current location
- react-native-geocoding --- ^0.5.0 for converting the longitude and latitude to a readable address and vice versa