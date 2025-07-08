import { HoverEffect } from "../ui/cardHover";

export function FeatureSection() {
  return (
    <div className="bg-black" id="features">
      <div className="max-w-5xl mx-auto px-8 pb-40">
        <h2 className="text-6xl font-bold text-white text-center pb-12 montserrat-font-medium">
          Key Features
        </h2>
        <HoverEffect items={features} />
      </div>
    </div>
  );
}

export const features = [
  {
    title: "Automated Tax Analysis",
    description:
      "Analyzes your income, expenses, and investments to automatically identify applicable deductions under Indian tax laws.",
  },
  {
    title: "Tax-Saving Suggestions",
    description:
      "Get personalized recommendations on where to invest — like ELSS, PPF, and more — to maximize your tax savings ",
  },
  {
    title: "No Human Accountant ",
    description:
      "Say goodbye to traditional accountants. Our AI handles everything from document analysis to tax optimization",
  },
  {
    title: "OCR-powered Reading",
    description:
      "Upload bills, salary slips, or Form 16 — our AI reads and understands them to extract relevant financial data.",
  },
  {
    title: "Income Categorization",
    description:
      "Classifies your income into salary, business, capital gains, and other heads to apply the correct tax rules automatically.",
  },
  {
    title: "Built for Indian Tax System",
    description:
      "Designed specifically for the Indian Income Tax Act, keeping up-to-date with the latest laws, limits, and exemptions.",
  },
];
