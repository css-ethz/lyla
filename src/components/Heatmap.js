import { useEffect, useState , useMemo, useRef} from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON,Marker,Popup,
    useMap, Circle
  } from 'react-leaflet'
const Heatmap = ({geojson_data,heat,setfile,key}) => {
    //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
    const geoJsonRef = useRef(null);
    const map = useMap();
    const [colors, setcolors] = useState([]);

    useEffect(() => {
        setcolors(heat);
        console.log("cambio",heat);
        console.log("cambio",colors);  
      }, [heat]);

      const [onselect, setOnselect] = useState({});

      const highlightFeature = (e=> {
          var layer = e.target;
          console.log(layer);
          console.log(colors);
          const { Admin, Isoa3 } = e.target.feature.properties;
          setOnselect({
              admin:Admin,
              isoa3:Isoa3,
          });
          layer.setStyle({
              weight: 1,
              color: "black",
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
                //zoomToFeature(e);
                setfile(e.target.feature.properties.ADMIN);
              },
          });
      }
    const mapPolygonColorToDensity=(density => {
      return density > 1000
          ? '#a50f15'
          : density > 600
          ? '#de2d26'
          : density > 300
          ? '#fb6a4a'
          : density > 100
          ? '#fc9272'
          : density > 20
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

    return (
              <GeoJSON
                data={geojson_data}
                key={key}
                ref={geoJsonRef}
                style={style}
                onEachFeature={onEachFeature}
              />
  
  
  
    );
  };

  export default Heatmap;