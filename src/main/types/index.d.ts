import { ExistingFlagsManager } from './../managers';
import { SessionData } from 'express-session';
declare module 'express-session' {
  export interface SessionData {
    partyname?: string;
    roleoncase?: string;
    callbackUrl?: string;
    logoutUrl?: string;
    existingmanager?: ExistingFlagsManager;
    newmanager?: string;
  }
}
