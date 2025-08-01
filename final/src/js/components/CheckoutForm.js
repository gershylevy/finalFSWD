// js/components/CheckoutForm.js
import React, { useState, createElement } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const CheckoutForm = ({ onSubmit, onCancel }) => {
    const { currentUser } = useAuth();
    const { cartTotal } = useCart();
    const [formData, setFormData] = useState({
        // Shipping Information
        shippingAddress: currentUser?.address || '',
        city: '',
        zipCode: '',
        country: 'United States',
        
        // Payment Information
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: currentUser?.name || '',
        
        // Billing same as shipping
        billingSameAsShipping: true,
        billingAddress: '',
        billingCity: '',
        billingZipCode: '',
        
        // Order notes
        orderNotes: ''
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        // Shipping validation
        if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Shipping address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
        
        // Payment validation
        if (!formData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv) newErrors.cvv = 'CVV is required';
        if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
        
        // Card number format validation (simple)
        const cardNumberClean = formData.cardNumber.replace(/\s/g, '');
        if (cardNumberClean && (cardNumberClean.length < 13 || cardNumberClean.length > 19)) {
            newErrors.cardNumber = 'Invalid card number';
        }
        
        // CVV validation
        if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
            newErrors.cvv = 'Invalid CVV';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const orderData = {
                shippingAddress: `${formData.shippingAddress}, ${formData.city}, ${formData.zipCode}`,
                paymentMethod: `****${formData.cardNumber.slice(-4)}`,
                orderNotes: formData.orderNotes,
                total: cartTotal + (cartTotal > 50 ? 0 : 9.99) + (cartTotal * 0.08)
            };
            
            onSubmit(orderData);
        } catch (error) {
            setErrors({ general: 'Payment processing failed. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    const formatCardNumber = (value) => {
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');
        // Add spaces every 4 digits
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
    };

    const formatExpiryDate = (value) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const shippingTotal = cartTotal > 50 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const total = cartTotal + shippingTotal + tax;

    return createElement('div', {
        className: "max-w-4xl mx-auto"
    }, [
        createElement('h3', {
            key: 'checkout-title',
            className: "text-xl font-semibold text-gray-900 mb-6"
        }, 'Checkout'),
        
        errors.general && createElement('div', {
            key: 'general-error',
            className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        }, errors.general),

        createElement('form', {
            key: 'checkout-form',
            onSubmit: handleSubmit,
            className: "grid grid-cols-1 lg:grid-cols-2 gap-8"
        }, [
            // Left Column - Shipping & Payment
            createElement('div', {
                key: 'left-column',
                className: "space-y-6"
            }, [
                // Shipping Information
                createElement('div', {
                    key: 'shipping-section',
                    className: "bg-gray-50 p-6 rounded-lg"
                }, [
                    createElement('h4', {
                        key: 'shipping-title',
                        className: "text-lg font-medium text-gray-900 mb-4"
                    }, 'Shipping Information'),
                    
                    createElement('div', {
                        key: 'shipping-fields',
                        className: "space-y-4"
                    }, [
                        createElement('div', {
                            key: 'address-field'
                        }, [
                            createElement('label', {
                                key: 'address-label',
                                className: "block text-sm font-medium text-gray-700 mb-1"
                            }, 'Street Address *'),
                            createElement('input', {
                                key: 'address-input',
                                type: "text",
                                value: formData.shippingAddress,
                                onChange: (e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value })),
                                className: `w-full p-3 border rounded-md ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'}`,
                                disabled: processing
                            }),
                            errors.shippingAddress && createElement('p', {
                                key: 'address-error',
                                className: "text-red-500 text-sm mt-1"
                            }, errors.shippingAddress)
                        ]),
                        
                        createElement('div', {
                            key: 'city-zip-row',
                            className: "grid grid-cols-2 gap-4"
                        }, [
                            createElement('div', {
                                key: 'city-field'
                            }, [
                                createElement('label', {
                                    key: 'city-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, 'City *'),
                                createElement('input', {
                                    key: 'city-input',
                                    type: "text",
                                    value: formData.city,
                                    onChange: (e) => setFormData(prev => ({ ...prev, city: e.target.value })),
                                    className: `w-full p-3 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`,
                                    disabled: processing
                                }),
                                errors.city && createElement('p', {
                                    key: 'city-error',
                                    className: "text-red-500 text-sm mt-1"
                                }, errors.city)
                            ]),
                            createElement('div', {
                                key: 'zip-field'
                            }, [
                                createElement('label', {
                                    key: 'zip-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, 'ZIP Code *'),
                                createElement('input', {
                                    key: 'zip-input',
                                    type: "text",
                                    value: formData.zipCode,
                                    onChange: (e) => setFormData(prev => ({ ...prev, zipCode: e.target.value })),
                                    className: `w-full p-3 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`,
                                    disabled: processing
                                }),
                                errors.zipCode && createElement('p', {
                                    key: 'zip-error',
                                    className: "text-red-500 text-sm mt-1"
                                }, errors.zipCode)
                            ])
                        ])
                    ])
                ]),

                // Payment Information
                createElement('div', {
                    key: 'payment-section',
                    className: "bg-gray-50 p-6 rounded-lg"
                }, [
                    createElement('h4', {
                        key: 'payment-title',
                        className: "text-lg font-medium text-gray-900 mb-4"
                    }, 'Payment Information'),
                    
                    createElement('div', {
                        key: 'payment-fields',
                        className: "space-y-4"
                    }, [
                        createElement('div', {
                            key: 'cardholder-field'
                        }, [
                            createElement('label', {
                                key: 'cardholder-label',
                                className: "block text-sm font-medium text-gray-700 mb-1"
                            }, 'Cardholder Name *'),
                            createElement('input', {
                                key: 'cardholder-input',
                                type: "text",
                                value: formData.cardholderName,
                                onChange: (e) => setFormData(prev => ({ ...prev, cardholderName: e.target.value })),
                                className: `w-full p-3 border rounded-md ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`,
                                disabled: processing
                            }),
                            errors.cardholderName && createElement('p', {
                                key: 'cardholder-error',
                                className: "text-red-500 text-sm mt-1"
                            }, errors.cardholderName)
                        ]),
                        
                        createElement('div', {
                            key: 'card-number-field'
                        }, [
                            createElement('label', {
                                key: 'card-number-label',
                                className: "block text-sm font-medium text-gray-700 mb-1"
                            }, 'Card Number *'),
                            createElement('input', {
                                key: 'card-number-input',
                                type: "text",
                                value: formData.cardNumber,
                                onChange: (e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) })),
                                className: `w-full p-3 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`,
                                placeholder: "1234 5678 9012 3456",
                                disabled: processing
                            }),
                            errors.cardNumber && createElement('p', {
                                key: 'card-number-error',
                                className: "text-red-500 text-sm mt-1"
                            }, errors.cardNumber)
                        ]),
                        
                        createElement('div', {
                            key: 'expiry-cvv-row',
                            className: "grid grid-cols-2 gap-4"
                        }, [
                            createElement('div', {
                                key: 'expiry-field'
                            }, [
                                createElement('label', {
                                    key: 'expiry-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, 'MM/YY *'),
                                createElement('input', {
                                    key: 'expiry-input',
                                    type: "text",
                                    value: formData.expiryDate,
                                    onChange: (e) => setFormData(prev => ({ ...prev, expiryDate: formatExpiryDate(e.target.value) })),
                                    className: `w-full p-3 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`,
                                    placeholder: "MM/YY",
                                    maxLength: 5,
                                    disabled: processing
                                }),
                                errors.expiryDate && createElement('p', {
                                    key: 'expiry-error',
                                    className: "text-red-500 text-sm mt-1"
                                }, errors.expiryDate)
                            ]),
                            createElement('div', {
                                key: 'cvv-field'
                            }, [
                                createElement('label', {
                                    key: 'cvv-label',
                                    className: "block text-sm font-medium text-gray-700 mb-1"
                                }, 'CVV *'),
                                createElement('input', {
                                    key: 'cvv-input',
                                    type: "text",
                                    value: formData.cvv,
                                    onChange: (e) => setFormData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })),
                                    className: `w-full p-3 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`,
                                    placeholder: "123",
                                    maxLength: 4,
                                    disabled: processing
                                }),
                                errors.cvv && createElement('p', {
                                    key: 'cvv-error',
                                    className: "text-red-500 text-sm mt-1"
                                }, errors.cvv)
                            ])
                        ])
                    ])
                ]),

                // Order Notes
                createElement('div', {
                    key: 'notes-section'
                }, [
                    createElement('label', {
                        key: 'notes-label',
                        className: "block text-sm font-medium text-gray-700 mb-2"
                    }, 'Order Notes (Optional)'),
                    createElement('textarea', {
                        key: 'notes-input',
                        value: formData.orderNotes,
                        onChange: (e) => setFormData(prev => ({ ...prev, orderNotes: e.target.value })),
                        className: "w-full p-3 border border-gray-300 rounded-md",
                        rows: 3,
                        placeholder: "Any special instructions for your order...",
                        disabled: processing
                    })
                ])
            ]),

            // Right Column - Order Summary
            createElement('div', {
                key: 'right-column'
            }, createElement('div', {
                className: "bg-white border border-gray-200 rounded-lg p-6 sticky top-4"
            }, [
                createElement('h4', {
                    key: 'summary-title',
                    className: "text-lg font-semibold text-gray-900 mb-4"
                }, 'Order Summary'),
                
                createElement('div', {
                    key: 'summary-details',
                    className: "space-y-3 mb-6"
                }, [
                    createElement('div', {
                        key: 'subtotal',
                        className: "flex justify-between"
                    }, [
                        createElement('span', { key: 'subtotal-label' }, 'Subtotal'),
                        createElement('span', { key: 'subtotal-value' }, `$${cartTotal.toFixed(2)}`)
                    ]),
                    createElement('div', {
                        key: 'shipping',
                        className: "flex justify-between"
                    }, [
                        createElement('span', { key: 'shipping-label' }, 'Shipping'),
                        createElement('span', { key: 'shipping-value' }, shippingTotal === 0 ? 'Free' : `$${shippingTotal.toFixed(2)}`)
                    ]),
                    createElement('div', {
                        key: 'tax',
                        className: "flex justify-between"
                    }, [
                        createElement('span', { key: 'tax-label' }, 'Tax'),
                        createElement('span', { key: 'tax-value' }, `$${tax.toFixed(2)}`)
                    ]),
                    createElement('div', {
                        key: 'total',
                        className: "border-t pt-3"
                    }, createElement('div', {
                        className: "flex justify-between font-semibold text-lg"
                    }, [
                        createElement('span', { key: 'total-label' }, 'Total'),
                        createElement('span', { key: 'total-value' }, `$${total.toFixed(2)}`)
                    ]))
                ]),

                createElement('div', {
                    key: 'action-buttons',
                    className: "space-y-3"
                }, [
                    createElement('button', {
                        key: 'place-order-btn',
                        type: "submit",
                        disabled: processing,
                        className: `w-full py-3 rounded-md font-medium transition-colors ${
                            processing 
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`
                    }, processing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`),
                    createElement('button', {
                        key: 'cancel-btn',
                        type: "button",
                        onClick: onCancel,
                        disabled: processing,
                        className: `w-full py-3 rounded-md font-medium transition-colors ${
                            processing 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`
                    }, 'Cancel')
                ])
            ]))
        ])
    ]);
};

export default CheckoutForm;