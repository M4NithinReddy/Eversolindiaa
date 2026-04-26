import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAdmin } from '@/context/AdminContext';
import { useEffect } from 'react';

// WhatsApp business number — update this to the real number
const WHATSAPP_NUMBER = '919902843835'; // Format: country code + number, no + or spaces

const Cart = () => {
    const { items, removeFromCart, updateQuantity, updateCartItemData, clearCart, totalItems, totalPrice, totalGst, grandTotal } = useCart();
    const { data: adminData } = useAdmin();
    const navigate = useNavigate();

    // Auto-enrich cart items with latest product data (e.g. gstPercent)
    useEffect(() => {
        if (adminData.products.length === 0 || items.length === 0) return;
        items.forEach(item => {
            const product = adminData.products.find(p => p.id === item.id);
            if (product && (product.gstPercent || 0) !== (item.gstPercent || 0)) {
                updateCartItemData(item.id, { gstPercent: product.gstPercent || 0 });
            }
        });
    }, [adminData.products]); // only when products data loads

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

    const handleWhatsAppCheckout = () => {
        if (items.length === 0) return;

        const lines: string[] = [
            '🌞 *New Order from Eversol India Website*',
            '',
            '*Order Summary:*',
            '─────────────────────────',
        ];

        items.forEach((item, i) => {
            lines.push(`${i + 1}. *${item.name}*`);
            lines.push(`   • Category: ${item.category}`);
            if (item.brand) lines.push(`   • Brand: ${item.brand}`);
            lines.push(`   • Capacity: ${item.capacity}`);
            lines.push(`   • Warranty: ${item.warranty}`);
            lines.push(`   • Qty: ${item.quantity}`);
            if (item.price > 0) {
                const itemTotal = item.price * item.quantity;
                lines.push(`   • Price: ${formatPrice(itemTotal)}`);
                if ((item.gstPercent || 0) > 0) {
                    const gstAmt = (itemTotal * (item.gstPercent || 0)) / 100;
                    lines.push(`   • GST (${item.gstPercent}%): ${formatPrice(gstAmt)}`);
                }
            } else {
                lines.push(`   • Price: Price on Request`);
            }
            lines.push('');
        });

        lines.push('─────────────────────────');
        if (totalPrice > 0) {
            lines.push(`*Subtotal: ${formatPrice(totalPrice)}*`);
            if (totalGst > 0) {
                lines.push(`*GST: ${formatPrice(totalGst)}*`);
            }
            lines.push(`*Grand Total: ${formatPrice(grandTotal)}*`);
        } else {
            lines.push(`*Total Items: ${totalItems}*`);
            lines.push('*Pricing: Available on Request*');
        }
        lines.push('');
        lines.push('Please confirm availability and pricing. Thank you! 🙏');

        const message = encodeURIComponent(lines.join('\n'));
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <ShoppingCart className="h-8 w-8 text-orange-500" />
                                Your Cart
                            </h1>
                            <p className="text-gray-500 mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
                        </div>
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-24"
                        >
                            <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500 mb-8">Add some solar products to get started.</p>
                            <Button asChild variant="solar" size="lg">
                                <Link to="/shop">Browse Products</Link>
                            </Button>
                        </motion.div>
                    )}

                    {/* Cart Items + Summary */}
                    {items.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Items List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-semibold text-gray-700">Cart Items</h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" /> Clear All
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {items.map(item => {
                                        const itemSubtotal = item.price * item.quantity;
                                        const itemGst = (item.gstPercent || 0) > 0 ? (itemSubtotal * (item.gstPercent || 0)) / 100 : 0;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex gap-4 p-4"
                                            >
                                                {/* Product Image */}
                                                <Link to={`/product/${item.id}`} className="shrink-0">
                                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain p-2"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <Link to={`/product/${item.id}`} className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                                                                {item.name}
                                                            </Link>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{item.category}</span>
                                                                {item.brand && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.brand}</span>}
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{item.capacity}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-3">
                                                        {/* Quantity */}
                                                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Minus className="h-3 w-3 text-gray-700" />
                                                            </button>
                                                            <span className="text-sm font-semibold text-gray-900 w-5 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3 text-gray-700" />
                                                            </button>
                                                        </div>

                                                        {/* Price + GST */}
                                                        <div className="text-right">
                                                            {item.price > 0 ? (
                                                                <>
                                                                    <span className="text-lg font-bold text-orange-600">{formatPrice(itemSubtotal)}</span>
                                                                    {itemGst > 0 && (
                                                                        <p className="text-[11px] text-amber-600 font-medium">
                                                                            + {formatPrice(itemGst)} GST ({item.gstPercent}%)
                                                                        </p>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span className="text-sm font-semibold text-gray-500 italic">Price on Request</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        {items.map(item => {
                                            const itemSubtotal = item.price * item.quantity;
                                            return (
                                                <div key={item.id} className="text-sm text-gray-600">
                                                    <div className="flex justify-between">
                                                        <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                                                        <span className="shrink-0 font-medium">
                                                            {item.price > 0 ? formatPrice(itemSubtotal) : 'On Request'}
                                                        </span>
                                                    </div>
                                                    {item.price > 0 && (item.gstPercent || 0) > 0 && (
                                                        <div className="flex justify-between text-xs text-amber-600 mt-0.5 pl-2">
                                                            <span>GST ({item.gstPercent}%)</span>
                                                            <span>+ {formatPrice((itemSubtotal * (item.gstPercent || 0)) / 100)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-6 space-y-2">
                                        {/* Subtotal */}
                                        <div className="flex justify-between items-center text-sm text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium">
                                                {totalPrice > 0 ? formatPrice(totalPrice) : 'On Request'}
                                            </span>
                                        </div>

                                        {/* GST Total */}
                                        {totalGst > 0 && (
                                            <div className="flex justify-between items-center text-sm text-amber-700">
                                                <span className="flex items-center gap-1.5">
                                                    GST
                                                </span>
                                                <span className="font-medium">+ {formatPrice(totalGst)}</span>
                                            </div>
                                        )}

                                        {/* Grand Total */}
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <span className="font-bold text-gray-900">Grand Total</span>
                                            <span className="text-xl font-bold text-orange-600">
                                                {grandTotal > 0 ? formatPrice(grandTotal) : 'Price on Request'}
                                            </span>
                                        </div>

                                        {totalGst > 0 && (
                                            <p className="text-[10px] text-gray-400 text-right">
                                                Includes ₹{totalGst.toLocaleString('en-IN', { maximumFractionDigits: 0 })} in GST
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-1">
                                            *Final pricing confirmed via WhatsApp
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg shadow-green-200 transition-all duration-300 hover:scale-[1.02]"
                                        onClick={handleWhatsAppCheckout}
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        Checkout via WhatsApp
                                    </Button>

                                    <p className="text-xs text-center text-gray-400 mt-3">
                                        Your cart details will be sent as a WhatsApp message to our team
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <Button asChild variant="outline" className="w-full">
                                            <Link to="/shop">Continue Shopping</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
