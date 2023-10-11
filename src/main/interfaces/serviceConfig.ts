export interface ServiceConfigFlagInterface {
  flagCode: string;
  remove?: boolean;
}

export interface ServiceConfigInterface {
  flags: ServiceConfigFlagInterface[];
}
