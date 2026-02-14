import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Search, Grid, List, ChevronDown, Zap, ShoppingCart, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import panelImg from '@/assets/product-solar-panel.jpg';
import inverterImg from '@/assets/product-inverter.jpg';
import batteryImg from '@/assets/product-battery.jpg';
import kitImg from '@/assets/product-rooftop-kit.jpg';
import ProductsHero from '@/components/products/ProductsHero';

const categories = ['All', 'Solar Modules', 'Solar Inverters', 'Solar Storage', 'Rooftop Kits'];

const solarModuleBrands = [
  { id: 'solex', name: 'Solex' },
  { id: 'pahal', name: 'Pahal' },
  { id: 'waaree', name: 'Waaree' },
  { id: 'panasonic', name: 'Panasonic' },
];

const solarStorageBrands = [
  { id: 'solaryaan', name: 'Solaryaan' },
  { id: 'solplanet', name: 'Solplanet' },
];

const inverterTypes = {
  'On-grid Inverter': ['Solplanet', 'SolarYana', 'Hoymiles'],
  'Hybrid Inverter': ['Solplanet', 'SolarYana'],
  'Off-grid Inverter': ['Solplanet', 'SolarYana', 'Hoymiles'],
  'Micro Inverter': ['Solplanet', 'SolarYana', 'Hoymiles']
};

const products = [
  // Solar Storage Products - Solaryaan
  {
    id: 'solaryaan-aio-series',
    name: 'AIO Series',
    category: 'Solar Storage',
    brand: 'Solaryaan',
    capacity: '3-10kWh',
    price: 0,
    benefit: 'Next-gen energy storage with integrated inverter/charger',
    image: '/images/AIOseries.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=1huZDjhkJjCmmsIPVham8zSu8BI9WK0im',
    specifications: {
      'Model': 'AIO-3H to AIO-10H',
      'Max. PV Array Power': '10,000-20,000 Wp',
      'Battery Type': 'Li-ion / Lead Acid',
      'Battery Voltage': '48V',
      'Efficiency': 'Up to 97.6%',
      'MPPT Efficiency': '99.9%',
      'Protections': 'Over voltage, Short circuit, Reverse polarity, Over temperature'
    },
    features: [
      'Fully integrated storage system',
      'Minimalist design for easy installation',
      'Double off-grid backup capability',
      'Two-channel UPS function'
    ]
  },
  {
    id: 'solaryaan-hv6',
    name: 'HV 6 HIGH VOLTAGE STORAGE BATTERY',
    category: 'Solar Storage',
    brand: 'Solaryaan',
    capacity: '5.76kWh (expandable to 23.04kWh)',
    price: 0,
    benefit: 'High-performance, scalable battery storage system',
    image: '/images/HV6.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=1Y9nu93ZcNkOJUcignPtmWEiaiXi2v-md',
    specifications: {
      'Model': 'Li-6KHV',
      'Battery Type': 'LFP (LiFePO₄)',
      'Nominal Energy': '5.76 kWh',
      'Operating Voltage': '174V - 219V',
      'Depth of Discharge': '90%',
      'Cycle Life': '6000+ cycles',
      'Efficiency': '≥ 95%',
      'Weight': '51 kg',
      'Protection': 'IP65'
    },
    features: [
      'Scalable to 23.04kWh',
      '90% Depth of Discharge',
      'Floor or Wall Mounting',
      'Compact & Easy Installation',
      'IP65 Protection Level',
      'High Voltage and High Efficiency'
    ]
  },
  
  // Solar Storage Products - Solplanet
  {
    id: 'solplanet-ai-hb-g2',
    name: 'Ai-HB G2 Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-20kWh',
    price: 0,
    benefit: 'High-voltage battery for seamless integration with hybrid inverters',
    image: '/images/solarstorage1.1.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=1FrRIvSW_k_5MCceitoKiMkgZ2dVDRWAq',
    specifications: {
      'Series': 'Ai-HB G2',
      'Battery Type': 'LiFePO4',
      'Nominal Capacity': '5-20kWh',
      'Nominal Voltage': '153.6V',
      'Max. Charge/Discharge Current': '100A',
      'Cycle Life': '>6000 cycles @ 80% DoD',
      'Efficiency': '>95%',
      'Operating Temperature': '-10°C to 50°C',
      'Communication': 'CAN/RS485'
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
    ]
  },
  {
    id: 'solplanet-ai-hb-g2-pro',
    name: 'Ai-HB G2 Pro Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '7.5-20kWh',
    price: 0,
    benefit: 'Advanced high-voltage battery with enhanced performance',
    image: '/images/solarstorage2.1.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=13dXjBpQ-YtjLWEtYo1iYH2GLIUrqfaRj',
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
      'IP Rating': 'IP65'
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
    ]
  },
  {
    id: 'solplanet-ai-hb-g2-e-50-20kwh',
    name: 'Ai-HB G2-E 50-20kWh Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-20kWh',
    price: 0,
    benefit: 'High-capacity energy storage solution for residential and commercial use',
    image: '/images/solarstorage3.1.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=17NLfhMhS8T0ADJW_9cppxmAg31wn2ZwO',
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
      'IP Rating': 'IP65'
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
    ]
  },
  {
    id: 'solplanet-ai-lb-g3',
    name: 'Ai-LB G3 Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '4.8-19.2kWh',
    price: 0,
    benefit: 'Advanced low-voltage battery system with high efficiency',
    image: '/images/solarstorage4.1.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=1ghRVH4oWVGDJwEZp0BZt2xuj7-JvzvIZ',
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
      'IP Rating': 'IP65'
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
    ]
  },
  {
    id: 'solplanet-ai-lb-e-series',
    name: 'Ai-LB E Series',
    category: 'Solar Storage',
    brand: 'Solplanet',
    capacity: '5-12kWh',
    price: 0,
    benefit: 'Economical low-voltage battery solution for residential energy storage',
    image: '/images/solarstorage5.1.png',
    warranty: '10 Years',
    datasheet: 'https://drive.google.com/uc?export=download&id=1K92s-pug2Y8RZjdLbm8hGz8IXyMwJXrC',
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
      'IP Rating': 'IP65'
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
    ]
  },

  // Panasonic Solar Products
  {
    id: 'panasonic-bifacial',
    name: 'Bifacial Mono PERC',
    category: 'Solar Modules',
    capacity: '535–550Wp',
    price: 0, // Price on request
    benefit: 'Front side efficiency up to 21.32% with rear side generation',
    image: '/images/panasonic1.png',
    warranty: '12 Years',
    brand: 'Panasonic',
    datasheet: '/datasheets/panasonic-bifacial-datasheet.pdf',
    specifications: {
      'Cell Type': 'Bifacial Mono PERC',
      'Power Output': '535–550Wp',
      'Efficiency': 'Up to 21.32%',
      'Cell Configuration': 'M10-10BB-144',
      'Product Warranty': '12 Years',
      'Performance Warranty': '25 Years',
      'Key Features': 'Bifacial technology, Low degradation, BIS Certified'
    }
  },
  {
    id: 'panasonic-topcon',
    name: 'N TYPE TOPCon Bifacial',
    category: 'Solar Modules',
    capacity: '570–585Wp',
    price: 0, // Price on request
    benefit: 'Up to 22.66% efficiency with 30-year performance warranty',
    image: '/images/panasonic2.png',
    warranty: '15 Years',
    brand: 'Panasonic',
    datasheet: '/datasheets/panasonic-topcon-datasheet.pdf',
    specifications: {
      'Cell Type': 'N-Type TOPCon Bifacial',
      'Power Output': '570–585Wp',
      'Efficiency': 'Up to 22.66%',
      'Bifaciality Factor': '80% ±10%',
      'Product Warranty': '15 Years',
      'Performance Warranty': '30 Years',
      'Key Features': 'Ultra-low degradation, High temperature coefficient, Sleek design'
    }
  },
  // Pahal Solar Products
  {
    id: 'pahal-mono',
    name: 'Mono Crystalline Solar Panel',
    category: 'Solar Modules',
    capacity: '540W',
    price: 0, // Price on request
    benefit: 'High efficiency, Excellent low-light performance, Aesthetic black design',
    image: '/images/pahal-Mono-Crystalline-Panels.jpg',
    warranty: '12 Years',
    brand: 'Pahal',
    datasheet: 'https://drive.google.com/uc?export=download&id=1x_1TOACrNbTmAu-BBC1hInZHkmukLRqK',
    specifications: {
      'Cell Type': 'Monocrystalline',
      'Efficiency': 'Up to 22.5%',
      'Power Output': '540W',
      'Frame': 'Anodized Aluminium Alloy',
      'Glass': '3.2mm tempered, anti-reflective',
      'Temperature Range': '-40°C to +85°C',
      'Product Warranty': '12 Years',
      'Performance Warranty': '25 Years',
      'Key Features': 'High efficiency, Excellent low-light performance, Aesthetic black design'
    }
  },
  {
    id: 'pahal-ntype',
    name: 'N-Type TOPCon Bifacial Panel',
    category: 'Solar Modules',
    capacity: '570W',
    price: 0, // Price on request
    benefit: 'Bifacial design, High efficiency, Low degradation, Excellent temperature coefficient',
    image: '/images/pahal-N-Type-Topcon-Bifacial-Panels.jpg',
    warranty: '15 Years',
    brand: 'Pahal',
    datasheet: 'https://drive.google.com/uc?export=download&id=1x_1TOACrNbTmAu-BBC1hInZHkmukLRqK',
    specifications: {
      'Cell Type': 'N-Type TOPCon Bifacial',
      'Efficiency': 'Up to 23.8%',
      'Power Output': '570W',
      'Bifacial Gain': 'Up to 30%',
      'Frame': 'Anodized Aluminium Alloy',
      'Glass': '3.2mm tempered, double glass',
      'Temperature Range': '-40°C to +85°C',
      'Product Warranty': '15 Years',
      'Performance Warranty': '30 Years',
      'Key Features': 'Bifacial design, High efficiency, Low degradation, Excellent temperature coefficient'
    }
  },
  // Solex Products
  {
    id: 'solex-tapi-rc',
    name: 'SOLEX TAPI RC ',
    category: 'Solar Modules',
    capacity: '665W',
    price: 0, // Price on request
    benefit: 'Zero Shading, Maximum Power, Ultimate Performance',
    image: '/images/solex-tapi-rc.png',
    warranty: '30 Years',
    brand: 'Solex',
    datasheet: 'https://drive.google.com/uc?export=download&id=1V-o0EktjlwqPnuzcLQqB-vTve6onVqzt',
    specifications: {
      'Cell Type': 'Monocrystalline',
      'Cell Technology': 'Rear Contact',
      'Module Efficiency': 'Up to 24.6%',
      'Frame': 'Anodized Aluminium Alloy',
      'Glass': '3.2mm tempered, anti-reflective',
      'Temperature Range': '-40°C to +85°C',
      'Product Warranty': '12 Years',
      'Linear Performance Warranty': '30 Years',
      'Key Features': 'Zero Shading, Maximum Power, Ultimate Performance'
    },
    features: [
      'Lower LCOE (Levelized Cost of Electricity)',
      'Faster payback period',
      'Superior aesthetics for high-end installations',
      'Ideal for space-constrained rooftops',
      'Perfect for architectural solar (BIPV) applications',
      'Suitable for EV infrastructure and green projects',
      'Enhanced performance in hybrid installations',
      'Optimized for utility-scale projects'
    ]
  },
  {
    id: 'solex-tapi-r',
    name: 'SOLEX TAPI R',
    category: 'Solar Modules',
    capacity: '595W - 625W',
    price: 19999,
    benefit: 'N-Type TOPCon technology with 23.61% efficiency',
    image: '/images/Solex-Tapi_R-V.webp',
    warranty: '30 Years',
    brand: 'Solex',
    datasheet: 'https://drive.google.com/uc?export=download&id=1DmPSJKVO1MTgA55x_Q8Ap8L-AXONe20D',
    specifications: {
      'Power Output': '595W - 625W',
      'Cell Type': 'N-Type TOPCon',
      'Module Efficiency': '23.61%',
      'Cell Configuration': '132 Half Cut Cells',
      'Product Warranty': '12 Years',
      'Linear Performance Warranty': '30 Years',
      'Temperature Coefficient': 'Lower than conventional panels',
      'Frame': 'Anodized Aluminum',
      'Glass': 'High-transmission, anti-reflective',
      'Bifacial Gain': 'Higher than conventional modules'
    },
    features: [
      'Higher efficiency than conventional mono-PERC modules',
      'Better performance in high-temperature conditions',
      'Lower degradation rates for long-term reliability',
      'Higher energy yield in real-world conditions',
      'More power per square meter',
      'Reduced maintenance requirements'
    ]
  },


  // Pahal Products
 
 

  // Waaree Products
  {
    id: 'waaree-550w-bifacial',
    name: 'WAAREE 550Wp Mono PERC Bifacial',
    category: 'Solar Modules',
    capacity: '550W',
    price: 0, // Price on request
    benefit: 'Bifacial module with 144 half-cut cells, 21.3% efficiency',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/477/3748/01__19559.1768629312.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=1b9sQeh_QTsuupK92esD2z8T7su-07VkJ',
    specifications: {
      'Cell Type': 'Mono PERC Bifacial',
      'Efficiency': 'Up to 21.3%',
      'Dimensions': '2272 x 1133 x 35 mm',
      'Weight': '28.5 kg',
      'Key Features': 'Dual glass, PID resistant, High wind/snow load'
    },
    features: [
      'Bifacial design for additional energy yield',
      'Low degradation rate for long-term performance',
      'Excellent weak light performance',
      'PID resistant for reliable operation',
      'Suitable for high snow and wind loads'
    ]
  },
  {
    id: 'waaree-590w-ntype',
    name: 'WAAREE 590Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '590W',
    price: 0, // Price on request
    benefit: 'N-Type technology with 22.1% efficiency, 25% bifacial gain',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/599/3804/WAAREE_585Wp_144Cells_24_Volts_N-Type_Framed_Dual_Glass_Bifacial_Non-DCR_Solar_Module__30973.1768629417.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=13kF9yUv2z57iSsY_7lJpb7Hnq-YR3F2X',
    specifications: {
      'Cell Type': 'N-Type Bifacial',
      'Efficiency': 'Up to 22.1%',
      'Bifacial Gain': 'Up to 25%',
      'Temperature Coefficient': '-0.29%/°C',
      'Key Features': 'Low degradation, Better temperature coefficient'
    },
    features: [
      'N-type technology for higher efficiency',
      'Lower degradation rate',
      'Better temperature coefficient',
      'Enhanced bifacial performance',
      'PID resistant'
    ]
  },
  {
    id: 'waaree-615w-ntype',
    name: 'WAAREE 615Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '615W',
    price: 0, // Price on request
    benefit: 'High-power N-Type module with 22.8% efficiency',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/620/3027/1743403555.1280.1280__72283.1747990720.1280.1280__92861.1768629566.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=19TBMw0UGbV9eLtLudZmgMYpN62bKQ1cb',
    specifications: {
      'Cell Type': 'N-Type Bifacial',
      'Efficiency': 'Up to 22.8%',
      'Dimensions': '2279 x 1134 x 35 mm',
      'Bifacial Gain': 'Up to 25%',
      'Key Features': 'High power output, Excellent temperature coefficient'
    },
    features: [
      'Higher power output for large installations',
      'Improved temperature coefficient',
      'Enhanced low-light performance',
      'Reduced LCOE (Levelized Cost of Electricity)',
      'Ideal for utility-scale projects'
    ]
  },
  {
    id: 'waaree-685w-ntype',
    name: 'WAAREE 685Wp N-Type Bifacial',
    category: 'Solar Modules',
    capacity: '685W',
    price: 0, // Price on request
    benefit: 'Large format module with 23.2% efficiency',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/632/3393/1743403555.1280.1280__86657.1759818123.1280.1280__35102.1768629618.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=1dK9BAx9M3Qvpnrafb8P7gbQaFQrYHpvb',
    specifications: {
      'Cell Type': 'N-Type Bifacial',
      'Efficiency': 'Up to 23.2%',
      'Dimensions': '2384 x 1303 x 35 mm',
      'Weight': '35.5 kg',
      'Key Features': 'Large format, High power density, 30% bifacial gain'
    },
    features: [
      'Ultra-high power output',
      'Large format design',
      'High bifacial gain up to 30%',
      'Optimized for large-scale installations',
      'Reduced BOS (Balance of System) costs'
    ]
  },
  {
    id: 'waaree-600w-bifacial',
    name: 'WAAREE 600Wp Mono PERC Bifacial',
    category: 'Solar Modules',
    capacity: '600W',
    price: 0, // Price on request
    benefit: 'Compact design with 21.8% efficiency',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/135/1002/Bi_-_66_-_600_-01__80885.1764587881.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=1X1LM7WFQhEzaVUDANkG1P7rHe6orzas2',
    specifications: {
      'Cell Type': 'Mono PERC Bifacial',
      'Efficiency': 'Up to 21.8%',
      'Dimensions': '2172 x 1303 x 35 mm',
      'Weight': '32.5 kg',
      'Key Features': 'Compact design, High power output, PID free'
    },
    features: [
      'Space-efficient design',
      'High power output in compact size',
      'Suitable for residential rooftops',
      'Excellent temperature coefficient',
      'PID resistant for long-term reliability'
    ]
  },
  {
    id: 'waaree-700w-topcon',
    name: 'WAAREE 700Wp TOPCon N-Type',
    category: 'Solar Modules',
    capacity: '700W',
    price: 0, // Price on request
    benefit: 'Advanced TOPCon technology with 23.5% efficiency',
    image: 'https://cdn11.bigcommerce.com/s-unnwlv5df8/images/stencil/1280x1280/products/651/3688/01__25072.1765977365.jpg?c=1',
    warranty: '12/30 Years',
    brand: 'Waaree',
    datasheet: 'https://drive.google.com/uc?export=download&id=1TUyDzSHbNIyP5-1q89t7Hj5LC-2qEMXq',
    specifications: {
      'Cell Type': 'TOPCon N-Type Bifacial',
      'Efficiency': 'Up to 23.5%',
      'Dimensions': '2384 x 1303 x 35 mm',
      'Bifacial Gain': 'Up to 30%',
      'Key Features': 'TOPCon technology, Ultra-high efficiency, Low LCOE'
    },
    features: [
      'Advanced TOPCon cell technology',
      'Ultra-high efficiency up to 23.5%',
      '30% bifacial gain potential',
      'Lower temperature coefficient',
      'Ideal for utility and commercial installations'
    ]
  },

 

  // Solplanet Inverters
  {
    id: 'solplanet-a-5000',
    name: 'Solplanet A-5000',
    category: 'Solar Inverters',
    inverterType: 'On-grid Inverter',
    brand: 'Solplanet',
    capacity: '5kW',
    price: 45999,
    benefit: 'High-efficiency single-phase inverter with smart monitoring',
    image: inverterImg,
    warranty: '10 Years',
  },
  {
    id: 'solplanet-h-8-0',
    name: 'Solplanet H-8.0',
    category: 'Solar Inverters',
    inverterType: 'Hybrid Inverter',
    brand: 'Solplanet',
    capacity: '8kW',
    price: 85999,
    benefit: 'Hybrid inverter with battery backup and smart energy management',
    image: inverterImg,
    warranty: '10 Years',
  },

  // SolarYana Inverters
  {
    id: 'solaryana-sy-5000',
    name: 'SolarYana SY-5000',
    category: 'Solar Inverters',
    inverterType: 'On-grid Inverter',
    brand: 'SolarYana',
    capacity: '5kW',
    price: 42999,
    benefit: 'Reliable grid-tied inverter with high conversion efficiency',
    image: inverterImg,
    warranty: '10 Years',
  },
  {
    id: 'solaryana-sy-hybrid-6',
    name: 'SolarYana SY-Hybrid-6',
    category: 'Solar Inverters',
    inverterType: 'Hybrid Inverter',
    brand: 'SolarYana',
    capacity: '6kW',
    price: 78999,
    benefit: 'Hybrid solution with battery backup and grid support',
    image: inverterImg,
    warranty: '10 Years',
  },

  // Hoymiles Inverters
  {
    id: 'hoymiles-mi-1500',
    name: 'Hoymiles MI-1500',
    category: 'Solar Inverters',
    inverterType: 'Micro Inverter',
    brand: 'Hoymiles',
    capacity: '1.5kW',
    price: 24999,
    benefit: 'High-efficiency microinverter for individual panel optimization',
    image: inverterImg,
    warranty: '12 Years',
  },
  {
    id: 'hoymiles-hm-6000',
    name: 'Hoymiles HM-6000',
    category: 'Solar Inverters',
    inverterType: 'Off-grid Inverter',
    brand: 'Hoymiles',
    capacity: '6kW',
    price: 72999,
    benefit: 'Pure sine wave off-grid inverter with MPPT charger',
    image: inverterImg,
    warranty: '5 Years',
  },

  // More Solplanet Inverters
  {
    id: 'solplanet-m-800',
    name: 'Solplanet M-800',
    category: 'Solar Inverters',
    inverterType: 'Micro Inverter',
    brand: 'Solplanet',
    capacity: '800W',
    price: 15999,
    benefit: 'Compact microinverter with panel-level monitoring',
    image: inverterImg,
    warranty: '10 Years',
  },

  // More SolarYana Inverters
  {
    id: 'solaryana-sy-off-5',
    name: 'SolarYana SY-Off-5',
    category: 'Solar Inverters',
    inverterType: 'Off-grid Inverter',
    brand: 'SolarYana',
    capacity: '5kW',
    price: 68999,
    benefit: 'Off-grid power solution for remote locations',
    image: inverterImg,
    warranty: '5 Years',
  },

  // More Hoymiles Inverters
  {
    id: 'hoymiles-hm-10000',
    name: 'Hoymiles HM-10000',
    category: 'Solar Inverters',
    inverterType: 'On-grid Inverter',
    brand: 'Hoymiles',
    capacity: '10kW',
    price: 112999,
    benefit: 'Three-phase commercial inverter with high efficiency',
    image: inverterImg,
    warranty: '10 Years',
  },

  // Solplanet Off-grid
  {
    id: 'solplanet-o-3-6',
    name: 'Solplanet O-3.6',
    category: 'Solar Inverters',
    inverterType: 'Off-grid Inverter',
    brand: 'Solplanet',
    capacity: '3.6kW',
    price: 52999,
    benefit: 'Compact off-grid inverter with built-in MPPT',
    image: inverterImg,
    warranty: '5 Years',
  },
  {
    id: 'eversol-powermax-10',
    name: 'EVERSOL PowerMax 10kW Inverter',
    category: 'Solar Inverters',
    inverterType: 'On-grid Inverter',
    brand: 'Eversol',
    capacity: '10kW',
    price: 75999,
    benefit: 'Three-phase inverter for commercial applications',
    image: inverterImg,
    warranty: '10 Years',
  },
  {
    id: 'eversol-hybrid-8',
    name: 'EVERSOL Hybrid 8kW Inverter',
    category: 'Solar Inverters',
    capacity: '8kW',
    price: 89999,
    benefit: 'Hybrid inverter with battery integration capability',
    image: inverterImg,
    warranty: '10 Years',
  },
  {
    id: 'eversol-lithium-5-kwh',
    name: 'EVERSOL LithiumStore 5kWh',
    category: 'Solar Batteries',
    capacity: '5kWh',
    price: 75999,
    benefit: '6000+ cycle life lithium iron phosphate battery',
    image: batteryImg,
    warranty: '10 Years',
  },
  {
    id: 'eversol-lithium-10-kwh',
    name: 'EVERSOL LithiumStore 10kWh',
    category: 'Solar Batteries',
    capacity: '10kWh',
    price: 125999,
    benefit: 'Modular design for scalable energy storage',
    image: batteryImg,
    warranty: '10 Years',
  },
  {
    id: 'eversol-kit-3kw',
    name: 'EVERSOL Complete 3kW Kit',
    category: 'Rooftop Kits',
    capacity: '3kW',
    price: 189999,
    benefit: 'All-inclusive home solar solution with installation',
    image: kitImg,
    warranty: '25 Years',
  },
  {
    id: 'eversol-kit-5kw',
    name: 'EVERSOL Complete 5kW Kit',
    category: 'Rooftop Kits',
    capacity: '5kW',
    price: 289999,
    benefit: 'Perfect for medium-sized homes with AC load',
    image: kitImg,
    warranty: '25 Years',
  },
  {
    id: 'eversol-kit-10kw',
    name: 'EVERSOL Complete 10kW Kit',
    category: 'Rooftop Kits',
    capacity: '10kW',
    price: 549999,
    benefit: 'Commercial-grade kit for large homes and businesses',
    image: kitImg,
    warranty: '25 Years',
  },
  {
    id: 'eversol-kit-offgrid',
    name: 'EVERSOL Off-Grid Kit',
    category: 'Rooftop Kits',
    capacity: '5kW + 10kWh',
    price: 399999,
    benefit: 'Complete off-grid solution with battery backup',
    image: kitImg,
    warranty: '20 Years',
  },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedInverterType, setSelectedInverterType] = useState<string | null>(null);
  const [selectedInverterBrand, setSelectedInverterBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isInverterFiltersOpen, setIsInverterFiltersOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBrandsOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBrandsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredProducts = products.filter(product => {
    // Category filter
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    // Search filter
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category specific filters
    const isSolarModule = selectedCategory === 'Solar Modules';
    const isSolarStorage = selectedCategory === 'Solar Storage';
    const isInverter = selectedCategory === 'Solar Inverters';
    
    // Brand filtering
    let matchesBrand = true;
    if (isSolarModule && selectedBrand) {
      matchesBrand = product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();
    } else if (isSolarStorage && selectedBrand) {
      matchesBrand = product.brand && product.brand.toLowerCase() === selectedBrand.toLowerCase();
    }
    const matchesInverterType = !isInverter || !selectedInverterType ||
      (product.inverterType === selectedInverterType);
    const matchesInverterBrand = !isInverter || !selectedInverterBrand ||
      (product.brand && product.brand.toLowerCase() === selectedInverterBrand.toLowerCase());

    return matchesCategory && matchesSearch && matchesBrand && matchesInverterType && matchesInverterBrand;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDownloadDatasheet = (url: string, productName: string) => {
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SOLEX-${productName.replace(/\s+/g, '-')}-Datasheet.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      {/* Hero */}
      <ProductsHero />

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 sticky top-20 z-30">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>


              {/* Categories */}
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                    <div key={category} className="relative" ref={category === 'Solar Modules' ? dropdownRef : null}>
                      <Button
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          // Toggle dropdown visibility
                          if (category === 'Solar Inverters') {
                            setIsInverterFiltersOpen(!isInverterFiltersOpen);
                          } else {
                            setIsInverterFiltersOpen(false);
                          }

                          // Reset filters when changing category
                          if (category !== 'Solar Modules') {
                            setSelectedBrand(null);
                          }
                          if (category !== 'Solar Inverters') {
                            setSelectedInverterType(null);
                            setSelectedInverterBrand(null);
                          }
                        }}
                        className={`rounded-full ${['Solar Modules', 'Solar Inverters'].includes(category) ? 'pr-8' : ''}`}
                      >
                        {category}
                        {['Solar Modules', 'Solar Inverters'].includes(category) && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </Button>

                      {/* Brand Dropdown for Solar Modules and Solar Storage */}
                      {(category === 'Solar Modules' || category === 'Solar Storage') && selectedCategory === category && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                          >
                            <div className="p-2">
                              <p className="px-3 py-1 text-sm font-medium text-gray-700">Select Brand</p>
                              {(category === 'Solar Modules' ? solarModuleBrands : solarStorageBrands).map((brand) => (
                                <button
                                  key={brand.id}
                                  onClick={() => {
                                    setSelectedBrand(brand.name);
                                    setIsBrandsOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedBrand === brand.name
                                      ? 'bg-primary text-primary-foreground'
                                      : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                  {brand.name}
                                </button>
                              ))}
                              {selectedBrand && (
                                <button
                                  onClick={() => {
                                    setSelectedBrand(null);
                                    setIsBrandsOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-1"
                                >
                                  Clear Filter
                                </button>
                              )}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  ))}
                  {selectedBrand && (
                    <div className="ml-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center">
                      {selectedBrand}
                      <button
                        onClick={() => setSelectedBrand(null)}
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Inverter Filters */}
                {selectedCategory === 'Solar Inverters' && (
                  <div className="flex flex-wrap gap-4 justify-center mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          {selectedInverterType || 'Select Inverter Type'}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {Object.keys(inverterTypes).map((type) => (
                          <DropdownMenuItem
                            key={type}
                            onClick={() => {
                              setSelectedInverterType(type);
                              setSelectedInverterBrand(null);
                            }}
                          >
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {selectedInverterType && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            {selectedInverterBrand || 'Select Brand'}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {inverterTypes[selectedInverterType]?.map((brand) => (
                            <DropdownMenuItem
                              key={brand}
                              onClick={() => setSelectedInverterBrand(brand)}
                            >
                              {brand}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {(selectedInverterType || selectedInverterBrand) && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedInverterType(null);
                          setSelectedInverterBrand(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
              </div>

              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`group bg-card rounded-2xl overflow-hidden border-4 border-orange-500 hover:border-orange-600 transition-all duration-300 card-hover ${viewMode === 'list' ? 'flex flex-row' : ''
                      }`}
                  >
                    <div className={`relative overflow-hidden bg-card ${viewMode === 'list' ? 'w-40 shrink-0' : 'aspect-square h-64'
                      }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        {product.category}
                      </span>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 text-eco text-sm font-medium mb-2">
                        <Zap className="h-4 w-4" />
                        {product.capacity} • {product.warranty} Warranty
                        {product.brand && <span className="ml-2 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">{product.brand}</span>}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {product.benefit}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-heading font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/product/${product.id}`}>Details</Link>
                          </Button>
                          <Button
                            variant="solar"
                            size="sm"
                            onClick={() => product.datasheet && handleDownloadDatasheet(product.datasheet, product.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="solar" size="sm">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                  <div className="mt-4 flex gap-4">
                    <Button
                      onClick={() => handleDownloadDatasheet(selectedProduct.datasheet, selectedProduct.name)}
                      variant="default"
                      className="w-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Datasheet
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Sales
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <p className="text-gray-700 mb-6">{selectedProduct.benefit}</p>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {selectedProduct.features?.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      )) || (
                          <li>No features listed</li>
                        )}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Specifications</h4>
                    <div className="space-y-2">
                      {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-100 pb-1">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Shop;
