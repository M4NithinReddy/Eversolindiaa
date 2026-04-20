const http = require('https');

const API_URL = 'https://jj43j7i7m6.execute-api.ap-south-1.amazonaws.com/prod/getall?all=true';
const UPDATE_URL = 'https://jj43j7i7m6.execute-api.ap-south-1.amazonaws.com/prod/edit';

const hybridMatter = {
    benefits: [
        "Works with both grid and batteries",
        "Provides backup during power cuts",
        "Intelligent energy management (prioritizes solar usage)",
        "Flexible and future-ready (battery can be added later)"
    ].join(','),
    applications: [
        "Homes in areas with frequent power outages",
        "Small businesses needing uninterrupted power",
        "Rural and semi-urban installations"
    ].join(',')
};

async function updateHybridProducts() {
    console.log('Fetching products...');
    
    return new Promise((resolve, reject) => {
        http.get(API_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', async () => {
                try {
                    const response = JSON.parse(data);
                    const productsBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
                    
                    if (!Array.isArray(productsBody)) {
                        console.error('Unexpected body format:', productsBody);
                        return resolve();
                    }

                    console.log(`Total products found: ${productsBody.length}`);
                    
                    const hybridProducts = productsBody.filter(p => {
                        const title = (p.title || '').toLowerCase();
                        const type = (p.product_type || p.productType || '')?.toLowerCase();
                        const category = (p.category || '').toLowerCase();
                        return title.includes('hybrid') || type?.includes('hybrid') || category.includes('hybrid');
                    });

                    console.log(`Found ${hybridProducts.length} hybrid products to update.`);

                    for (const product of hybridProducts) {
                        const updatedProduct = {
                            ...product,
                            benefits: hybridMatter.benefits,
                            applications: hybridMatter.applications
                        };

                        console.log(`Updating ${product.id} (${product.title})...`);
                        await postUpdate(updatedProduct);
                    }

                    console.log('Update complete.');
                    resolve();
                } catch (e) {
                    console.error('Parsing error:', e.message);
                    resolve();
                }
            });
        }).on('error', (e) => {
            console.error('Fetch error:', e.message);
            resolve();
        });
    });
}

function postUpdate(product) {
    return new Promise((resolve) => {
        const url = new URL(UPDATE_URL);
        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Response for ${product.id}: ${res.statusCode}`);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`Error updating ${product.id}:`, e.message);
            resolve();
        });

        req.write(JSON.stringify(product));
        req.end();
    });
}

updateHybridProducts();
