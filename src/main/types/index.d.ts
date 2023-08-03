import { SessionData } from 'express-session';
declare module 'express-session' {
  export interface SessionData {
    partyname?: string;
    roleoncase?: string;
    callbackUrl?: string;
    logoutUrl?: string;
    exisitingmanager?: string;
    newmanager?: string;
  }
}
