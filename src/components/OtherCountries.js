import { useRef } from 'react';
import { GeoJSON } from 'react-leaflet';

const OtherCountries = ({ geojson_data, key_id }) => {
const geoJsonRef = useRef(null);
const style = {
            fillColor: "white",
            weight: 1,
            opacity: 1,
            color: 'gray',
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

export default OtherCountries;