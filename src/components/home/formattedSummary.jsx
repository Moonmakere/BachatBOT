import React from 'react';
 
const FormattedSummary = ({ text }) => {
  const formatText = (text) => {
    return text.split('\n').map((section, index) => {
      let formattedSection = section;
 
      // Handle italic (***) before bold (**)
      formattedSection = formattedSection.replace(
        /\*\*\*(.*?)\*\*\*/g,
        '<span class="italic">$1</span>'
      );
 
      // Then bold (**)
      formattedSection = formattedSection.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="font-bold">$1</span>'
      );
 
      // Superscript
      formattedSection = formattedSection.replace(
        /<sup>(.*?)<\/sup>/g,
        '<sup class="text-xs relative -top-1">$1</sup>'
      );
 
      // Subscript
      formattedSection = formattedSection.replace(
        /<sub>(.*?)<\/sub>/g,
        '<sub class="text-xs relative -bottom-1">$1</sub>'
      );
 
      return (
        <p
          key={index}
          className="mb-4 last:mb-0"
          dangerouslySetInnerHTML={{ __html: formattedSection }}
        />
      );
    });
  };
 
  return (
    <div className="prose max-w-none">
      {formatText(text)}
    </div>
  );
};
 
export default FormattedSummary;
 
 