const fs = require('fs');
function cleanShop() {
  const content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes('const categories = ['));
  const end = lines.findIndex(l => l.includes('const brandInfo: Record'));
  if (start > -1 && end > -1) {
    lines.splice(start, end - start);
    fs.writeFileSync('src/pages/Shop.tsx', lines.join('\n'));
    console.log('Cleaned Shop.tsx');
  }
}
function cleanProductDetail() {
  const content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');
  const lines = content.split('\n');
  const start = lines.findIndex(l => l.includes('const products: Record<string'));
  const end = lines.findIndex(l => l.includes('const ProductDetail = () => {')) - 1;
  const isFunction = end < 0 ? lines.findIndex(l => l.includes('function ProductDetail')) - 1 : end;
  const finalEnd = isFunction < 0 ? lines.findIndex(l => l.includes('export default')) - 1 : isFunction;
  if (start > -1 && finalEnd > -1 && finalEnd > start) {
    console.log(`ProductDetail splicing from ${start} to ${finalEnd}`);
    lines.splice(start, finalEnd - start);
    fs.writeFileSync('src/pages/ProductDetail.tsx', lines.join('\n'));
    console.log('Cleaned ProductDetail.tsx');
  } else {
    console.log('Failed to clean ProductDetail', { start, end, isFunction, finalEnd });
  }
}
cleanShop();
cleanProductDetail();
