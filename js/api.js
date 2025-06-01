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
            const currentRepresentation = mpData.value.find(rep => rep.representation.membershipEndDate === null);
            
            if (!currentRepresentation) throw new Error('No current MP found');
            
            // Get detailed member info
            const memberResponse = await fetch(
                `${this.PARLIAMENT_BASE}/Members/${currentRepresentation.member.value.id}`
            );

            if (!memberResponse.ok) throw new Error('Member details lookup failed');

            const memberData = await memberResponse.json();

            // Get contact information
            const contactResponse = await fetch(
                `${this.PARLIAMENT_BASE}/Members/${currentRepresentation.member.value.id}/Contact`
            );

            let contactData = null;
            if (contactResponse.ok) {
                contactData = await contactResponse.json();
            }

            // Format MP data
            return this.formatMPData(memberData.value, constituency, contactData?.value);
        } catch (error) {
            console.error('Error fetching MP:', error);
            throw error;
        }
    },
    
    // Format MP data for use in the app
    formatMPData(memberData, constituency, contactData = null) {
        const latestParty = memberData.latestParty;
        const displayName = memberData.nameDisplayAs || memberData.nameFullTitle;

        // Extract contact information from API
        let email = '';
        let phone = '';
        let website = '';
        let socialMedia = {};
        let parliamentaryAddress = {};
        let constituencyAddress = {};

        // Extract real contact information from Contact API
        if (contactData && Array.isArray(contactData)) {
            // Find different types of contacts
            const parliamentaryOffice = contactData.find(contact => contact.type === 'Parliamentary office');
            const constituencyOffice = contactData.find(contact => contact.type === 'Constituency office');
            const websiteContact = contactData.find(contact => contact.type === 'Website');

            // Use Parliamentary office email first, then constituency office
            email = parliamentaryOffice?.email || constituencyOffice?.email || '';

            // Use Parliamentary office phone first, then constituency office
            phone = parliamentaryOffice?.phone || constituencyOffice?.phone || '';

            // Extract website
            website = websiteContact?.line1 || '';

            // Extract Parliamentary office address
            if (parliamentaryOffice) {
                parliamentaryAddress = {
                    line1: parliamentaryOffice.line1 || '',
                    line2: parliamentaryOffice.line2 || '',
                    line3: parliamentaryOffice.line3 || '',
                    line4: parliamentaryOffice.line4 || '',
                    line5: parliamentaryOffice.line5 || '',
                    postcode: parliamentaryOffice.postcode || '',
                    phone: parliamentaryOffice.phone || '',
                    email: parliamentaryOffice.email || ''
                };
            }

            // Extract Constituency office address
            if (constituencyOffice) {
                constituencyAddress = {
                    line1: constituencyOffice.line1 || '',
                    line2: constituencyOffice.line2 || '',
                    line3: constituencyOffice.line3 || '',
                    line4: constituencyOffice.line4 || '',
                    line5: constituencyOffice.line5 || '',
                    postcode: constituencyOffice.postcode || '',
                    phone: constituencyOffice.phone || '',
                    email: constituencyOffice.email || ''
                };
            }

            // Extract social media contacts
            const socialTypes = ['Twitter', 'X', 'Facebook', 'Instagram', 'LinkedIn', 'Bluesky', 'YouTube'];
            socialTypes.forEach(type => {
                const socialContact = contactData.find(contact => contact.type === type);
                if (socialContact && socialContact.line1) {
                    socialMedia[type.toLowerCase()] = socialContact.line1;
                }
            });
        }
        
        return {
            id: memberData.id,
            name: displayName,
            party: latestParty?.name || 'Independent',
            partyAbbreviation: latestParty?.abbreviation || 'IND',
            constituency: constituency?.value?.name || '',
            email: email,
            phone: phone,
            website: website,
            socialMedia: socialMedia,
            parliamentaryAddress: parliamentaryAddress,
            constituencyAddress: constituencyAddress,
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