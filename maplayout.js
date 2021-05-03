import React, {useState, useEffect } from "react";
import { View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {accessToken} from './config'

MapboxGL.setAccessToken(accessToken);

export default MapLayout = ({currentLongitude, currentLatitude, destLongitude, destLatitude, route}) => {

  const startingPoint = [Number(currentLongitude), Number(currentLatitude)];
  const destinationPoint = [ destLongitude, destLatitude ];
  const startDestinationPoints = [startingPoint,  destinationPoint]
  

  const renderAnnotations = () => {
    return (
      startDestinationPoints.map((point, index) => (
        <MapboxGL.PointAnnotation
            key={`${index}-PointAnnotation`}
            id={`${index}-PointAnnotation`}
            coordinate={point}> 
            <View style={{
              height: 30, 
              width: 30, 
              backgroundColor: '#0490E1', 
              borderRadius: 50, 
              borderColor: '#fff', 
              borderWidth: 3
            }} 
          />
        </MapboxGL.PointAnnotation>
      ))
    );
  }


  return (
    <View style={{flex: 1, height: "100%", width: "100%" }}>
      <MapboxGL.MapView
        styleURL={MapboxGL.StyleURL.Street}
        zoomLevel={11}
        centerCoordinate={startingPoint}
        style={{flex: 1}}>
          <MapboxGL.Camera
            zoomLevel={11}
            centerCoordinate={startingPoint}
            animationMode={'flyTo'}
            animationDuration={0}
          >
          </MapboxGL.Camera>
          {renderAnnotations()}
          {
          route && (
           <MapboxGL.ShapeSource id='shapeSource' shape={route}>
              <MapboxGL.LineLayer id='lineLayer' style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#000000'}} />
            </MapboxGL.ShapeSource>
          )
        }
      </MapboxGL.MapView>
    </View>
  )
}