import {
  ReferenceData,
  ReferenceDataFlagType,
  ReferenceDataResponse,
  ReferenceDataResponseDetail,
} from './../interfaces';

import autobind from 'autobind-decorator';
import { AxiosInstance, HttpStatusCode } from 'axios';

export enum flagResourceType {
  PARTY = 'PARTY',
  CASE = 'CASE',
}

export class RefDataResponseDetail implements ReferenceDataResponseDetail {
  public FlagDetails?: RefDataFlagType[];
}

export class RefDataResponse implements ReferenceDataResponse {
  public flags: RefDataResponseDetail[] = [];
}

export class RefDataFlagType implements ReferenceDataFlagType {
  public name = '';
  public name_cy = '';
  public hearingRelevant = false;
  public flagComment = false;
  public defaultStatus: string | undefined;
  public externallyAvailable = false;
  public flagCode = '';
  public nativeFlagCode = '';
  public isParent = false;
  // Note: property is deliberately spelt "Path" and not "path" because the Reference Data Common API returns the former
  public Path: string[] = [];
  public childFlags: RefDataFlagType[] = [];
  public listOfValuesLength = 0;
  public listOfValues: { key: string; value: string; value_cy: string | undefined }[] = [];
}

@autobind
export class RefData implements ReferenceData {
  constructor(private client: AxiosInstance) {}

  public async getFlags(
    serviceToken: string,
    accessToken: string,
    serviceId: string,
    flagType: flagResourceType,
    welsh = false
  ): Promise<RefDataResponse> {
    const path = `/refdata/commondata/caseflags/service-id=${serviceId}`;

    const queryParams: { [key: string]: string | number } = {};

    Object.assign(queryParams, { 'available-external-flag': 'Y' });

    if (typeof flagType !== 'undefined') {
      Object.assign(queryParams, { 'flag-type': flagType });
    }

    if (typeof welsh !== 'undefined') {
      const isWelsh = welsh ? 'Y' : 'N';
      Object.assign(queryParams, { 'welsh-required': isWelsh });
    }

    let queryString = '';
    if (Object.keys(queryParams).length !== 0) {
      queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
    }

    const headers = {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ServiceAuthorization: `${serviceToken}`,
      Authorization: `${accessToken}`,
    };

    const response = await this.client.get(`${path}?${queryString}`, {
      headers,
    });

    if (
      response.status !== HttpStatusCode.Ok ||
      !response.data ||
      !response.data.flags ||
      !response.data.flags.length ||
      !response.data.flags[0].FlagDetails
    ) {
      // Note: Reference Data Common API appears to respond with a 404 error rather than send an empty response,
      // so this may be redundant
      throw new Error('No flag types could be retrieved');
    }

    return response.data;
  }
}
