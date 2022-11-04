import { useEffect, useState, useMemo, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON, Marker, Popup,
    useMap, Circle
} from 'react-leaflet';
import { useMapEvents } from "react-leaflet";
import L from 'leaflet';
const Heatmap = ({ geojson_data, heat, setfile, key_id }) => {
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
        console.log("map",map);
        if (!map) return;
        const getColor = d => {
          return d > 8
            ? "#a50f15"
            : d > 4
            ? "#de2d26"
            : d > 2
            ? "#fb6a4a"
            : d > 1
            ? "#fc9272"
            : d > 0.5
            ? "#fcbba1"
            : "#fee5d9";
        };
    
        const legend = L.control({ position: "bottomright" });
    
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
              '<i style="background:' +
                getColor(from + 1) +
                '"></i> ' +
                from +
                (to ? "&ndash;" + to : "+")
            );
          }
    
          div.innerHTML = labels.join("<br>");
          return div;
        };
        map.removeControl(legend);
        legend.addTo(map);
      }, []);
    const highlightFeature = (e => {
        var layer = e.target;
        if (mapEvents.getZoom() < 9) {
            layer.setStyle({
                weight: 1,
                color: "white",
                fillOpacity: 1
            });
        } else {
            layer.setStyle({
                weight: 1,
                color: "white",
                fillOpacity: 0.2
            });
        }
    });
    const resetHighlight = (e => {
        setOnselect({});
        e.target.setStyle(style(e.target.feature));
    })
    const zoomToFeature = (e) => {
        map.fitBounds(e.target.getBounds());
    };

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: (e) => {
                zoomToFeature(e);
                if (key_id == 'Latin America') {
                    setfile(e.target.feature.properties.ADMIN);
                }
            },
        });
    }
    const mapPolygonColorToDensity = (density => {
        return density > 8
            ? '#a50f15'
            : density > 4
                ? '#de2d26'
                : density > 2
                    ? '#fb6a4a'
                    : density > 1
                        ? '#fc9272'
                        : density > 0.5
                            ? '#fcbba1'
                            : '#fee5d9';
    })
    const style = (feature => {
        if (mapEvents.getZoom() < 9) {
            return ({
                fillColor: mapPolygonColorToDensity(colors[feature.properties.ADMIN]),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.5
            });
        } else {
            return ({
                fillColor: mapPolygonColorToDensity(colors[feature.properties.ADMIN]),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.2
            });
        }


    });
    useEffect(() => {
        if (geoJsonRef.current.getBounds().isValid()) {
            map.fitBounds(geoJsonRef.current.getBounds());
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