
export interface PostcodeData {
    postcode: string;
    latitude: number;
    longitude: number;
}

const API_BASE = 'https://api.postcodes.io';

export async function getPostcodeCoordinates(postcode: string): Promise<PostcodeData | null> {
    try {
        const response = await fetch(`${API_BASE}/postcodes/${encodeURIComponent(postcode)}`);
        const data = await response.json();

        if (data.status === 200 && data.result) {
            return {
                postcode: data.result.postcode,
                latitude: data.result.latitude,
                longitude: data.result.longitude
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching postcode:', error);
        return null;
    }
}

export async function getBulkPostcodeCoordinates(postcodes: string[]): Promise<Record<string, PostcodeData>> {
    if (postcodes.length === 0) return {};

    try {
        const response = await fetch(`${API_BASE}/postcodes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postcodes }),
        });

        const data = await response.json();
        const results: Record<string, PostcodeData> = {};

        if (data.status === 200 && data.result) {
            data.result.forEach((item: any) => {
                if (item.result) {
                    results[item.query] = {
                        postcode: item.result.postcode,
                        latitude: item.result.latitude,
                        longitude: item.result.longitude
                    };
                }
            });
        }

        return results;
    } catch (error) {
        console.error('Error fetching bulk postcodes:', error);
        return {};
    }
}

// Haversine formula to calculate distance in miles
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
