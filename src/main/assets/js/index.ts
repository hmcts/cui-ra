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
