import { useEffect, useState, useMemo, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON, Marker, Popup,
    useMap, Circle
} from 'react-leaflet';
import { useMapEvents } from "react-leaflet";
import content from '../data/content.json';
import L from 'leaflet';
// const outerBounds_reset = [
//     [-30.505, -100.09],
//     [-1.505, -40.09],
//   ]

  const outerBounds_reset = [
    [-30.505, -100.09],
    [-1.505, -35.59],
  ]

const Heatmap = ({ geojson_data, heat, key_id, file, parentFunc,lan,setZoom}) => {
    //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
    const geoJsonRef = useRef(null);
    const map = useMap();
    const [colors, setcolors] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(3);

    useEffect(() => {
        setcolors(heat);
    }, [heat]);

    const [onselect, setOnselect] = useState({});
    useEffect(() => {
        if (!map) return;
        const getColor = d => {
          return d >= 8
            ? "#a50f15"
            : d >= 4
            ? "#de2d26"
            : d >= 2
            ? "#fb6a4a"
            : d >= 1
            ? "#fc9272"
            : d >= 0.5
            ? "#fdbba1"
            : "#fee5d9";
        };
    
        const legend = L.control({ position: "topright" });
        
    
        legend.onAdd = () => {
          const div = L.DomUtil.create("div", "info legend");
          const grades = [0, 0.5, 1, 2, 4, 8];
          let labels = [];
          let from;
          let to;
    
          for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
    
            labels.push(
              '<i style=" background:' +
                getColor(from ) +
                '"></i> ' +
                from +
                (to ? "&ndash;" + to : "+")
            );
          }
          
    
          div.innerHTML =content['eventsMillion']['en']+"</br>" +labels.join("<br>");
          return div;
        };

        if (legend instanceof L.Control) { 
            map.removeControl(legend); 
        };
        //map.removeControl(legend);
        legend.addTo(map);
        map.createPane("normalPane");
        map.getPane("normalPane").style.zIndex = 0;
        map.createPane("locationMarker");
        map.getPane("locationMarker").style.zIndex = 1;
        map.createPane("popupPane");
        map.getPane("popupPane").style.zIndex = 2;
      }, []);


    const zoomToFeature = (e) => {
        map.fitBounds(e.target.getBounds()); //print bounds
        
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            click: (e) => {
                zoomToFeature(e);
                parentFunc(e);
            }

        });

    };

    const mapPolygonColorToDensity = (density => {
        return density > 8
            ? '#BB545A'
            : density > 4
                ? '#E36966'
                : density > 2
                    ? '#F7947F'
                    : density > 1
                        ? '#F8B09B'
                        : density > 0.5
                            ? '#F9CDBB'
                            : '#F9EAE2';
    })
    const style = (feature => {
        if (mapEvents.getZoom() < 10) {
            setZoom(1);
            return ({
                fillColor: mapPolygonColorToDensity(colors[feature.properties.ADMIN]),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 1
            });
            
        } else {
            setZoom(0);
            return ({
                fillColor: mapPolygonColorToDensity(colors[feature.properties.ADMIN]),
                weight: 1,
                opacity: 1,
                color: 'white',
                dashArray: '1',
                fillOpacity: 0
            });
            
        }


    });
    useEffect(() => {
        if (file === "Latin America"){
        
        if (geoJsonRef.current.getBounds().isValid()) {
        
            //map.fitBounds(geoJsonRef.current.getBounds());
            map.fitBounds(outerBounds_reset);
        }
        
        }

    }, [geojson_data])
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        },
    });
    return (
        <GeoJSON
            data={geojson_data}
            key={key_id}
            ref={geoJsonRef}
            style={style}
            onEachFeature={onEachFeature}
        />



    );
};

export default Heatmap;