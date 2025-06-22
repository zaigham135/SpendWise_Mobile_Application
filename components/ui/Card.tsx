import { View, ViewProps } from 'react-native';
import { ReactNode } from 'react';

interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}