import React, { useState, useMemo } from 'react';
import { useFiscalPeriod } from '../contexts/FiscalPeriodContext';
import OpportunityTable from '../components/OpportunityTable';

// Product Detail Modal Component
function ProductDetailModal({ isOpen, onClose, product, opportunities }) {
  const modalRef = React.useRef(null);
  
  // Close modal when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !product) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Modal container */}
      <div 
        ref={modalRef} 
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-[88rem] max-h-[90vh] overflow-hidden flex flex-col z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full ${getProductColor(product.name)} flex items-center justify-center text-white font-medium text-lg`}>
              {product.icon || product.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {product.name} Sales
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.units} units · {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0
                }).format(product.value)} total value
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Modal body with scrolling */}
        <div className="flex-1 overflow-y-auto p-4">
          <OpportunityTable opportunities={opportunities} />
        </div>
      </div>
    </div>
  );
}

// Function to get a color based on the product type
const getProductColor = (productName) => {
  const colorMap = {
    'Fuel': 'bg-red-500',
    'Cover Truck Insurance': 'bg-blue-500',
    'Davis Derby': 'bg-purple-500',
    'Hire in Plant Insurance': 'bg-green-500',
    'HPT and PPT': 'bg-yellow-500',
    'VAPS': 'bg-indigo-500',
    'Racking': 'bg-teal-500',
    'Roller Shutter Doors': 'bg-orange-500'
  };
  
  return colorMap[productName] || 'bg-gray-500';
};

// Function to get an icon based on the product type
const getProductIcon = (productName) => {
  const iconMap = {
    'Fuel': '⛽',
    'Cover Truck Insurance': '🛡️',
    'Davis Derby': '🔌',
    'Hire in Plant Insurance': '🏭',
    'HPT and PPT': '🚛',
    'VAPS': '✨',
    'Racking': '🗄️',
    'Roller Shutter Doors': '🚪'
  };
  
  return iconMap[productName] || productName.charAt(0);
};

// Format the opportunity data to match the expected structure in OpportunityTable
const formatOpportunityForTable = (opportunity, index, productName) => {
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60) - 1);
  
  const closingDate = new Date(opportunity.closingDate);
  
  // Calculate age in days
  const ageInDays = Math.round((new Date() - createdDate) / (1000 * 60 * 60 * 24));
  
  // Map stage to probability
  const probabilityMap = {
    'Proposal': '50%',
    'Negotiation': '75%',
    'Closed Won': '90%',
    'Prospecting': '25%'
  };
  
  // Generate next steps based on stage
  const nextStepMap = {
    'Proposal': 'Send proposal',
    'Negotiation': 'Follow-up call',
    'Closed Won': 'Implementation',
    'Prospecting': 'Schedule demo'
  };
  
  return {
    id: opportunity.id,
    accountName: `${productName} Account ${index + 1}`,
    customerName: opportunity.customerName,
    opportunityName: `${productName} Sale ${index + 1}`,
    contact: `${opportunity.customerName.split(' ')[0].toLowerCase()}@example.com`,
    stage: opportunity.stage,
    nextStep: nextStepMap[opportunity.stage] || 'Follow up',
    probability: probabilityMap[opportunity.stage] || '50%',
    age: ageInDays,
    createdDate: createdDate.toLocaleDateString(),
    closingDate: closingDate.toLocaleDateString(),
    amount: opportunity.amount,
    units: opportunity.units
  };
};

// Example dummy data for products
const dummyProductData = [
  {
    id: 1,
    name: 'Fuel',
    icon: '⛽',
    value: 425000,
    units: 187,
    opportunities: Array(32).fill().map((_, i) => ({
      id: `fuel-${i+1}`,
      customerName: `Fuel Customer ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 20000) + 5000,
      units: Math.floor(Math.random() * 10) + 1,
      productName: 'Fuel',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 2,
    name: 'Cover Truck Insurance',
    icon: '🛡️',
    value: 380000,
    units: 124,
    opportunities: Array(28).fill().map((_, i) => ({
      id: `insurance-${i+1}`,
      customerName: `Insurance Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 18000) + 7000,
      units: Math.floor(Math.random() * 8) + 1,
      productName: 'Cover Truck Insurance',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 3,
    name: 'Davis Derby',
    icon: '🔌',
    value: 198000,
    units: 48,
    opportunities: Array(16).fill().map((_, i) => ({
      id: `derby-${i+1}`,
      customerName: `Derby Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 15000) + 8000,
      units: Math.floor(Math.random() * 5) + 1,
      productName: 'Davis Derby',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 4,
    name: 'Hire in Plant Insurance',
    icon: '🏭',
    value: 275000,
    units: 92,
    opportunities: Array(24).fill().map((_, i) => ({
      id: `plant-${i+1}`,
      customerName: `Plant Insurance Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 16000) + 6000,
      units: Math.floor(Math.random() * 7) + 1,
      productName: 'Hire in Plant Insurance',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 5,
    name: 'HPT and PPT (hand pallet trucks and power pallet trucks)',
    icon: '🚛',
    value: 310000,
    units: 138,
    opportunities: Array(30).fill().map((_, i) => ({
      id: `hpt-${i+1}`,
      customerName: `HPT Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 14000) + 5000,
      units: Math.floor(Math.random() * 9) + 1,
      productName: 'HPT and PPT',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 6,
    name: 'Racking',
    icon: '🗄️',
    value: 245000,
    units: 58,
    opportunities: Array(20).fill().map((_, i) => ({
      id: `rack-${i+1}`,
      customerName: `Racking Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 17000) + 8000,
      units: Math.floor(Math.random() * 4) + 1,
      productName: 'Racking',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  },
  {
    id: 7,
    name: 'Charger Installation & Battery Checks',
    icon: '🚪',
    value: 165000,
    units: 42,
    opportunities: Array(18).fill().map((_, i) => ({
      id: `door-${i+1}`,
      customerName: `Door Client ${i+1}`,
      closingDate: new Date(2024, 8, Math.floor(Math.random() * 30) + 1).toISOString(),
      amount: Math.floor(Math.random() * 12000) + 6000,
      units: Math.floor(Math.random() * 3) + 1,
      productName: 'Roller Shutter Doors',
      stage: ['Closed Won', 'Negotiation', 'Proposal', 'Prospecting'][Math.floor(Math.random() * 4)]
    }))
  }
];

function ProductsCard() {
  // Get fiscal period context
  const { periodLabel, periodStart, periodEnd } = useFiscalPeriod();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate total value
  const totalValue = useMemo(() => {
    return dummyProductData.reduce((sum, product) => sum + product.value, 0);
  }, []);

  // Prepare formatted opportunities for the table
  const formattedOpportunities = useMemo(() => {
    if (!selectedProduct) return [];
    
    return selectedProduct.opportunities.map((opp, index) => 
      formatOpportunityForTable(opp, index, selectedProduct.name)
    );
  }, [selectedProduct]);

  // Handle product row click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col col-span-full sm:col-span-8 lg:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">Products Sales</h2>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
            <span className="mr-1">{periodLabel || "All Time"}</span>
            <span className="ml-2">Total: {formatCurrency(totalValue)}</span>
          </div>
        </header>
        
        <div className="p-3">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-left">Product</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-right">Total Value</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-center">Units Sold</div>
                  </th>
                  <th className="p-2 whitespace-nowrap">
                    <div className="font-semibold text-right">Avg. Unit Price</div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {dummyProductData.map((product) => {
                  const bgColorClass = getProductColor(product.name);
                  const avgUnitPrice = product.value / product.units;
                  
                  return (
                    <tr 
                      key={product.id} 
                      onClick={() => handleProductClick(product)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 mr-2 flex-shrink-0 rounded-full ${bgColorClass} flex items-center justify-center text-white font-medium`}>
                            {product.icon}
                          </div>
                          <div className="font-medium text-gray-800 dark:text-gray-100">{product.name}</div>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-right font-medium text-green-600 dark:text-green-400">
                          {formatCurrency(product.value)}
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center font-medium text-gray-800 dark:text-gray-200">{product.units}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-right font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(avgUnitPrice)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for product details */}
      <ProductDetailModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        opportunities={formattedOpportunities}
      />
    </>
  );
}

export default ProductsCard;