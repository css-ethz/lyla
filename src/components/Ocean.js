import { useRef } from 'react';
import { GeoJSON } from 'react-leaflet';

const Ocean = ({ geojson_data, key_id }) => {
const geoJsonRef = useRef(null);
const style = {
            fillColor: "#161719",
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '1',
            fillOpacity: 1
        };

return (
    <GeoJSON
        data={geojson_data}
        key={key_id}
        ref={geoJsonRef}
        style={style}
    />



);

};

export default Ocean;