/**
 * Utilidades generales para la aplicación de stock
 */

// ========================
// FORMATEO DE MONEDA
// ========================

/**
 * Formatea un número como moneda en Guaraníes paraguayos
 * @param amount - El monto a formatear
 * @param showDecimals - Si mostrar decimales (por defecto false)
 * @returns String formateado como "Gs 5.000"
 * 
 * @example
 * formatCurrency(5000) // "Gs 5.000"
 * formatCurrency(5000.50, true) // "Gs 5.000,50"
 * formatCurrency(0) // "Gs 0"
 */
export const formatCurrency = (
  amount: number | string | undefined | null,
  showDecimals: boolean = false
): string => {
  // Manejar valores nulos o indefinidos
  if (amount === undefined || amount === null) {
    return 'Gs 0';
  }
  
  // Convertir a número si es string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Verificar si es un número válido
  if (isNaN(numericAmount)) {
    return 'Gs 0';
  }
  
  // Formatear el número con separadores de miles (punto) y decimales (coma)
  const formattedNumber = new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numericAmount);
  
  return `Gs ${formattedNumber}`;
};

/**
 * Formatea solo el monto sin símbolo de moneda
 * @param amount - El monto a formatear
 * @param showDecimals - Si mostrar decimales (por defecto false)
 * @returns String formateado como "5.000"
 */
export const formatAmount = (
  amount: number | string | undefined | null,
  showDecimals: boolean = false
): string => {
  if (amount === undefined || amount === null) {
    return '0';
  }
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return '0';
  }
  
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(numericAmount);
};

/**
 * Calcula y formatea un total con moneda
 * @param quantity - Cantidad
 * @param unitPrice - Precio unitario
 * @returns String formateado como "Gs 15.000"
 */
export const formatTotal = (
  quantity: number,
  unitPrice: number
): string => {
  const total = quantity * unitPrice;
  return formatCurrency(total);
};

// ========================
// FORMATEO DE NÚMEROS
// ========================

/**
 * Formatea un número entero con separadores de miles
 * @param number - El número a formatear
 * @returns String formateado como "5.000"
 */
export const formatNumber = (
  number: number | string | undefined | null
): string => {
  return formatAmount(number, false);
};

// ========================
// FORMATEO DE FECHAS
// ========================

/**
 * Formatea una fecha en formato local paraguayo
 * @param date - La fecha a formatear
 * @returns String formateado como "31/12/2023"
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj);
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha con hora en formato local paraguayo
 * @param date - La fecha a formatear
 * @returns String formateado como "31/12/2023, 14:30"
 */
export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch {
    return 'Fecha inválida';
  }
};