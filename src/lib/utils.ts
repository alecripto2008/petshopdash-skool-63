
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function groupPaymentsByMonth(payments: any[]) {
  if (!payments || !payments.length) return [];
  
  const grouped = payments.reduce((acc, payment) => {
    const date = new Date(payment.created_at);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        monthName: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        payments: [],
        total: 0,
      };
    }
    
    acc[monthYear].payments.push(payment);
    acc[monthYear].total += Number(payment.value) || 0;
    
    return acc;
  }, {});
  
  return Object.values(grouped).sort((a: any, b: any) => {
    const monthA = new Date(a.payments[0].created_at);
    const monthB = new Date(b.payments[0].created_at);
    return monthB.getTime() - monthA.getTime(); // Sort DESC (newest first)
  });
}
