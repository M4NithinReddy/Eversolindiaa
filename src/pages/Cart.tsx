import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, MessageCircle, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// WhatsApp business number — update this to the real number
const WHATSAPP_NUMBER = '919902843835'; // Format: country code + number, no + or spaces

const Cart = () => {
    const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

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
            if (item.price > 0) lines.push(`   • Price: ${formatPrice(item.price * item.quantity)}`);
            else lines.push(`   • Price: Price on Request`);
            lines.push('');
        });

        lines.push('─────────────────────────');
        if (totalPrice > 0) {
            lines.push(`*Total: ${formatPrice(totalPrice)}*`);
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
                                    {items.map(item => (
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

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        {item.price > 0 ? (
                                                            <span className="text-lg font-bold text-orange-600">{formatPrice(item.price * item.quantity)}</span>
                                                        ) : (
                                                            <span className="text-sm font-semibold text-gray-500 italic">Price on Request</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                                    <div className="space-y-3 mb-6">
                                        {items.map(item => (
                                            <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                                <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                                                <span className="shrink-0 font-medium">
                                                    {item.price > 0 ? formatPrice(item.price * item.quantity) : 'On Request'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-gray-900">Total</span>
                                            <span className="text-xl font-bold text-orange-600">
                                                {totalPrice > 0 ? formatPrice(totalPrice) : 'Price on Request'}
                                            </span>
                                        </div>
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
