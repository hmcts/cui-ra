import { SessionData } from 'express-session';
import { ExistingFlagsManager, NewFlagsManager } from './../managers';
import { SessionData } from './../interfaces';

declare module 'express-session' {
  export interface SessionData {
    hmctsserviceid?: string;
    masterflagcode?: string;
    mastername?: string;
    mastername_cy?: string;
    partyname?: string;
    roleoncase?: string;
    callbackUrl?: string;
    logoutUrl?: string;
    existingmanager: ExistingFlagsManager;
    newmanager: NewFlagsManager;
    sessioninit: boolean;
  }
}
