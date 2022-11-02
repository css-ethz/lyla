import { useEffect, useState , useMemo, useRef} from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON,Marker,Popup,
    useMap, Circle
  } from 'react-leaflet';
  import {useMapEvents} from "react-leaflet";
const Heatmap = ({geojson_data,heat,setfile,key_id}) => {
    //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
    const geoJsonRef = useRef(null);
    const map = useMap();
    const [colors, setcolors] = useState([]);
    const [zoomLevel, setZoomLevel] = useState(3);

    useEffect(() => {
        setcolors(heat);
      }, [heat]);

      const [onselect, setOnselect] = useState({});

      const highlightFeature = (e=> {
          var layer = e.target;

          layer.setStyle({
              weight: 1,
              color: "white",
              fillOpacity: 1
          });
      });
      const resetHighlight= (e =>{
        setOnselect({});
          e.target.setStyle(style(e.target.feature));
      })
      const zoomToFeature = (e) => {
        map.fitBounds(e.target.getBounds());
      };

      const onEachFeature= (feature, layer)=> {
          layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
              click: (e) => {
                zoomToFeature(e);
                if (key_id=='latam'){
                    setfile(e.target.feature.properties.ADMIN);
                }
              },
          });
      }
    const mapPolygonColorToDensity=(density => {
      return density > 100
          ? '#a50f15'
          : density > 80
          ? '#de2d26'
          : density > 40
          ? '#fb6a4a'
          : density > 10
          ? '#fc9272'
          : density > 5
          ? '#fcbba1'
          : '#fee5d9';
  })
  const style = (feature => {
      return ({
          fillColor: mapPolygonColorToDensity(colors[feature.properties.ADMIN]),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5
      });
  });
  useEffect(() => {
    if (geoJsonRef.current.getBounds().isValid()){
      map.fitBounds(geoJsonRef.current.getBounds());
    }
  
  },[geojson_data])
/*   const mapEvents = useMapEvents({
    zoomend: () => {
        console.log("zoomlvl",mapEvents.getZoom())
        if (mapEvents.getZoom()<2){
            console.log("k",key_id);
            setfile('latam');
            
        }
        setZoomLevel(mapEvents.getZoom());
    },
}); */
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