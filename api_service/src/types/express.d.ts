export { }

import type { Role } from '../middleware/auth.js'

declare global {
  namespace Express {
    interface Request {
      User?: { phone: string; role: Role }
    }
  }
}