import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
    <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"></path>
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.44.17-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.3 9.81c-.11.2-.06.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0-.44.17-.48.41l-.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59.22l1.92-3.32c.12-.22.06-.47-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);
  
export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.542L16.5 21.75l-.398-1.208a3.375 3.375 0 00-2.456-2.456L12.75 18l1.208-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.208a3.375 3.375 0 002.456 2.456L20.25 18l-1.208.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);
  
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const DjdLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
      className={className} 
      viewBox="0 0 50 50" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="50" height="50" rx="5" ry="5" fill="#DC2626" />
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fill="white" 
        fontSize="20" 
        fontWeight="bold" 
        fontFamily="Arial, sans-serif"
      >
        DJD
      </text>
    </svg>
);

export const OpenAIIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.28 10.13C22.62 10.3 23 10.6 23 11v2c0 .4-.38.7-.72.87-.02.01-.05.02-.07.03-.43.21-.9.32-1.38.32s-.95-.11-1.38-.32a.89.89 0 0 1-.07-.03c-.34-.17-.72-.47-.72-.87v-2c0-.4.38-.7.72-.87.02-.01.05-.02.07-.03.43-.21.9-.32-1.38-.32s-.95.11-1.38.32a.89.89 0 0 1-.07.03c-.34.17-.72.47-.72.87v2c0 .4.38.7.72.87.02.01.05.02.07.03.43.21.9.32 1.38.32v.75c-1.32 0-2.5-.54-3.34-1.4a5.05 5.05 0 0 1-1.48-3.77c0-2.8 2.2-5 5-5s5 2.2 5 5c0 .78-.17 1.52-.5 2.17V10.8c.43-.21.9-.32 1.38-.32s.95.11 1.38.32c.02.01.05.02.07.03zM1.72 13.87C1.38 13.7 1 13.4 1 13v-2c0-.4.38-.7.72-.87.02-.01.05-.02.07-.03.43-.21.9-.32 1.38-.32s.95.11 1.38.32a.89.89 0 0 1 .07.03c.34.17.72.47.72.87v2c0 .4-.38.7-.72.87a.89.89 0 0 1-.07.03c-.43.21-.9.32-1.38.32s-.95-.11-1.38-.32a.89.89 0 0 1-.07-.03zM6.5 8.32C6.07 8.11 5.6 8 5.12 8s-.95.11-1.38.32a.89.89 0 0 0-.07.03c-.34.17-.72.47-.72.87v4.5c0 .4.38.7.72.87.02.01.05.02.07.03.43.21.9.32 1.38.32s.95-.11 1.38-.32a.89.89 0 0 0 .07-.03c.34-.17.72-.47-.72-.87v-4.5c0-.4-.38-.7-.72-.87a.89.89 0 0 0-.07-.03zm5.63-2.07c-.43.21-.9.32-1.38.32s-.95-.11-1.38-.32A.89.89 0 0 0 9.3 6.22C8.95 6.05 8.58 5.75 8.58 5.35v-2c0-.4.38-.7.72-.87a.89.89 0 0 1 .07-.03c.43-.21.9-.32 1.38-.32s.95.11 1.38.32a.89.89 0 0 1 .07.03c.34.17.72.47.72.87v2c0 .4-.38.7-.72.87-.02.01-.05.02-.07.03zM9.3 17.78c.34.17.72.47.72.87v2c0 .4-.38.7-.72.87a.89.89 0 0 1-.07.03c-.43.21-.9.32-1.38.32s-.95-.11-1.38-.32a.89.89 0 0 1-.07-.03C6.05 21.65 5.68 21.35 5.68 20.95v-2c0-.4.38-.7.72-.87.02-.01.05.02.07-.03.43-.21.9.32 1.38-.32s.95.11 1.38.32c.02.01.05.02.07.03z" />
    </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.5l-4.242 1.5 1.5-4.242L16.862 4.487Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12.572V19.5a2.25 2.25 0 0 1-2.25 2.25H4.5A2.25 2.25 0 0 1 2.25 19.5V4.5A2.25 2.25 0 0 1 4.5 2.25H9.572" />
    </svg>
);
  
export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const MarkdownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M3,5V19H21V5H3M9.5,15H8V9H9.5V15M12.5,15H11V9H12.5V15M17,15H14V11.5L15.5,13.5L17,11.5V15Z" />
    </svg>
);