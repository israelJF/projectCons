// Importa el componente GoogleMap de la librería de Google Maps para React
import { GoogleMap } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';

function MapComponent() {
    // Latitude and Longitude
    const myLatLng = { lat: -6.207690, lng: 106.985270 };

    // Propiedades del mapa
    const mapOptions = {
        zoom: 17,
        center: myLatLng
    };

    return (
        <div>
            {/* Renderiza el componente GoogleMap */}
            <GoogleMap
                id="google-maps"
                mapContainerStyle={{
                    height: "400px",
                    width: "100%"
                }}
                options={mapOptions}
            >
                {/* Marcador en el mapa */}
                <Marker
                    position={myLatLng}
                    title="South Jakarta, INA"
                />
            </GoogleMap>
        </div>
    );
}

export default MapComponent;



