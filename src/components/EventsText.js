import { useState, useEffect } from "react";


const EventsText = ({ country, num_events, content, lan }) => { 
    return (
        <div>
            <p className='num-events-title'>
                {country !== 'Latin America' ? country : 'Latin America'}: {country !== 'Latin America' && num_events[country] > 0 ? num_events[country]: country !== 'Latin America' ? 0 : 2818} {content['events-text'][lan]}
            </p>
           
        </div>

    );

};

export default EventsText;