import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type CartItem = {
    id: string;
    name: string;
    category: string;
    brand?: string;
    capacity: string;
    price: number;
    image: string;
    warranty: string;
    quantity: number;
    gstPercent?: number;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    updateCartItemData: (id: string, data: Partial<CartItem>) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    totalGst: number;
    grandTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem('eversol_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('eversol_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                // Merge latest product data (e.g. gstPercent) + increment quantity
                return prev.map(i => i.id === product.id ? { ...i, ...product, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) { removeFromCart(id); return; }
        setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const updateCartItemData = useCallback((id: string, data: Partial<CartItem>) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    }, []);

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalGst = items.reduce((sum, i) => {
        const gst = (i.gstPercent || 0) > 0 ? (i.price * i.quantity * (i.gstPercent || 0)) / 100 : 0;
        return sum + gst;
    }, 0);
    const grandTotal = totalPrice + totalGst;

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, updateCartItemData, clearCart, totalItems, totalPrice, totalGst, grandTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
