
import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 border-4 border-t-transparent border-amber-500 rounded-full animate-spin" />
    </div>
  );
};
