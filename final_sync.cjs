const axios = require('axios');

const API_URL = 'https://b5flw79dm3.execute-api.ap-south-1.amazonaws.com/prod/products';
const GET_URL = 'https://b5flw79dm3.execute-api.ap-south-1.amazonaws.com/prod/getall?all=true';

const HYBRID_BENEFITS = [
    "Works with both grid and batteries",
    "Provides backup during power cuts",
    "Intelligent energy management (prioritizes solar usage)",
    "Flexible and future-ready (battery can be added later)"
];
const HYBRID_APPLICATIONS = [
    "Homes in areas with frequent power outages",
    "Small businesses needing uninterrupted power",
    "Rural and semi-urban installations"
];

const ONGRID_BENEFITS = [
    "Converts DC power from solar panels into AC for home/business use",
    "No need for batteries → lower cost and maintenance",
    "High efficiency and better ROI",
    "Can export excess power to the grid (net metering, where available)"
];
const ONGRID_APPLICATIONS = [
    "Residential homes with stable grid supply",
    "Commercial buildings (offices, shops, malls)",
    "Industries aiming to reduce electricity bills"
];

async function sync() {
    try {
        console.log('Fetching all products...');
        const response = await axios.get(GET_URL);
        const products = response.data;
        console.log(`Found ${products.length} products.`);

        let updatedCount = 0;
        for (const p of products) {
            const title = (p.title || '').toLowerCase();
            const productType = (p.productType || p.product_type || '').toLowerCase();
            
            let shouldUpdate = false;
            let targetBenefits = p.benefits || [];
            let targetApplications = p.applications || [];

            // Detect Hybrid
            if (title.includes('hybrid') || productType.includes('hybrid')) {
                console.log(`Updating Hybrid: ${p.title}`);
                targetBenefits = HYBRID_BENEFITS;
                targetApplications = HYBRID_APPLICATIONS;
                shouldUpdate = true;
            } 
            // Detect On Grid
            else if (title.includes('on grid') || title.includes('on-grid') || productType.includes('on-grid') || productType.includes('on grid')) {
                console.log(`Updating On-Grid: ${p.title}`);
                targetBenefits = ONGRID_BENEFITS;
                targetApplications = ONGRID_APPLICATIONS;
                shouldUpdate = true;
            }

            if (shouldUpdate) {
                const payload = {
                    ...p,
                    benefits: targetBenefits,
                    applications: targetApplications
                };

                await axios.put(API_URL, payload);
                updatedCount++;
                console.log(`Successfully updated ${p.title}`);
            }
        }

        console.log(`Sync complete. Updated ${updatedCount} products.`);
    } catch (error) {
        console.error('Sync failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

sync();
