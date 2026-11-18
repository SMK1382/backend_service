import { type Request, type Response, type NextFunction } from 'express'
import jwt from "jsonwebtoken";


export type Role = 'User' | 'Admin' | 'Super_Admin';

const ROLE_LEVEL: Record<Role, number> = {
  User: 1,
  Admin: 2,
  Super_Admin: 3,
};
const FORBIDDEN_MESSAGE = 'دسترسی غیرمجاز';


// توکن کاربر که در هدر درخواستش میباشد بهتر است به بدنه درخواست منتقل بشود.
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // هدر Authorization به‌صورت "Bearer <token>" ارسال می‌شود
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'توکن ارسال نشده است' });
    return;
  }

  try {
    const token = header.split(' ')[1]; // جدا کردن بخش توکن
    // تایید اعتبار توکن با کلید محرمانه
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      phone: string;
      role: Role;
    };
    req.User = payload; // الصاق اطلاعات کاربر برای استفاده در مسیرها
    next();
  } catch {
    res.status(401).json({ error: 'توکن نامعتبر یا منقضی است' });
  }
}

export function requireRole(minimum: Role) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.User?.role as Role | undefined;
    if (!userRole || (ROLE_LEVEL[userRole] ?? 0) < ROLE_LEVEL[minimum]) {
      res.status(403).json({ error: FORBIDDEN_MESSAGE });
      return;
    }
    next();
  };
}