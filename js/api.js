// API module for external service calls

export const API = {
    // UK Parliament API endpoints
    PARLIAMENT_BASE: 'https://members-api.parliament.uk/api',
    
    // Postcodes.io API
    POSTCODES_BASE: 'https://api.postcodes.io',
    
    // Get constituency by postcode
    async getConstituencyByPostcode(postcode) {
        try {
            const response = await fetch(`${this.POSTCODES_BASE}/postcodes/${encodeURIComponent(postcode)}`);
            if (!response.ok) throw new Error('Postcode not found');
            
            const data = await response.json();
            
            // Also try to get parliamentary constituency
            if (data.result && data.result.parliamentary_constituency) {
                return {
                    result: {
                        name: data.result.parliamentary_constituency,
                        region: data.result.region,
                        country: data.result.country
                    }
                };
            }
            
            throw new Error('No constituency found for postcode');
        } catch (error) {
            console.error('Error fetching constituency:', error);
            throw error;
        }
    },
    
    // Get MP by constituency name
    async getMPByConstituency(constituencyName) {
        try {
            // Search for constituency
            const searchResponse = await fetch(
                `${this.PARLIAMENT_BASE}/Location/Constituency/Search?searchText=${encodeURIComponent(constituencyName)}&skip=0&take=10`
            );
            
            if (!searchResponse.ok) throw new Error('Constituency search failed');
            
            const searchData = await searchResponse.json();
            const constituency = searchData.items?.[0];
            
            if (!constituency) throw new Error('Constituency not found');
            
            // Get current MP for constituency
            const mpResponse = await fetch(
                `${this.PARLIAMENT_BASE}/Location/Constituency/${constituency.value.id}/Representations`
            );
            
            if (!mpResponse.ok) throw new Error('MP lookup failed');
            
            const mpData = await mpResponse.json();
            const currentRepresentation = mpData.value.find(rep => rep.representation.endDate === null);
            
            if (!currentRepresentation) throw new Error('No current MP found');
            
            // Get detailed member info
            const memberResponse = await fetch(
                `${this.PARLIAMENT_BASE}/Members/${currentRepresentation.member.value.id}`
            );
            
            if (!memberResponse.ok) throw new Error('Member details lookup failed');
            
            const memberData = await memberResponse.json();
            
            // Format MP data
            return this.formatMPData(memberData.value, constituency);
        } catch (error) {
            console.error('Error fetching MP:', error);
            throw error;
        }
    },
    
    // Format MP data for use in the app
    formatMPData(memberData, constituency) {
        const latestParty = memberData.latestParty;
        const displayName = memberData.nameDisplayAs || memberData.nameFullTitle;
        
        // Extract contact information
        let email = '';
        let phone = '';
        let website = '';
        let twitter = '';
        
        // Parse synopsis for contact details
        if (memberData.synopsis) {
            const emailMatch = memberData.synopsis.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (emailMatch) email = emailMatch[1];
            
            const phoneMatch = memberData.synopsis.match(/(?:Tel:|Phone:)\s*([\d\s]+)/i);
            if (phoneMatch) phone = phoneMatch[1].trim();
        }
        
        return {
            id: memberData.id,
            name: displayName,
            party: latestParty?.name || 'Independent',
            partyAbbreviation: latestParty?.abbreviation || 'IND',
            constituency: constituency?.value?.name || '',
            email: email || `${memberData.nameAddressAs?.toLowerCase().replace(/\s+/g, '.')}@parliament.uk`,
            phone: phone,
            website: website,
            twitter: twitter,
            thumbnailUrl: memberData.thumbnailUrl || '',
            gender: memberData.gender || '',
            currentlyActive: memberData.latestHouseMembership?.membershipStatus?.statusIsActive || false
        };
    },
    
    // Validate postcode format
    validatePostcode(postcode) {
        const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
        return postcodeRegex.test(postcode);
    },
    
    // Get suggestions for partial postcode
    async getPostcodeSuggestions(partial) {
        try {
            const response = await fetch(
                `${this.POSTCODES_BASE}/postcodes/${encodeURIComponent(partial)}/autocomplete`
            );
            
            if (!response.ok) return [];
            
            const data = await response.json();
            return data.result || [];
        } catch (error) {
            console.error('Error fetching postcode suggestions:', error);
            return [];
        }
    }
}; 