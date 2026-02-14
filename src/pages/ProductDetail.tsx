import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, ShoppingCart, Check, ArrowLeft, Phone, Shield, Award, Truck, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Image360Viewer } from '@/components/product/Image360Viewer';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';

// Product type definitions
type ProductSpecification = {
  label: string;
  value: string | number;
} | Record<string, string | number>;

type Product = {
  id: string | number;
  name: string;
  category: string;
  brand?: string;
  capacity: string;
  price: number;
  benefit?: string;
  image: string;
  images?: string[];
  warranty: string;
  description?: string;
  specifications: ProductSpecification[] | Record<string, string | number>;
  features?: string[];
  benefits?: string[];
  applications?: string[];
  datasheet?: string;
  images360?: string[];
  inverterType?: string;
};

// Products object with string keys
const products: Record<string, Product> = {
  // Solar Storage Products
  'solaryaan-aio-series': {
    id: 'solaryaan-aio-series',
    name: 'AIO Series',
    category: 'Solar Storage',
    brand: 'Solaryaan',
    capacity: '3-10kWh',
    price: 0,
    benefit: 'Next-gen energy storage with integrated inverter/charger',
    image: '/images/AIOseries.png',
    warranty: '10 Years',
    description: 'The Solaryaan AIO Series is a fully integrated energy storage solution that combines an inverter, MPPT solar charger, and AC charger in one compact unit. With a modular design, it allows for easy expansion from 3kWh to 10kWh to meet growing energy needs. Featuring advanced battery management and multiple operation modes, it ensures reliable power supply and maximum energy savings.',
    specifications: {
      'Model': 'AIO-3H to AIO-10H',
      'Max. PV Array Power': '10,000-20,000 Wp',
      'Battery Type': 'Li-ion / Lead Acid',
      'Battery Voltage': '48V',
      'Efficiency': 'Up to 97.6%',
      'MPPT Efficiency': '99.9%',
      'Protections': 'Over voltage, Short circuit, Reverse polarity, Over temperature',
      'Communication': 'RS485/CAN/Bluetooth',
      'Cooling': 'Intelligent fan cooling',
      'Dimensions': '440 x 420 x 220mm',
      'Weight': '15-35kg (varies by model)'
    },
    features: [
      'Fully integrated storage system',
      'Minimalist design for easy installation',
      'Double off-grid backup capability',
      'Two-channel UPS function',
      'Smart APP monitoring',
      'Multiple operation modes',
      'Parallel operation for higher power',
      'Generator compatible'
    ],
    benefits: [
      'All-in-one solution reduces installation complexity',
      'High efficiency conversion for maximum energy savings',
      'Seamless switch between grid and battery power',
      'Quiet operation with intelligent cooling',
      'Real-time monitoring and control via mobile app'
    ],
    applications: [
      'Residential energy storage',
      'Small commercial applications',
      'Backup power systems',
      'Off-grid solar systems',
      'Peak shaving and load shifting'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1huZDjhkJjCmmsIPVham8zSu8BI9WK0im'
  },
  'solaryaan-hv6': {
    id: 'solaryaan-hv6',
    name: 'HV 6 HIGH VOLTAGE STORAGE BATTERY',
    category: 'Solar Storage',
    brand: 'Solaryaan',
    capacity: '5.76kWh (expandable to 23.04kWh)',
    price: 0,
    benefit: 'High-performance, scalable battery storage system',
    image: '/images/HV6.png',
    warranty: '10 Years',
    description: 'The Solaryaan HV 6 is a high-voltage lithium iron phosphate (LFP) battery system designed for residential and commercial energy storage. With a modular design, it can be expanded from 5.76kWh up to 23.04kWh to meet various energy demands. The system features a high energy density, long cycle life, and IP65 protection for both indoor and outdoor installations.',
    specifications: {
      'Model': 'Li-6KHV',
      'Battery Type': 'LFP (LiFePO₄)',
      'Nominal Energy': '5.76 kWh',
      'Operating Voltage': '174V - 219V',
      'Depth of Discharge': '90%',
      'Cycle Life': '6000+ cycles @ 90% DoD',
      'Efficiency': '≥ 95%',
      'Weight': '51 kg',
      'Dimensions': '600 x 670 x 220 mm',
      'Protection': 'IP65',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'Certification': 'UN38.3, IEC62619, CE, RCM'
    },
    features: [
      'Scalable to 23.04kWh',
      '90% Depth of Discharge',
      'Floor or Wall Mounting',
      'Compact & Easy Installation',
      'IP65 Protection Level',
      'High Voltage and High Efficiency',
      'Modular Design',
      'Smart BMS with Active Balancing'
    ],
    benefits: [
      'Higher system efficiency with high voltage design',
      'Longer lifespan with LFP chemistry',
      'Wide operating temperature range',
      'Safe and stable performance',
      'Easy maintenance and expansion'
    ],
    applications: [
      'Home energy storage systems',
      'Commercial energy storage',
      'Solar self-consumption',
      'Peak shaving',
      'Backup power'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1Y9nu93ZcNkOJUcignPtmWEiaiXi2v-md'
  },
  'solplanet-ess': {
    id: 'solplanet-ess',
    name: 'ESS Storage System',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-15kWh',
    price: 0,
    benefit: 'Modular energy storage solution for home and business',
    image: '/images/solplanet-ess.jpg',
    warranty: '10 Years',
    description: 'The Solplanet ESS (Energy Storage System) is a versatile and scalable solution designed for both residential and commercial applications. With a modular design, it allows for flexible capacity expansion from 5kWh to 15kWh. The system features advanced battery management, multiple operation modes, and seamless integration with solar PV systems for maximum energy independence and cost savings.',
    specifications: {
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '5-15kWh',
      'Nominal Voltage': '51.2V',
      'Usable Energy': '4.8-14.4kWh',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Communication': 'CAN/RS485',
      'Protection': 'IP55',
      'Operating Temperature': '-10°C to 50°C',
      'Dimensions': '600 x 900 x 200mm (per module)',
      'Weight': '70-210kg (varies by capacity)'
    },
    features: [
      'Modular design for flexible capacity',
      'High energy density',
      'Long cycle life',
      'Smart BMS protection',
      'Wide operating temperature range',
      'Multiple operation modes',
      'Cloud monitoring',
      'Easy installation and maintenance'
    ],
    benefits: [
      'Significant reduction in electricity bills',
      'Energy independence and security',
      'Environmentally friendly energy solution',
      'Low maintenance requirements',
      'Future-proof and scalable system'
    ],
    applications: [
      'Residential energy storage',
      'Commercial and industrial applications',
      'Peak shaving and load shifting',
      'Backup power systems',
      'Microgrid applications'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1FrRIvSW_k_5MCceitoKiMkgZ2dVDRWAq'
  },
  'solplanet-ai-hb-g2': {
    id: 'solplanet-ai-hb-g2',
    name: 'Ai-HB G2 Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-20kWh',
    price: 0,
    benefit: 'High-voltage battery for seamless integration with hybrid inverters',
    image: '/images/solarstorage1.1.png',
    warranty: '10 Years',
    description: 'The Solplanet Ai-HB G2 Series is a high-voltage battery system designed for seamless integration with hybrid inverters. With a capacity ranging from 5kWh to 20kWh, it offers reliable energy storage for residential and commercial applications.',
    specifications: {
      'Series': 'Ai-HB G2',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '5-20kWh',
      'Nominal Voltage': '153.6V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'IP Rating': 'IP65',
      'Dimensions': '600 × 250 × 800 mm',
      'Weight': '70 kg'
    },
    features: [
      'Seamless integration with hybrid inverters',
      'Modular design for flexible capacity',
      'High energy density',
      'Long cycle life',
      'Smart BMS protection',
      'Wide operating temperature range',
      'Wall-mountable design',
      'Real-time monitoring'
    ],
    benefits: [
      'Maximizes self-consumption of solar energy',
      'Reduces electricity bills',
      'Provides backup power during outages',
      'Scalable to meet growing energy needs',
      'Eco-friendly energy solution'
    ],
    applications: [
      'Residential energy storage',
      'Commercial energy storage',
      'Hybrid solar systems',
      'Peak shaving',
      'Load shifting'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1FrRIvSW_k_5MCceitoKiMkgZ2dVDRWAq',
    images: [
      '/images/solarstorage1.1.png',
      '/images/solarstorage1.2.png',
      '/images/solarstorage1.3.png',
      '/images/solarstorage1.4.png',
      '/images/solarstorage1.5.png'
    ]
  },
  'solplanet-ai-hb-g2-pro': {
    id: 'solplanet-ai-hb-g2-pro',
    name: 'Ai-HB G2 Pro Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '7.5-20kWh',
    price: 0,
    benefit: 'Advanced high-voltage battery with enhanced performance',
    image: '/images/solarstorage2.1.png',
    warranty: '10 Years',
    description: 'The Solplanet Ai-HB G2 Pro Series is an advanced high-voltage battery system offering enhanced performance and reliability. With a capacity range of 7.5kWh to 20kWh, it provides efficient energy storage for demanding applications.',
    specifications: {
      'Series': 'Ai-HB G2 Pro',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '7.5-20kWh',
      'Nominal Voltage': '153.6V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'IP Rating': 'IP65',
      'Dimensions': '600 × 300 × 800 mm',
      'Weight': '85 kg'
    },
    features: [
      'Enhanced performance and reliability',
      'Higher energy density',
      'Advanced thermal management',
      'Modular and scalable design',
      'Real-time monitoring and control',
      'IP65 protection for outdoor installation',
      'Long cycle life',
      'Compatible with hybrid inverters'
    ],
    benefits: [
      'Optimized energy management',
      'Reduced energy costs',
      'High system efficiency',
      'Reliable backup power',
      'Easy system expansion'
    ],
    applications: [
      'Residential energy storage',
      'Commercial energy storage',
      'Hybrid solar systems',
      'Peak shaving',
      'Microgrid applications'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=13dXjBpQ-YtjLWEtYo1iYH2GLIUrqfaRj',
    images: [
      '/images/solarstorage2.1.png',
      '/images/solarstorage2.2.png',
      '/images/solarstorage2.3.png',
      '/images/solarstorage2.4.png',
      '/images/solarstorage2.5.png',
      '/images/solarstorage2.6.png'
    ]
  },
  'solplanet-ai-hb-g2-e-50-20kwh': {
    id: 'solplanet-ai-hb-g2-e-50-20kwh',
    name: 'Ai-HB G2-E 50-20kWh Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-20kWh',
    price: 0,
    benefit: 'High-capacity energy storage solution for residential and commercial use',
    image: '/images/solarstorage3.1.png',
    warranty: '10 Years',
    description: 'The Solplanet Ai-HB G2-E 50-20kWh Series is a high-capacity energy storage solution designed for both residential and commercial applications. With its modular design, it can be easily expanded from 5kWh to 20kWh to meet growing energy demands.',
    specifications: {
      'Series': 'Ai-HB G2-E',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '5-20kWh',
      'Nominal Voltage': '153.6V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'IP Rating': 'IP65',
      'Dimensions': '600 × 250 × 800 mm',
      'Weight': '75 kg'
    },
    features: [
      'High-capacity energy storage',
      'Modular design for flexible expansion',
      'High energy density',
      'Advanced battery management system',
      'Real-time monitoring and control',
      'Suitable for both residential and commercial applications',
      'Long cycle life',
      'Wide operating temperature range'
    ],
    benefits: [
      'Maximizes energy independence',
      'Reduces electricity costs',
      'Reliable backup power',
      'Scalable solution',
      'Eco-friendly energy storage'
    ],
    applications: [
      'Residential energy storage',
      'Commercial energy storage',
      'Hybrid solar systems',
      'Peak shaving',
      'Load shifting'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=17NLfhMhS8T0ADJW_9cppxmAg31wn2ZwO',
    images: [
      '/images/solarstorage3.1.png',
      '/images/solarstorage3.2.png',
      '/images/solarstorage3.3.png',
      '/images/solarstorage3.4.png'
    ]
  },
  'solplanet-ai-lb-g3': {
    id: 'solplanet-ai-lb-g3',
    name: 'Ai-LB G3 Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '4.8-19.2kWh',
    price: 0,
    benefit: 'Advanced low-voltage battery system with high efficiency',
    image: '/images/solarstorage4.1.png',
    warranty: '10 Years',
    description: 'The Solplanet Ai-LB G3 Series is an advanced low-voltage battery system designed for high efficiency and reliability. With a capacity range of 4.8kWh to 19.2kWh, it offers flexible energy storage solutions for various applications.',
    specifications: {
      'Series': 'Ai-LB G3',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '4.8-19.2kWh',
      'Nominal Voltage': '51.2V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'IP Rating': 'IP65',
      'Dimensions': '442 × 420 × 150 mm',
      'Weight': '50 kg'
    },
    features: [
      'Low-voltage battery system',
      'High energy efficiency',
      'Modular design for flexible capacity',
      'Advanced BMS protection',
      'Real-time monitoring and control',
      'Suitable for various applications',
      'Long cycle life',
      'Compact and space-saving design'
    ],
    benefits: [
      'Cost-effective energy storage',
      'Easy installation and maintenance',
      'High system efficiency',
      'Reliable performance',
      'Scalable solution'
    ],
    applications: [
      'Residential energy storage',
      'Small commercial applications',
      'Hybrid solar systems',
      'Backup power systems',
      'Off-grid applications'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1ghRVH4oWVGDJwEZp0BZt2xuj7-JvzvIZ',
    images: [
      '/images/solarstorage4.1.png',
      '/images/solarstorage4.2.png',
      '/images/solarstorage4.3.png',
      '/images/solarstorage4.4.png',
      '/images/solarstorage4.5.png',
      '/images/solarstorage4.6.png',
      '/images/solarstorage4.7.png',
      '/images/solarstorage4.8.png',
      '/images/solarstorage4.9.png'
    ]
  },
  'solplanet-ai-lb-e-series': {
    id: 'solplanet-ai-lb-e-series',
    name: 'Ai-LB E Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-12kWh',
    price: 0,
    benefit: 'Economical low-voltage battery solution for residential energy storage',
    image: '/images/solarstorage5.1.png',
    warranty: '10 Years',
    description: 'The Solplanet Ai-LB E Series is an economical low-voltage battery solution designed for residential energy storage. With a capacity range of 5kWh to 12kWh, it provides reliable energy storage at an affordable price point.',
    specifications: {
      'Series': 'Ai-LB E',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '5-12kWh',
      'Nominal Voltage': '51.2V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485',
      'IP Rating': 'IP65',
      'Dimensions': '442 × 420 × 150 mm',
      'Weight': '48 kg'
    },
    features: [
      'Cost-effective energy storage solution',
      'Easy installation and maintenance',
      'Modular design for capacity expansion',
      'Reliable performance',
      'Real-time monitoring capability',
      'Suitable for residential applications',
      'Long cycle life',
      'Compact and lightweight design'
    ],
    benefits: [
      'Affordable energy storage',
      'Reduced electricity bills',
      'Backup power during outages',
      'Easy to install and maintain',
      'Eco-friendly solution'
    ],
    applications: [
      'Residential energy storage',
      'Solar self-consumption',
      'Backup power systems',
      'Load shifting',
      'Peak shaving'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1K92s-pug2Y8RZjdLbm8hGz8IXyMwJXrC',
    images: [
      '/images/solarstorage5.1.png',
      '/images/solarstorage5.2.png'
    ]
  },
  // Panasonic Solar Products
  'panasonic-bifacial': {
    id: 'panasonic-bifacial',
    name: 'Bifacial Mono PERC',
    category: 'Solar Modules',
    capacity: '535–550Wp',
    price: 0, // Price on request
    image: '/images/panasonic1.png',
    warranty: '12 Years',
    description: 'Maximise solar gains with our industry-leading bifacial solar modules, featuring front side efficiency up to 21.32% and the added capability for rear side generation. Tailored for ground-mount projects, these M10-10BB-144 cells come with a 12-year product and 25-year performance warranty. BIS certified, DCR available in 535W, and boasting an annual degradation rate of 2% for the first year and 0.55% thereafter.',
    specifications: [
      { label: 'Cell Type', value: 'Bifacial Mono PERC' },
      { label: 'Power Output', value: '535–550Wp' },
      { label: 'Front Side Efficiency', value: 'Up to 21.32%' },
      { label: 'Cell Configuration', value: 'M10-10BB-144' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '25 Years' },
      { label: 'Degradation Rate', value: '2% first year, 0.55% thereafter' },
      { label: 'Certification', value: 'BIS Certified' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: 'Tempered, anti-reflective' },
      { label: 'Temperature Range', value: '-40°C to +85°C' }
    ],
    benefits: [
      'Industry-leading bifacial technology for maximum energy yield',
      'High front side efficiency up to 21.32%',
      'Additional energy generation from rear side',
      'Low degradation rate ensures long-term performance',
      'Ideal for ground-mount installations',
      'BIS certified for quality assurance'
    ],
    applications: [
      'Utility-scale solar farms',
      'Ground-mounted solar plants',
      'Commercial and industrial rooftops',
      'Solar carports',
      'Agri-voltaic installations'
    ],
    datasheet: '/datasheets/panasonic-bifacial-datasheet.pdf'
  },
  'panasonic-topcon': {
    id: 'panasonic-topcon',
    name: 'N TYPE TOPCon Bifacial',
    category: 'Solar Modules',
    capacity: '570–585Wp',
    price: 0, // Price on request
    image: '/images/panasonic2.png',
    warranty: '15 Years',
    description: 'TOPCon Modules come with 15-year product warranty and a 30-year performance warranty, ensuring long-term reliability. They feature a minimal first-year degradation rate of just 1% and boast the lowest temperature coefficient, enhancing their efficiency and performance. With a sleek design and high efficiency of up to 22.66%, these panels deliver reliable energy production. Additionally, they offer bifaciality factor of 80% ±10%. Designed for durability and optimal performance, these panels are built to provide exceptional and sustained energy output over their lifetime.',
    specifications: [
      { label: 'Cell Type', value: 'N-Type TOPCon Bifacial' },
      { label: 'Power Output', value: '570–585Wp' },
      { label: 'Efficiency', value: 'Up to 22.66%' },
      { label: 'Bifaciality Factor', value: '80% ±10%' },
      { label: 'Product Warranty', value: '15 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Degradation Rate', value: '1% first year, 0.4% thereafter' },
      { label: 'Temperature Coefficient', value: '-0.29%/°C' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Temperature Range', value: '-40°C to +85°C' }
    ],
    benefits: [
      'Industry-leading 30-year performance warranty',
      'Ultra-low degradation rate for long-term reliability',
      'High efficiency up to 22.66%',
      'Excellent temperature coefficient for better performance in hot climates',
      'Bifacial design for additional energy yield',
      'Sleek, all-black aesthetic design'
    ],
    applications: [
      'Residential rooftops',
      'Commercial and industrial installations',
      'Utility-scale solar farms',
      'Carports and canopies',
      'Building-integrated photovoltaics (BIPV)'
    ],
    datasheet: '/datasheets/panasonic-topcon-datasheet.pdf'
  },
  // Pahal Solar Products
  'pahal-mono': {
    id: 'pahal-mono',
    name: 'Mono Crystalline Solar Panel',
    category: 'Solar Modules',
    capacity: '540W',
    price: 0, // Price on request
    image: '/images/pahal-Mono-Crystalline-Panels.jpg',
    warranty: '12 Years',
    description: 'Mono Crystalline solar panels are crafted from single-crystal silicon, making them one of the most efficient and widely trusted solar technologies in the industry. With a uniform black appearance and a high power-to-size ratio, these panels are particularly suited for installations where space is limited but performance cannot be compromised.',
    specifications: [
      { label: 'Cell Type', value: 'Monocrystalline' },
      { label: 'Efficiency', value: 'Up to 22.5%' },
      { label: 'Power Output', value: '540W' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Temperature Range', value: '-40°C to +85°C' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '25 Years' },
      { label: 'Key Features', value: 'High efficiency, Excellent low-light performance, Aesthetic black design' }
    ],
    benefits: [
      'Superior energy conversion efficiency',
      'Excellent performance in low-light conditions',
      'Sleek, all-black design for aesthetic appeal',
      'Durable construction for long-term reliability',
      'Optimal performance in various weather conditions'
    ],
    applications: [
      'Residential rooftops',
      'Commercial buildings',
      'Industrial installations',
      'Solar farms',
      'Off-grid power systems'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1x_1TOACrNbTmAu-BBC1hInZHkmukLRqK'
  },
  'pahal-ntype': {
    id: 'pahal-ntype',
    name: 'N-Type TOPCon Bifacial Panel',
    category: 'Solar Modules',
    capacity: '570W',
    price: 0, // Price on request
    image: '/images/pahal-N-Type-Topcon-Bifacial-Panels.jpg',
    warranty: '15 Years',
    description: 'Our N-Type TOPCon (Tunnel Oxide Passivated Contact) Bifacial panels are built on advanced cell technology that sets a new benchmark in solar performance. These panels use N-type silicon wafers, which are inherently more resistant to light-induced degradation (LID) and potential-induced degradation (PID) compared to traditional P-type cells.',
    specifications: [
      { label: 'Cell Type', value: 'N-Type TOPCon Bifacial' },
      { label: 'Efficiency', value: 'Up to 23.8%' },
      { label: 'Power Output', value: '570W' },
      { label: 'Bifacial Gain', value: 'Up to 30%' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, double glass' },
      { label: 'Temperature Range', value: '-40°C to +85°C' },
      { label: 'Product Warranty', value: '15 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Bifacial design, High efficiency, Low degradation, Excellent temperature coefficient' }
    ],
    benefits: [
      'Higher energy yield with bifacial power generation',
      'Lower degradation rate compared to conventional panels',
      'Better performance in high-temperature conditions',
      'Reduced LID and PID effects',
      'Longer lifespan and higher reliability'
    ],
    applications: [
      'Utility-scale solar farms',
      'Commercial and industrial rooftops',
      'Carports and canopies',
      'Ground-mounted systems',
      'Agri-voltaic installations'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1x_1TOACrNbTmAu-BBC1hInZHkmukLRqK'
  },

  // Waaree Products
  'waaree-550w-bifacial': {
    id: 'waaree-550w-bifacial',
    name: 'WAAREE 550Wp Mono PERC Bifacial',
    category: 'Solar Modules',
    capacity: '550W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3748/01__19559.1768629312.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3748/01__19559.1768629312.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3749/71Hd7QqqKJL._SL1080___22593.1768629306.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/1234/550_Wp_Dual_Glass_Bifacial_Module_04__36772.1768629306.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/1524/550-wp-dual-glass-bifacial-module-01-477__35397.1768629306.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3747/Comparison_Banner...__93984.1768629306.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/2594/50000_Happy_Customers_3-01__95076.1768629306.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3142/WAAREE_550Wp_144Cells_24_Volts_Framed_Dual_Glass_Mono_PERC_Bifacial_Solar_Module__46826__96315.1768629306.png?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3746/FTR_IMAGE_1__64311.1768629306.png?c=1'
    ],
    warranty: '12/30 Years',
    description: 'High-efficiency bifacial solar module with 144 half-cut cells, designed for maximum energy yield and durability. Features dual glass construction and excellent performance in various weather conditions.',
    specifications: [
      { label: 'Cell Type', value: 'Mono PERC Bifacial' },
      { label: 'Efficiency', value: 'Up to 21.3%' },
      { label: 'Dimensions', value: '2272 x 1133 x 35 mm' },
      { label: 'Weight', value: '28.5 kg' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Temperature Range', value: '-40°C to +85°C' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Dual glass, PID resistant, High wind/snow load' }
    ],
    benefits: [
      'Bifacial design for additional energy yield',
      'Low degradation rate for long-term performance',
      'Excellent weak light performance',
      'PID resistant for reliable operation',
      'Suitable for high snow and wind loads'
    ],
    applications: [
      'Utility-scale solar farms',
      'Commercial and industrial rooftops',
      'Ground-mounted systems',
      'Carports and canopies',
      'Agri-voltaic installations'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1b9sQeh_QTsuupK92esD2z8T7su-07VkJ'
  },
  'waaree-590w-ntype': {
    id: 'waaree-590w-ntype',
    name: 'WAAREE 590Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '590W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3804/WAAREE_585Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__30973.1768629417.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3804/WAAREE_585Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__30973.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2761/71HE6F68oFL._SL1500___08704_1__18143.1739269104.1280.1280__79051.1741078924.1280.1280__12570.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3751/Comparison_Banner...__69159.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2763/1740465877.1280.1280__45945.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2762/1740465877.1280.1280__88116.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3752/71Hd7QqqKJL._SL1080___57789.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3750/FTR_IMAGE_1__25614.1768629417.png?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2767/71YXLAPiSFL._SL1500___82657.1734949539.1280.1280__06104.1740465877.1280.1280__24752.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2772/50000_Happy_Customers_3-01__48104.1740465877.1280.1280__14348.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2770/1739358520.1280.1280__94882.1768629417.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2766/1739358520.1280.1280__38643.1768629418.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2769/1740465877.1280.1280__79304.1768629418.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/2764/61Pxu3nt_GL__72856.1734949539.1280.1280__45384.1739358520.1280.1280__04399.1768629418.jpg?c=1',

    ],
    warranty: '12/30 Years',
    description: 'Advanced N-Type bifacial solar module with high efficiency and excellent temperature coefficient. Features low degradation rate and enhanced performance in high-temperature conditions.',
    specifications: [
      { label: 'Cell Type', value: 'N-Type Bifacial' },
      { label: 'Efficiency', value: 'Up to 22.1%' },
      { label: 'Bifacial Gain', value: 'Up to 25%' },
      { label: 'Temperature Coefficient', value: '-0.29%/°C' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Low degradation, Better temperature coefficient' }
    ],
    benefits: [
      'N-type technology for higher efficiency',
      'Lower degradation rate',
      'Better temperature coefficient',
      'Enhanced bifacial performance',
      'PID resistant'
    ],
    applications: [
      'Utility-scale solar farms',
      'Commercial and industrial rooftops',
      'Ground-mounted systems',
      'Carports and canopies',
      'Agri-voltaic installations'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=13kF9yUv2z57iSsY_7lJpb7Hnq-YR3F2X'
  },
  'waaree-615w-ntype': {
    id: 'waaree-615w-ntype',
    name: 'WAAREE 615Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '615W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3796/WAAREE_610Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__30973.1768629417.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3017/1743403555.1280.1280__44679.1747990751.1280.1280__39449.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3805/WAAREE_585Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__83797.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3016/1747990720.1280.1280__72975.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3015/1743403555.1280.1280__38481.1747990720.1280.1280__82933.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3020/1747990720.1280.1280__87760.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3018/1747990720.1280.1280__17861.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3027/1743403555.1280.1280__72283.1747990720.1280.1280__92861.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3019/1747990720.1280.1280__84674.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3026/1747990720.1280.1280__27765.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3022/1747990720.1280.1280__66381.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3024/1747990720.1280.1280__72876.1768629566.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3025/1743403555.1280.1280__23892.1747990720.1280.1280__93782.1768629566.jpg?c=1',
    ],
    warranty: '12/30 Years',
    description: 'High-power N-Type bifacial module with excellent performance in various lighting conditions. Features advanced cell technology for maximum energy yield and reliability.',
    specifications: [
      { label: 'Cell Type', value: 'N-Type Bifacial' },
      { label: 'Efficiency', value: 'Up to 22.8%' },
      { label: 'Dimensions', value: '2279 x 1134 x 35 mm' },
      { label: 'Bifacial Gain', value: 'Up to 25%' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'High power output, Excellent temperature coefficient' }
    ],
    benefits: [
      'Higher power output for large installations',
      'Improved temperature coefficient',
      'Enhanced low-light performance',
      'Reduced LCOE (Levelized Cost of Electricity)',
      'Ideal for utility-scale projects'
    ],
    applications: [
      'Utility-scale solar farms',
      'Commercial and industrial rooftops',
      'Ground-mounted systems',
      'Carports and canopies',
      'Agri-voltaic installations'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=19TBMw0UGbV9eLtLudZmgMYpN62bKQ1cb'
  },
  'waaree-685w-ntype': {
    id: 'waaree-685w-ntype',
    name: 'WAAREE 685Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '685W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3812/WAAREE_680Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__30973.1768629417.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3806/WAAREE_585Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__42424.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3393/1743403555.1280.1280__86657.1759818123.1280.1280__35102.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3397/Comparison_Banner...__90090.1759818123.1280.1280__65532.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3388/1759818123.1280.1280__48291.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3389/1759818123.1280.1280__44029.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3702/71Hd7QqqKJL._SL1080___00048.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3390/1743403555.1280.1280__39673.1759818123.1280.1280__88936.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3400/1759818123.1280.1280__82270.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3392/1759818123.1280.1280__75585.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3394/1743403555.1280.1280__10921.1759818123.1280.1280__14348.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3399/1759818123.1280.1280__75821.1768629618.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3395/1743403555.1280.1280__94031.1759818124.1280.1280__87429.1768629618.jpg?c=1',


    ],
    warranty: '12/30 Years',
    description: 'Large format N-Type bifacial module with ultra-high power output and excellent performance. Ideal for utility-scale projects where maximum power density is required.',
    specifications: [
      { label: 'Cell Type', value: 'N-Type Bifacial' },
      { label: 'Efficiency', value: 'Up to 23.2%' },
      { label: 'Dimensions', value: '2384 x 1303 x 35 mm' },
      { label: 'Weight', value: '35.5 kg' },
      { label: 'Bifacial Gain', value: 'Up to 30%' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Large format, High power density, 30% bifacial gain' }
    ],
    benefits: [
      'Ultra-high power output',
      'Large format design',
      'High bifacial gain up to 30%',
      'Optimized for large-scale installations',
      'Reduced BOS (Balance of System) costs'
    ],
    applications: [
      'Utility-scale solar farms',
      'Large commercial installations',
      'Ground-mounted systems',
      'Solar parks',
      'Industrial rooftops'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1dK9BAx9M3Qvpnrafb8P7gbQaFQrYHpvb'
  },
  'waaree-600w-bifacial': {
    id: 'waaree-600w-bifacial',
    name: 'WAAREE 600Wp Mono PERC Bifacial',
    category: 'Solar Modules',
    capacity: '600W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3750/WAAREE_600Wp_144Cells_24_Volts_Framed_Dual_Glass_Mono_PERC_Bifacial_Solar_Module__30973.1768629306.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/1002/Bi_-_66_-_600_-01__80885.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/3636/Comparison_Banner...__32137.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/999/Bi_-_66_-_600_-05__55161.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/3638/05__82174.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/1001/Bi_-_66_-_600_-02__34301.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/1000/Bi_-_66_-_600_-06__14888.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/3640/06__30593.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/3639/50000_Happy_Customers_3-01__30923.1764587881.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/3637/FTR_IMAGE_1__76359.1764587881.png?c=1',
    ],
    warranty: '12/30 Years',
    description: 'Compact and efficient bifacial module with high power output. Features advanced cell technology for maximum energy yield in limited spaces.',
    specifications: [
      { label: 'Cell Type', value: 'Mono PERC Bifacial' },
      { label: 'Efficiency', value: 'Up to 21.8%' },
      { label: 'Dimensions', value: '2172 x 1303 x 35 mm' },
      { label: 'Weight', value: '32.5 kg' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Compact design, High power output, PID free' }
    ],
    benefits: [
      'Space-efficient design',
      'High power output in compact size',
      'Suitable for residential rooftops',
      'Excellent temperature coefficient',
      'PID resistant for long-term reliability'
    ],
    applications: [
      'Residential rooftops',
      'Small commercial installations',
      'Carports',
      'Balcony railings',
      'Urban solar installations'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1X1LM7WFQhEzaVUDANkG1P7rHe6orzas2'
  },
  'waaree-700w-topcon': {
    id: 'waaree-700w-topcon',
    name: 'WAAREE 700Wp TOPCon N-Type',
    category: 'Solar Modules',
    capacity: '700W',
    price: 0, // Price on request
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3820/WAAREE_700Wp_144Cells_24_Volts_TOPCon_N-Type_Framed_Dual_Glass_Bifacial_Solar_Module__30973.1768629417.jpg?c=1',
    images: [
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3688/01__25072.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3685/Bi_-_66_-_600_-06__14888.1764587881.1280.1280__54388.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3677/Comparison_Banner...__32137.1764587881.1280.1280__55829.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3684/Bi_-_66_-_600_-05__55161.1764587881.1280.1280__14588.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3686/71Hd7QqqKJL._SL1080___82162.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3683/05__82174.1764587881.1280.1280__41386.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3676/06__30593.1764587881.1280.1280__34714.1765977365.jpg?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3678/FTR_IMAGE_1__76359.1764587881.1280.1280__94132.1765977365.png?c=1',
      'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3681/50000_Happy_Customers_3-01__30923.1764587881.1280.1280__15355.1765977365.jpg?c=1',
    ],
    warranty: '12/30 Years',
    description: 'State-of-the-art TOPCon N-Type bifacial module with ultra-high efficiency and power output. Features advanced cell technology for maximum energy yield and reliability in various conditions.',
    specifications: [
      { label: 'Cell Type', value: 'TOPCon N-Type Bifacial' },
      { label: 'Efficiency', value: 'Up to 23.5%' },
      { label: 'Dimensions', value: '2384 x 1303 x 35 mm' },
      { label: 'Bifacial Gain', value: 'Up to 30%' },
      { label: 'Temperature Coefficient', value: '-0.28%/°C' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'TOPCon technology, Ultra-high efficiency, Low LCOE' }
    ],
    benefits: [
      'Advanced TOPCon cell technology',
      'Ultra-high efficiency up to 23.5%',
      '30% bifacial gain potential',
      'Lower temperature coefficient',
      'Ideal for utility and commercial installations'
    ],
    applications: [
      'Utility-scale solar farms',
      'Large commercial installations',
      'Industrial rooftops',
      'Solar parks',
      'Ground-mounted systems'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1TUyDzSHbNIyP5-1q89t7Hj5LC-2qEMXq'
  },
  'solex-tapi-rc': {
    id: 'solex-tapi-rc',
    name: 'SOLEX TAPI RC',
    category: 'Solar Modules',
    capacity: '665W',
    images360: Array.from({ length: 50 }, (_, i) => `https://solex.in/wp-content/uploads/tapiRCT/New/${i + 1}.png`),
    price: 0, // Price on request
    image: panelImg,
    warranty: '30 Years',
    description: 'Experience the future of solar technology with SOLEX TAPI RC (Rear Contact) modules. Featuring advanced rear contact cell technology, these panels deliver maximum power output with zero shading and ultimate performance. Perfect for high-end rooftops, commercial installations, and utility-scale projects.',
    specifications: [
      { label: 'Cell Type', value: 'Monocrystalline' },
      { label: 'Cell Technology', value: 'Rear Contact' },
      { label: 'Module Efficiency', value: 'Up to 24.6%' },
      { label: 'Frame', value: 'Anodized Aluminium Alloy' },
      { label: 'Glass', value: '3.2mm tempered, anti-reflective' },
      { label: 'Temperature Range', value: '-40°C to +85°C' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Linear Performance Warranty', value: '30 Years' },
      { label: 'Key Features', value: 'Zero Shading, Maximum Power, Ultimate Performance' }
    ],
    benefits: [
      'Lower LCOE (Levelized Cost of Electricity)',
      'Faster payback period',
      'Superior aesthetics for high-end installations',
      'Ideal for space-constrained rooftops',
      'Perfect for architectural solar (BIPV) applications',
      'Suitable for EV infrastructure and green projects',
      'Enhanced performance in hybrid installations',
      'Optimized for utility-scale projects'
    ],
    applications: [
      'High-end rooftops (villas, bungalows, premium societies)',
      'Commercial & Industrial (C&I) installations',
      'Utility-scale solar projects',
      'Architectural solar (BIPV) - facades, skylights, pergolas',
      'EV charging infrastructure',
      'Green building projects',
      'Solar carports and canopies'
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1V-o0EktjlwqPnuzcLQqB-vTve6onVqzt'
  },
  '1': {
    id: '1',
    name: 'EVERSOL Pro 550W Panel',
    category: 'Solar Panels',
    capacity: '550W',
    price: 15999,
    image: panelImg,
    warranty: '25 Years',
    description: 'The EVERSOL Pro 550W is our flagship monocrystalline solar panel, designed for maximum power output and durability. With industry-leading 22% efficiency, this panel generates more power per square foot than conventional panels.',
    specifications: [
      { label: 'Maximum Power', value: '550W' },
      { label: 'Cell Type', value: 'Monocrystalline PERC' },
      { label: 'Efficiency', value: '22.0%' },
      { label: 'Dimensions', value: '2278 x 1134 x 35mm' },
      { label: 'Weight', value: '28.5 kg' },
      { label: 'Voltage (Vmp)', value: '41.7V' },
      { label: 'Current (Imp)', value: '13.19A' },
      { label: 'Temperature Coefficient', value: '-0.34%/°C' },
      { label: 'Frame', value: 'Anodized Aluminum' },
      { label: 'Glass', value: '3.2mm Tempered Anti-reflective' },
    ],
    benefits: [
      'Highest efficiency in class at 22%',
      'Half-cut cell technology reduces power loss',
      'Anti-PID technology for long-term performance',
      'Excellent low-light performance',
      'Salt mist and ammonia resistant',
    ],
    applications: [
      'Residential rooftops',
      'Commercial buildings',
      'Solar farms',
      'Industrial installations',
    ],
    datasheet: 'https://solex.in/wp-content/uploads/2023/06/SOLEX-TAPI-RC-Datasheet.pdf',
  },
  'solex-tapi-r': {
    id: 'solex-tapi-r',
    name: 'SOLEX TAPI R',
    category: 'Solar Panels',
    capacity: '595-625W',
    price: 19999,
    image: panelImg,
    warranty: '30 Years',
    images360: Array.from({ length: 50 }, (_, i) => `https://solex.in/wp-content/uploads/tapi2/${i + 1}.png`),
    description: 'The SOLEX TAPI R is a next-generation N-Type TOPCon solar module designed to deliver superior performance with cutting-edge technology. With 23.61% module efficiency, this panel offers 600W+ output, higher conversion efficiency, and enhanced reliability over conventional modules.',
    specifications: [
      { label: 'Power Output', value: '595W - 625W' },
      { label: 'Cell Type', value: 'N-Type TOPCon' },
      { label: 'Module Efficiency', value: '23.61%' },
      { label: 'Cell Configuration', value: '132 Half Cut Cells' },
      { label: 'Product Warranty', value: '12 Years' },
      { label: 'Linear Performance Warranty', value: '30 Years' },
      { label: 'Temperature Coefficient', value: 'Lower than conventional panels' },
      { label: 'Frame', value: 'Anodized Aluminum' },
      { label: 'Glass', value: 'High-transmission, anti-reflective' },
      { label: 'Bifacial Gain', value: 'Higher than conventional modules' },
    ],
    benefits: [
      'Higher efficiency than conventional mono-PERC modules',
      'Better performance in high-temperature conditions',
      'Lower degradation rates for long-term reliability',
      'Higher energy yield in real-world conditions',
      'More power per square meter',
      'Reduced maintenance requirements',
    ],
    applications: [
      'Utility-scale solar plants',
      'Commercial & Industrial rooftops',
      'Solar farms',
      'Industrial facilities',
      'Residential installations (where space is a premium)',
      'Greenhouses',
      'Solar car ports',
    ],
    datasheet: 'https://drive.google.com/uc?export=download&id=1DmPSJKVO1MTgA55x_Q8Ap8L-AXONe20D',
  },
  '4': {
    id: '4',
    name: 'EVERSOL PowerMax 5kW Inverter',
    category: 'Solar Inverters',
    capacity: '5kW',
    price: 45999,
    image: inverterImg,
    warranty: '10 Years',
    description: 'The EVERSOL PowerMax 5kW is a smart string inverter with advanced MPPT technology and built-in WiFi monitoring. Perfect for residential solar systems, it maximizes energy harvest while providing real-time performance data via smartphone app.',
    specifications: [
      { label: 'Rated Power', value: '5000W' },
      { label: 'Max DC Input', value: '7500W' },
      { label: 'MPPT Channels', value: '2' },
      { label: 'Max Efficiency', value: '98.4%' },
      { label: 'Input Voltage Range', value: '100-600V DC' },
      { label: 'Output Voltage', value: '230V AC' },
      { label: 'Protection Rating', value: 'IP65' },
      { label: 'Operating Temp', value: '-25°C to 60°C' },
      { label: 'Communication', value: 'WiFi + RS485' },
      { label: 'Display', value: 'LCD + LED' },
    ],
    benefits: [
      'Dual MPPT for flexible array design',
      'Real-time monitoring via smartphone app',
      'Silent operation under 30dB',
      'Wide voltage input range',
      'Built-in surge protection',
    ],
    applications: [
      'Home solar systems',
      'Small commercial installations',
      'Grid-tied systems',
      'Self-consumption setups',
    ],
  },
  '7': {
    id: '7',
    name: 'EVERSOL LithiumStore 5kWh',
    category: 'Solar Batteries',
    capacity: '5kWh',
    price: 75999,
    image: batteryImg,
    warranty: '10 Years',
    description: 'The EVERSOL LithiumStore 5kWh battery uses advanced Lithium Iron Phosphate (LiFePO4) chemistry for exceptional safety and longevity. With over 6000 cycle life, this battery provides reliable energy storage for decades.',
    specifications: [
      { label: 'Capacity', value: '5.12 kWh' },
      { label: 'Chemistry', value: 'LiFePO4' },
      { label: 'Cycle Life', value: '>6000 cycles @ 80% DoD' },
      { label: 'Round Trip Efficiency', value: '95%' },
      { label: 'Nominal Voltage', value: '51.2V' },
      { label: 'Dimensions', value: '480 x 560 x 170mm' },
      { label: 'Weight', value: '52 kg' },
      { label: 'Operating Temp', value: '0°C to 50°C' },
      { label: 'Communication', value: 'CAN / RS485' },
      { label: 'Protection', value: 'BMS with thermal management' },
    ],
    benefits: [
      'Ultra-safe LiFePO4 chemistry',
      '6000+ cycle life for 15+ years of use',
      'Modular design - stack up to 4 units',
      'Integrated Battery Management System',
      'Zero maintenance required',
    ],
    applications: [
      'Home backup power',
      'Self-consumption optimization',
      'Off-grid systems',
      'Peak shaving',
    ],
  },
  '9': {
    id: '9',
    name: 'EVERSOL Complete 3kW Kit',
    category: 'Rooftop Kits',
    capacity: '3kW',
    price: 189999,
    image: kitImg,
    warranty: '25 Years',
    description: 'The EVERSOL Complete 3kW Kit is an all-inclusive solar solution perfect for small to medium homes. This package includes premium solar panels, inverter, mounting structure, cables, and professional installation by our certified team.',
    specifications: [
      { label: 'System Capacity', value: '3.3 kWp' },
      { label: 'Panels', value: '6 x 550W EVERSOL Pro' },
      { label: 'Inverter', value: 'EVERSOL PowerMax 3kW' },
      { label: 'Annual Generation', value: '~4,500 kWh' },
      { label: 'Roof Space Required', value: '~25 sq.m' },
      { label: 'Mounting Type', value: 'Aluminum rail system' },
      { label: 'DC Cables', value: '4mm² solar cable' },
      { label: 'AC Cables', value: '4 sq.mm copper' },
      { label: 'Protection', value: 'DC & AC isolators, SPD' },
      { label: 'Monitoring', value: 'WiFi app included' },
    ],
    benefits: [
      'Complete turnkey solution',
      'Professional installation included',
      'Net metering assistance',
      'Subsidy documentation support',
      '25-year linear power warranty',
    ],
    applications: [
      'Homes with 200-400 units/month usage',
      '2-3 BHK apartments',
      'Small offices',
      'Shops and retail',
    ],
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Find product by id (string or number)
  const product = Object.values(products).find(p => p.id.toString() === id) || products['1'];

  const renderSpecifications = () => {
    if (!product.specifications) return null;

    // Handle array format
    if (Array.isArray(product.specifications)) {
      return product.specifications.map((spec, index) => (
        <div key={index} className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">
            {typeof spec === 'object' && 'label' in spec ? spec.label : ''}
          </span>
          <span className="font-medium text-right">
            {typeof spec === 'object' && 'value' in spec ? String(spec.value) : ''}
          </span>
        </div>
      ));
    }
    
    // Handle object format
    return Object.entries(product.specifications).map(([key, value]) => (
      <div key={key} className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{key}</span>
        <span className="font-medium text-right">{String(value)}</span>
      </div>
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadDatasheet = (url: string, productName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EVERSOL-${productName.replace(/\s+/g, '-')}-Datasheet.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="pt-28 pb-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{product.category}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              {product.images ? (
                <ProductImageGallery
                  images={product.images}
                  productName={product.name}
                />
              ) : product.images360 && product.images360.length > 0 ? (
                <Image360Viewer
                  images={product.images360}
                  className="w-full h-96"
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-96 mx-auto"
                />
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {product.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-eco font-medium mb-6">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  {product.capacity}
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {product.warranty} Warranty
                </span>
              </div>

              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-heading font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-muted-foreground line-through text-xl">
                  {formatPrice(product.price * 1.2)}
                </span>
                <span className="px-3 py-1 rounded-full bg-eco/10 text-eco text-sm font-semibold">
                  Save 20%
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button variant="solar" size="xl" className="flex-1">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                {product.datasheet && (
                  <Button
                    variant="outline"
                    size="xl"
                    className="flex-1"
                    onClick={() => handleDownloadDatasheet(product.datasheet!, product.name)}
                  >
                    <Download className="h-5 w-5" />
                    Datasheet
                  </Button>
                )}
                <Button variant="outline" size="xl" asChild>
                  <Link to="/contact">
                    <Phone className="h-5 w-5" />
                    Request Quote
                  </Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-eco mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Genuine Product</span>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 text-solar mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Free Delivery</span>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">BIS Certified</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Specifications & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* Specifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Technical Specifications
              </h2>
              {renderSpecifications()}
            </motion.div>

            {/* Benefits & Applications */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Key Benefits
                </h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-eco shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Applications
                </h2>
                <ul className="space-y-3">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-solar shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{app}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
