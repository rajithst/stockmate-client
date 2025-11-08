import React from 'react';

export interface LoadingIndicatorProps {
  message?: string;
  minHeight?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Loading...',
  minHeight = 'min-h-[40vh]',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mb-4" />
      <span className="text-lg text-gray-600 font-medium">{message}</span>
    </div>
  );
};

export default LoadingIndicator;
