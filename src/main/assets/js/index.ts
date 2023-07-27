import '../scss/main.scss';
import { initAll } from 'govuk-frontend';
import accessibleAutocomplete from 'accessible-autocomplete';

initAll();

accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    selectElement: document.querySelector('#country'),
    confirmOnBlur: false,
});
