import { DataManagerDataObject } from './../interfaces';
import { ErrorMessages } from './../constants'
//process the form data
export class FormProcessor {
    public static process(body:any, parent:DataManagerDataObject, children:DataManagerDataObject[]|null = null): DataManagerDataObject[]{
        //check body has data

        if(parent?._listOfValuesLength && (parent?._listOfValuesLength > 0 && parent?._listOfValuesLength < 10)){
            //radio
            return [];
        } else if(parent?._listOfValuesLength && parent?._listOfValuesLength >= 10){
            //typeahead
            return [];
        } else if(parent?._isCategoryPage){
            //checkbox
            //move this into a model to standardise it across form types
            let data = body['form.data'];
            let enabled = body['form.enabled'];

            if(enabled.length <= 0){
                //nothing enabled
                //throw an error they have to select no support required at min
            }
            //loop possible options and enable or disable
            //if enabled merge data
            //SECURITY NOTE - make sure only flagComment can get set/
            //Changing the html element name for example would merge to the wrong item and could
            //allow a user to change the status of a requested item
            children?.map(function (item: DataManagerDataObject) {
                item._errors = [];
                if(enabled.includes(item.id)){
                item._enabled = true;
                //merge data
                Object.assign(item.value,data[item.id]);
                return item;
                }else{
                item._enabled = false;
                Object.assign(item.value,{
                    flagComment:'',
                    flagComment_cy:''
                });
                return item;
                }
            });
            return children || [];
        } else{
            throw new Error(ErrorMessages.UNEXPECTED_ERROR);
        }
    }
}