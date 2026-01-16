import React, { useState } from 'react';
import { IoChevronDown, IoChevronUp, IoHelpCircleOutline } from "react-icons/io5";

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='border-b border-gray-100 last:border-none'>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className='w-full py-4 flex items-center justify-between text-left focus:outline-none hover:bg-gray-50 px-2 rounded'
            >
                <span className='font-medium text-gray-800'>{question}</span>
                {isOpen ? <IoChevronUp className="text-gray-500" /> : <IoChevronDown className="text-gray-500" />}
            </button>
            {isOpen && (
                <div className='px-2 pb-4 text-gray-600 text-sm leading-relaxed'>
                    {answer}
                </div>
            )}
        </div>
    );
};

const Faqs = () => {
    const faqs = [
        {
            q: "How do I place an order?",
            a: "Browsing products, adding them to your cart, and proceeding to checkout. It's simple and fast!"
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept Credit/Debit cards, UPI, Wallets, and Net Banking. Cash on Delivery is also available for select locations."
        },
        {
            q: "Can I cancel my order?",
            a: "Yes, you can cancel your order from the 'My Orders' section before it is packed for dispatch."
        },
        {
            q: "How can I track my delivery?",
            a: "Once your order is out for delivery, you can track the delivery partner in real-time on the app."
        },
        {
            q: "Do you offer refunds?",
            a: "Refunds are processed to the original payment method for prepaid orders and to your wallet for COD orders if items are missing or damaged."
        }
    ];

    return (
        <div className='p-4 max-w-3xl mx-auto'>
             <div className='bg-white shadow-sm p-4 rounded mb-6 flex items-center justify-between border border-gray-100'>
                <h2 className='font-bold text-lg flex items-center gap-2'>
                    <IoHelpCircleOutline size={24} className="text-yellow-500"/>
                    Frequently Asked Questions
                </h2>
            </div>
            
            <div className='bg-white shadow-md rounded-lg p-2 md:p-6'>
                {faqs.map((faq, index) => (
                    <FaqItem key={index} question={faq.q} answer={faq.a} />
                ))}
            </div>

             <div className="mt-8 text-center text-sm text-gray-500">
                <p>Can't find what you're looking for?</p>
                <button className="text-green-600 font-semibold mt-1 hover:underline">Contact Support</button>
            </div>
        </div>
    );
};

export default Faqs;
