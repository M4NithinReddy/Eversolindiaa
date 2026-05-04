const https = require('https');

// ✅ FIXED: Use working API
const API_URL = 'https://dmbnvtbx0d.execute-api.ap-south-1.amazonaws.com/prod/products';

// ⚠️ IMPORTANT: Change this if your edit API is in same gateway
const UPDATE_URL = 'https://dmbnvtbx0d.execute-api.ap-south-1.amazonaws.com/prod/products';

const hybridMatter = {
    benefits: [
        "Works with both grid and batteries",
        "Provides backup during power cuts",
        "Intelligent energy management (prioritizes solar usage)",
        "Flexible and future-ready (battery can be added later)"
    ],
    applications: [
        "Homes in areas with frequent power outages",
        "Small businesses needing uninterrupted power",
        "Rural and semi-urban installations"
    ]
};

// 🔹 Helper: GET request
function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => data += chunk);

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                } catch (err) {
                    reject(new Error('Invalid JSON response'));
                }
            });
        }).on('error', reject);
    });
}

// 🔹 Helper: POST request
function httpPost(url, body) {
    return new Promise((resolve) => {
        const parsedUrl = new URL(url);

        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => data += chunk);

            res.on('end', () => {
                console.log(`✅ Updated ${body.id} → Status: ${res.statusCode}`);
                resolve();
            });
        });

        req.on('error', (err) => {
            console.error(`❌ Error updating ${body.id}:`, err.message);
            resolve();
        });

        req.write(JSON.stringify(body));
        req.end();
    });
}

// 🔹 Main function
async function updateHybridProducts() {
    try {
        console.log('📦 Fetching products...');

        const response = await httpGet(API_URL);

        // ✅ FIXED: Correct parsing
        const products = response.data;

        if (!Array.isArray(products)) {
            console.error('❌ Invalid API response format:', response);
            return;
        }

        console.log(`📊 Total products: ${products.length}`);

        // 🔍 Filter hybrid products
        const hybridProducts = products.filter(p => {
            const title = (p.title || '').toLowerCase();
            const type = (p.product_type || p.productType || '').toLowerCase();
            const category = (p.category || '').toLowerCase();

            return (
                title.includes('hybrid') ||
                type.includes('hybrid') ||
                category.includes('hybrid')
            );
        });

        console.log(`⚡ Hybrid products found: ${hybridProducts.length}`);

        // 🔁 Update each product
        for (const product of hybridProducts) {
            const updatedProduct = {
                ...product,
                benefits: hybridMatter.benefits,
                applications: hybridMatter.applications
            };

            console.log(`🔄 Updating ${product.id} (${product.title})...`);
            await httpPost(UPDATE_URL, updatedProduct);
        }

        console.log('🎉 All updates completed successfully!');
    } catch (err) {
        console.error('❌ Fatal error:', err.message);
    }
}

// ▶️ Run script
updateHybridProducts();