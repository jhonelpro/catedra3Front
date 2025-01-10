/**
 * Interfaz que define la estructura de los datos que se almacenan en el token JWT.
 */
export interface JWTPayload {
    email: string;      // Correo electrónico
    given_name: string; // Nombre
    nameid: string;     // Identificador
    jti: string;        // Identificador único
    role: string;       // Rol
    nbf: number;        // Fecha de inicio
    exp: number;        // Fecha de expiración
    iat: number;        // Fecha de creación
    iss: string;        // Emisor    
    aud: string;        // Audiencia
}