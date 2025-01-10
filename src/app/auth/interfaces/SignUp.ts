export interface SignUp {
    rut:             string;
    name:            string;
    dateOfBirth:     Date | null;
    gender:          string;
    email:           string;
    password:        string;
    confirmPassword: string;
}
