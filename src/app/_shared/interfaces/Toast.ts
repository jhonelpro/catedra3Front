/**
 * Interface para el manejo de los Toasts
 */
export interface Toast {
    id: string;                                        // ID del Toast
    message: string;                                   // Mensaje del Toast
    type: 'success' | 'error' | 'warning' | 'info';    // Tipo de Toast
    duration?: number;                                 // Duración del Toast
}