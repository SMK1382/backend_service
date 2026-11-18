import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type TokenPayload = {
    phone: string;
    role: 'User' | 'Admin' | 'Super_Admin';
};


// export const hashPassword = (plainPassword: string): Promise<string> => {
//     return bcrypt.hash(plainPassword, 10);
// };

// export const comparePassword = (
//     plainPassword: string,
//     hashedPassword: string,
// ): Promise<boolean> => {
//     return bcrypt.compare(plainPassword, hashedPassword);
// };

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}