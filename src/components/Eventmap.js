import { useEffect, useState , useMemo, useRef} from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON,Marker,Popup,
    useMap, Circle
  } from 'react-leaflet'
const Eventmap = ({geojson_data,setfile,key}) => {
    //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
    const geoJsonRef = useRef(null);
    const map = useMap();
  
    //const highlightFeature = (e: Leaflet.LeafletMouseEvent) => {
    const highlightFeature = (e) => {
      const layer = e.target;
  
      layer.setStyle({
        dashArray: '',
        fillOpacity: 0.5,
        weight: 5,
      });
    };
    useEffect(() => {
      if (geoJsonRef.current.getBounds().isValid()){
        map.fitBounds(geoJsonRef.current.getBounds());
      }
    
    },[geojson_data])
  
    const resetHighlight = (e) => {
      geoJsonRef.current?.resetStyle(e.target);
    };
  
    const zoomToFeature = (e) => {
      map.fitBounds(e.target.getBounds());
    };
    return (
              <GeoJSON
                data={geojson_data}
                key={key}
                ref={geoJsonRef}
                style={() => {
                  return {
                    color: 'white',
                    dashArray: '3',
                    fillColor: '#f0f0f0',
                    fillOpacity: 0.7,
                    opacity: 1,
                    weight: 2,
                  };
                }}
                onEachFeature={(__, layer) => {
                  layer.on({
                    click: (e) => {
                      zoomToFeature(e);
                      setfile(e.target.feature.properties.ADMIN);
                    },
                    mouseout: (e) => {
                      resetHighlight(e);
                    },
                    mouseover: (e) => {
                      highlightFeature(e);
                    },
                  });
                }}
              />
  
  
  
    );
  };

  export default Eventmap;