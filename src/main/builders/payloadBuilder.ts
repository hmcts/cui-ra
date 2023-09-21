import { Actions } from './../constants';
import { DataManagerDataObject, PayloadCollectionItem } from './../interfaces';
import { MainPayloadDetail, MainPayloadDetailCollection, OutboundPayload } from './../models';

import { Request } from 'express';

export class PayloadBuilder {
  public static build(req: Request, action: string = Actions.SUBMIT): OutboundPayload {
    const outbound = new OutboundPayload();
    const flagsAsSupplied = new MainPayloadDetail();
    const replacementFlags = new MainPayloadDetail();
    if (req.session.partyname) {
      flagsAsSupplied.partyName = req.session.partyname;
      replacementFlags.partyName = req.session.partyname;
    }
    if (req.session.roleoncase) {
      flagsAsSupplied.roleOnCase = req.session.roleoncase;
      replacementFlags.roleOnCase = req.session.roleoncase;
    }
    if (req.session.correlationId) {
      outbound.correlationId = req.session.correlationId;
    }

    if (action === Actions.SUBMIT) {
      //populate Details
      let edata: MainPayloadDetailCollection[] = [];
      let ndata: MainPayloadDetailCollection[] = [];
      //flagsAsSupplied only return if there have been changes
      if (req.session.existingmanager?.modified === true) {
        const exisitingData = req.session.existingmanager?.data;
        if (exisitingData) {
          edata = exisitingData.map((item: PayloadCollectionItem) => {
            return {
              id: item.id,
              value: item.value,
            } as MainPayloadDetailCollection;
          });
        }
        //supplied flags have been modified
        flagsAsSupplied.details = edata;
      }
      if (req.session.newmanager?.modified === true) {
        const newData: DataManagerDataObject[] = req.session.newmanager?.data;
        if (newData) {
          ndata = newData
            .filter((item: DataManagerDataObject) => item._enabled === true && item._isParent === false)
            .map((item: DataManagerDataObject) => {
              return {
                value: item.value,
              } as MainPayloadDetailCollection;
            });
        }
      }
      //has to be outside of if as it can contain updated if they exist
      replacementFlags.details = [...edata, ...ndata];
    }

    outbound.flagsAsSupplied = flagsAsSupplied;
    outbound.replacementFlags = replacementFlags;
    outbound.action = action;
    return outbound;
  }
}
