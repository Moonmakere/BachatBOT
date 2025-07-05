'use client';
import { useState } from 'react';
import Sidebar from "../../components/layout/Sidebar";
 
const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
 
    const faqs = [
        {
            question: "What tax services do you offer?",
            answer: "We offer a comprehensive range of tax services including personal tax returns, business tax planning, GST/HST filing, and tax consultation services."
        },
        {
            question: "How long does it take to process my tax return?",
            answer: "Typically, we process most tax returns within 5-7 business days. However, complex returns may take longer."
        },
        {
            question: "What documents do I need to prepare my taxes?",
            answer: "You'll need T4 slips, investment income statements, receipts for deductions and credits, and previous year's tax return. The specific documents depend on your situation."
        },
        {
            question: "Do you offer virtual tax consultations?",
            answer: "Yes, we offer virtual consultations through video calls for your convenience and safety."
        }
    ];
 
    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
 
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="w-full flex-1 overflow-auto">
                <div className="flex justify-center py-12 px-4">
                    <div className="bg-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-xl w-full max-w-5xl border border-gray-200">
                        <h1 className="text-blue-500 text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h1>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                                >
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full text-left px-6 py-5 bg-gray-50 hover:bg-gray-100 flex justify-between items-center font-medium text-lg text-gray-900"
                                    >
                                        {faq.question}
                                        <span className="text-2xl text-blue-500">
                                            {activeIndex === index ? '−' : '+'}
                                        </span>
                                    </button>
                                    {activeIndex === index && (
                                        <div className="px-6 pb-6 pt-2 bg-white text-gray-700 text-base">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default FAQPage;