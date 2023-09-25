import '../scss/main.scss';
import accessibleAutocomplete from 'accessible-autocomplete';
import { initAll } from 'govuk-frontend';

initAll();

var elementExists = document.getElementById("custom-accessible-autocomplete");
if(elementExists){
  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    selectElement: document.querySelector('#custom-accessible-autocomplete'),
    confirmOnBlur: false,
  });
  let clearCheckboxes = Array.from(document.querySelectorAll('.clear-autocomplete'));
  clearCheckboxes.forEach((item) => {
    item.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      if (target && target.checked) {
        var input = document.getElementById("custom-accessible-autocomplete");
        if(input){
          (input as HTMLInputElement).value = '';
        }
      }
    })
  });
}