// Mapbox helper module

export const MapboxHelper = {
    // Mapbox access token
    MAPBOX_TOKEN: 'pk.eyJ1IjoibXVhemFtc2FyZmFyYXoiLCJhIjoiY205b2dzdnVlMTVuZDJqczcwbnBseW1tYiJ9.-MvfX63GtzUQceap1g6iJQ',
    
    // Initialize Mapbox
    init() {
        mapboxgl.accessToken = this.MAPBOX_TOKEN;
    },
    
    // Create geocoder for address search
    async createGeocoder() {
        this.init();
        
        const geocoder = new MapboxGeocoder({
            accessToken: this.MAPBOX_TOKEN,
            countries: 'gb', // Limit to UK
            types: 'address,postcode', // Search for addresses and postcodes
            placeholder: 'Enter your address or postcode...',
            flyTo: false, // We'll handle map updates manually
            marker: false, // We'll add our own marker
            language: 'en-GB',
            limit: 5
        });
        
        return geocoder;
    },
    
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
    },
    
    // Update map location with marker
    updateMapLocation(map, coordinates) {
        // Remove existing markers
        const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
        existingMarkers.forEach(marker => marker.remove());
        
        // Add new marker
        new mapboxgl.Marker({
            color: '#1e40af' // Primary color
        })
            .setLngLat(coordinates)
            .addTo(map);
        
        // Fly to location
        map.flyTo({
            center: coordinates,
            zoom: 14,
            duration: 1500,
            essential: true
        });
    },
    
    // Get address suggestions for UK
    async getAddressSuggestions(query) {
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
    },
    
    // Reverse geocode coordinates to get address
    async reverseGeocode(lng, lat) {
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
    },
    
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
}; 