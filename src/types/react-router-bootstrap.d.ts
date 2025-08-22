declare module 'react-router-bootstrap' {
  import { ComponentType } from 'react';
  
  export interface LinkContainerProps {
    to: string;
    children: React.ReactNode;
    className?: string;
    replace?: boolean;
    state?: any;
  }
  
  export const LinkContainer: ComponentType<LinkContainerProps>;
}
