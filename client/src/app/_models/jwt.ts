
import { User } from './user';

export interface JWT {
  token: string;
  user?: User;
}
