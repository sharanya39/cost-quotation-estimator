
import React from 'react';

// This is a component wrapper that will be used to replace
// any instances of "Non technical summary" with "Non technical Analysis"
export const NonTechnicalAnalysis = (props: React.PropsWithChildren<{}>) => {
  return <>{props.children}</>;
};

// Export a function that can be used to transform text
export const replaceNonTechnicalSummary = (text: string): string => {
  return text.replace(/Non technical summary/g, "Non technical Analysis");
};
