import '../scss/main.scss';
import accessibleAutocomplete from 'accessible-autocomplete';
import { initAll } from 'govuk-frontend';

initAll();

const elementExists = document.getElementById('custom-accessible-autocomplete');
if (elementExists) {
  accessibleAutocomplete.enhanceSelectElement({
    id: 'custom-accessible-autocomplete',
    name: 'typeahead',
    menuAttributes: {
      'aria-labelledby': 'custom-accessible-autocomplete',
    },
    defaultValue: '',
    selectElement: document.querySelector('#custom-accessible-autocomplete'),
    confirmOnBlur: false,
  });
  const typeahead = document.querySelector('input[name=typeahead]');
  setTimeout(() => {
    typeahead?.setAttribute('aria-labelledby', 'custom-accessible-autocomplete');
  }, 10);
  const clearCheckboxes = Array.from(document.querySelectorAll('.clear-autocomplete'));
  clearCheckboxes.forEach(item => {
    item.addEventListener('change', event => {
      const target = event.target as HTMLInputElement;
      if (target && target.checked) {
        const input = document.getElementById('custom-accessible-autocomplete');
        if (input) {
          (input as HTMLInputElement).value = '';
        }
      }
    });
  });
}

const textareas = document.getElementsByTagName("textarea");

function adjustTextarea(textarea) {

  const textHeight = parseFloat(getComputedStyle(textarea).lineHeight) || parseFloat(getComputedStyle(textarea).fontSize);
  const minRows = parseInt(textarea.getAttribute("rows")) || 1;
  const minHeight = minRows * textHeight;

  if (textarea.value === '' || textarea.scrollHeight <= minHeight) {
    textarea.style.height = (minHeight) + "px";
  }else{
    textarea.style.height = (Math.max(textarea.scrollHeight, minRows * textHeight)) + "px";
  }

}

if(textareas){
  for (let i = 0; i < textareas.length; i++) {
    const textarea = textareas[i];
    // Adjust the textarea on initialization
    adjustTextarea(textarea);
    textarea.addEventListener("input", function () {
      // Adjust the textarea whenever the input event occurs
      adjustTextarea(this);
    });
  }
}
