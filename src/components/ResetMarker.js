import { useEffect, useState, useMemo, useRef } from 'react';
import {
    MapContainer,
    TileLayer,
    GeoJSON, Marker, Popup,
    useMap, Circle
} from 'react-leaflet';
import { useMapEvents } from "react-leaflet";
import L from 'leaflet';
// const outerBounds_reset = [
//     [-30.505, -100.09],
//     [-1.505, -40.09],
//   ]

  const outerBounds_reset = [
    [-30.505, -100.09],
    [-1.505, -35.59],
  ]

const ResetMarker = ({  setfile}) => {
    //const geoJson: RefObject<Leaflet.GeoJSON> = useRef(null);
    const geoJsonRef = useRef(null);
    const map = useMap();
    useEffect(() => {
        if (!map) return;
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "description");
      L.DomEvent.disableClickPropagation(div);
      const text = "Reset Map";
      div.insertAdjacentHTML("beforeend", text);
      return div;
    };

    legend.addTo(map);

    // add "random" button
    const buttonTemplate =
      '<svg class="svg-icon" viewBox="0 0 20 20"><path d="M16.76,7.51l-5.199-5.196c-0.234-0.239-0.633-0.066-0.633,0.261v2.534c-0.267-0.035-0.575-0.063-0.881-0.063c-3.813,0-6.915,3.042-6.915,6.783c0,2.516,1.394,4.729,3.729,5.924c0.367,0.189,0.71-0.266,0.451-0.572c-0.678-0.793-1.008-1.645-1.008-2.602c0-2.348,1.93-4.258,4.303-4.258c0.108,0,0.215,0.003,0.321,0.011v2.634c0,0.326,0.398,0.5,0.633,0.262l5.199-5.193C16.906,7.891,16.906,7.652,16.76,7.51 M11.672,12.068V9.995c0-0.185-0.137-0.341-0.318-0.367c-0.219-0.032-0.49-0.05-0.747-0.05c-2.78,0-5.046,2.241-5.046,5c0,0.557,0.099,1.092,0.292,1.602c-1.261-1.111-1.979-2.656-1.979-4.352c0-3.331,2.77-6.041,6.172-6.041c0.438,0,0.886,0.067,1.184,0.123c0.231,0.043,0.441-0.134,0.441-0.366V3.472l4.301,4.3L11.672,12.068z"></path></svg>';

    // create custom button
    const customControl = L.Control.extend({
      // button position
      options: {
        position: "topleft",
        title: "Reset Map",
        className: "leafletRandomMarker",
      },

      // method
      onAdd: function (map) {
        this._map = map;
        return this._initialLayout();
      },

      _initialLayout: function () {
        // create button
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar " + this.options.className
        );
        this._container = container;

        L.DomEvent.disableClickPropagation(container);

        container.title = this.options.title;
        container.innerHTML = buttonTemplate;

        // action when clik on button
        // clear and add radnom marker
        L.DomEvent.on(
          container,
          "mousedown dblclic",
          L.DomEvent.stopPropagation
        )
          .on(container, "click", L.DomEvent.stop)
          .on(container, "click", resetMap);
        return this._container;
      },
    });
    
    // adding new button to map controll
    map.addControl(new customControl());
}, []);
    function resetMap() {
        setfile("Latin America");
      }
    return null;
};

export default ResetMarker;