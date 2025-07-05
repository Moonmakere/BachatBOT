import { HoverEffect } from "../ui/cardHover";

export function FeatureSection() {
  return (
    <div className="bg-black" id="features">
      <div className="max-w-5xl mx-auto px-8 pb-40">
        <h2 className="text-6xl font-bold text-white text-center pb-12 montserrat-font-medium">
          Everything You Need, All In One App
        </h2>
        <HoverEffect items={features} />
      </div>
    </div>
  );
}

// --- NEW & IMPROVED FEATURES FOR BACHAT BOT ---
export const features = [
  {
    title: "Smart Tax Optimizer",
    description:
      "Bachat Bot analyzes your finances to recommend the best tax regime (Old vs. New) and suggests investments in ELSS, PPF, and NPS to maximize your savings.",
  },
  {
    title: "Personalized Banking System",
    description:
      "Get a complete, real-time view of your financial life. Track your bank accounts, investments, and spending, all in one secure place.",
  },
  {
    title: "AI-Powered Recommendations",
    description:
      "Beyond taxes, get personalized suggestions for the best credit cards, savings accounts, and insurance policies tailored to your lifestyle and financial goals.",
  },
  {
    title: "Your 24/7 Financial Dost",
    description:
      "Ask anything in plain English, from 'Which insurance is best for my parents?' to 'How much more can I invest in 80C?'. Your personal finance expert is always available.",
  },
  {
    title: "Bank-Grade Security",
    description:
      "Your trust is our priority. We use industry-leading encryption and security protocols to ensure your financial data is always safe and confidential.",
  },
  {
    title: "AI Insurance Advisor",
    description:
      "Built from the ground up for the Indian financial landscape. We understand the nuances of local tax laws, banking products, and investment options.",
  },
];
