import { PayloadFlagData } from './payload';

export type DataManagerDataObject = PayloadFlagData;

export interface DataManager {
  data: DataManagerDataObject[];
  set(): string;
  init(): void;
  merge(): void;
  save(): void;
}
