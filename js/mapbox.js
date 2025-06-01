// Mapbox helper module

export class MapboxHelper {
    constructor() {
        // Mapbox access token (will be fetched from server)
        this.MAPBOX_TOKEN = null;
        this.map = null;
        this.geocoder = null;
        this.onAddressSelected = null;
        this.onPreciseAddressSelected = null;
    }

    // Initialize Mapbox token from server
    async initializeToken() {
        if (this.MAPBOX_TOKEN) return; // Already initialized

        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            this.MAPBOX_TOKEN = config.mapboxToken;

            if (!this.MAPBOX_TOKEN) {
                throw new Error('Mapbox token not found in server configuration');
            }

            // Set global Mapbox access token
            mapboxgl.accessToken = this.MAPBOX_TOKEN;
        } catch (error) {
            console.error('Failed to initialize Mapbox token:', error);
            throw error;
        }
    }
    
    // Initialize geocoder with map for enhanced address selection
    async initializeGeocoderWithMap(geocoderContainerId, mapContainerId) {
        // Initialize token first
        await this.initializeToken();

        // Create geocoder
        this.geocoder = new MapboxGeocoder({
            accessToken: this.MAPBOX_TOKEN,
            countries: 'gb',
            types: 'address,postcode',
            placeholder: 'Enter your address or postcode...',
            flyTo: false,
            marker: false,
            language: 'en-GB',
            limit: 5
        });

        // Create map
        this.map = new mapboxgl.Map({
            container: mapContainerId,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-1.5, 52.5],
            zoom: 5
        });

        // Add navigation controls
        this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load
        await new Promise(resolve => this.map.on('load', resolve));

        // Add geocoder to container
        document.getElementById(geocoderContainerId).appendChild(this.geocoder.onAdd(this.map));

        // Set up event listeners
        this.setupEventListeners();

        return { geocoder: this.geocoder, map: this.map };
    }

    setupEventListeners() {
        // Handle geocoder result selection
        this.geocoder.on('result', (e) => {
            const result = e.result;
            this.updateMapLocation(result.center);

            if (this.onAddressSelected) {
                this.onAddressSelected(result);
            }
        });

        // Handle map clicks for precise address selection
        this.map.on('click', async (e) => {
            const coordinates = [e.lngLat.lng, e.lngLat.lat];

            // Add marker at clicked location
            this.updateMapLocation(coordinates);

            // Reverse geocode to get address
            const address = await this.reverseGeocode(coordinates[0], coordinates[1]);
            if (address && this.onPreciseAddressSelected) {
                this.onPreciseAddressSelected(address.place_name);
            }
        });
    }

    // Create geocoder for address search (legacy method)
    async createGeocoder() {
        const geocoder = new MapboxGeocoder({
            accessToken: this.MAPBOX_TOKEN,
            countries: 'gb',
            types: 'address,postcode',
            placeholder: 'Enter your address or postcode...',
            flyTo: false,
            marker: false,
            language: 'en-GB',
            limit: 5
        });

        return geocoder;
    }
    
    // Create map instance
    async createMap(containerId) {
        const map = new mapboxgl.Map({
            container: containerId,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-1.5, 52.5], // Center on UK
            zoom: 5
        });
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Wait for map to load
        await new Promise(resolve => map.on('load', resolve));
        
        return map;
    }
    
    // Update map location with marker
    updateMapLocation(coordinates) {
        if (!this.map) return;

        // Remove existing markers
        const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
        existingMarkers.forEach(marker => marker.remove());

        // Add new marker
        new mapboxgl.Marker({
            color: '#1e40af' // Primary color
        })
            .setLngLat(coordinates)
            .addTo(this.map);

        // Fly to location
        this.map.flyTo({
            center: coordinates,
            zoom: 14,
            duration: 1500,
            essential: true
        });
    }

    // Get nearby addresses for precise selection
    async getNearbyAddresses(coordinates) {
        await this.initializeToken();

        try {
            const [lng, lat] = coordinates;
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
                `access_token=${this.MAPBOX_TOKEN}&country=gb&types=address&limit=10`
            );

            if (!response.ok) return [];

            const data = await response.json();
            return data.features || [];
        } catch (error) {
            console.error('Error fetching nearby addresses:', error);
            return [];
        }
    }
    
    // Get address suggestions for UK
    async getAddressSuggestions(query) {
        await this.initializeToken();

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
                `access_token=${this.MAPBOX_TOKEN}&country=gb&types=address,postcode&limit=5`
            );
            
            if (!response.ok) return [];
            
            const data = await response.json();
            return data.features || [];
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            return [];
        }
    }
    
    // Reverse geocode coordinates to get address
    async reverseGeocode(lng, lat) {
        await this.initializeToken();

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
                `access_token=${this.MAPBOX_TOKEN}&country=gb&types=address`
            );
            
            if (!response.ok) return null;
            
            const data = await response.json();
            return data.features?.[0] || null;
        } catch (error) {
            console.error('Error reverse geocoding:', error);
            return null;
        }
    }
    
    // Extract postcode from geocoding result
    extractPostcodeFromResult(result) {
        // Check in context for postcode
        const postcodeContext = result.context?.find(
            ctx => ctx.id.includes('postcode') || ctx.id.includes('place')
        );

        if (postcodeContext) {
            return postcodeContext.text;
        }

        // Try to extract from place_name
        const postcodeMatch = result.place_name.match(/[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}/i);
        return postcodeMatch ? postcodeMatch[0] : null;
    }
}