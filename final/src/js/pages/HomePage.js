// js/pages/HomePage.js
import React, { createElement } from 'react';
import { TruckIcon, ShieldIcon, PackageIcon } from '../utils/icons';
import ProductCard from '../components/ProductCard';

const HomePage = ({ products, selectedCategory, setSelectedCategory, setCurrentPage }) => {
    const featuredProducts = products.slice(0, 6);

    return createElement('div', {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    }, [
        createElement('div', {
            key: 'hero',
            className: "bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-8 mb-12"
        }, createElement('div', {
            className: "max-w-3xl"
        }, [
            createElement('h1', {
                key: 'hero-title',
                className: "text-4xl md:text-5xl font-bold mb-4"
            }, 'Welcome to ShopHub'),
            createElement('p', {
                key: 'hero-desc',
                className: "text-xl mb-6"
            }, 'Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.'),
            createElement('button', {
                key: 'hero-cta',
                onClick: () => setCurrentPage('products'),
                className: "bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            }, 'Shop Now')
        ])),

        createElement('div', {
            key: 'features',
            className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        }, [
            createElement('div', {
                key: 'feature-1',
                className: "text-center p-6"
            }, [
                createElement('div', {
                    key: 'feature-1-icon',
                    className: "bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                }, createElement(TruckIcon, {
                    className: "text-blue-600"
                })),
                createElement('h3', {
                    key: 'feature-1-title',
                    className: "text-lg font-semibold mb-2"
                }, 'Free Shipping'),
                createElement('p', {
                    key: 'feature-1-desc',
                    className: "text-gray-600"
                }, 'Free shipping on orders over $50')
            ]),
            createElement('div', {
                key: 'feature-2',
                className: "text-center p-6"
            }, [
                createElement('div', {
                    key: 'feature-2-icon',
                    className: "bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                }, createElement(ShieldIcon, {
                    className: "text-green-600"
                })),
                createElement('h3', {
                    key: 'feature-2-title',
                    className: "text-lg font-semibold mb-2"
                }, 'Secure Payment'),
                createElement('p', {
                    key: 'feature-2-desc',
                    className: "text-gray-600"
                }, 'Your payment information is safe with us')
            ]),
            createElement('div', {
                key: 'feature-3',
                className: "text-center p-6"
            }, [
                createElement('div', {
                    key: 'feature-3-icon',
                    className: "bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                }, createElement(PackageIcon, {
                    className: "text-purple-600"
                })),
                createElement('h3', {
                    key: 'feature-3-title',
                    className: "text-lg font-semibold mb-2"
                }, 'Easy Returns'),
                createElement('p', {
                    key: 'feature-3-desc',
                    className: "text-gray-600"
                }, '30-day return policy on all items')
            ])
        ]),

        createElement('div', {
            key: 'featured',
            className: "mb-12"
        }, [
            createElement('h2', {
                key: 'featured-title',
                className: "text-3xl font-bold text-gray-900 mb-8"
            }, 'Featured Products'),
            createElement('div', {
                key: 'featured-grid',
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            }, featuredProducts.map(product => createElement(ProductCard, {
                key: product.id,
                product: product
            })))
        ])
    ]);
};

export default HomePage;