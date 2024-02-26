import { config as testConfig } from '../config';

const { I } = inject();

Given('I am on the Home page', () => {
  I.amOnPage(testConfig.TEST_URL);
});

When(/^I click on the button 'Enter New Journey'$/, async function () {
  // I.wait(1);
  await I.waitForText('Enter New Journey');
  await I.click({ css: '#demonew' });
});

Then(
  /^I navigate to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case\?' page$/,
  async function () {
    // I.wait(5);
    await I.waitForText(
      'Do you have a physical, mental or learning disability or health condition that means you need support during your case'
    );
  }
);

When(/^I select all the checkboxes and click continue$/, async function () {
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004' });
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002' });
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0008' });
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0006' });
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0005' });
  I.click({ css: '#checkbox-label-PF0001-RA0001-RA0007' });
  I.click({ css: '#main-content > div > div > form > div.govuk-button-group > button' });
});
Then(/^I am navigated to 'I need adjustments to get to, into and around our buildings'$/, async function () {
  // I.wait(2);
  await I.waitForText('I need adjustments to get to, into and around our buildings');
});
When(/^I select all the options and click Continue$/, async function () {
  // I.wait(2);
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0022' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0025' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0023' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0021' });
  await I.fillField({ css: '#flagComment-PF0001-RA0001-RA0004-RA0021' }, 'Parking Space');
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0019' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0004-RA0020' });
  await I.click({ css: '#main-content > div > div > form > div.govuk-button-group > button' });
});

Then(/^I am navigated to 'I need documents in an alternative format' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need documents in an alternative format');
});
When(/^I select all the options and continue to next page$/, async function () {
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0014' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0012' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0010' });
  await I.fillField('#flagComment-PF0001-RA0001-RA0002-RA0010', 'I need x,y,z colours');
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0011' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0013' });
  await I.fillField('#flagComment-PF0001-RA0001-RA0002-RA0013', '8.5 x 11');
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0015' });
  await I.click({ css: '#checkbox-label-PF0001-RA0001-RA0002-RA0016' });
  await I.click({ css: '#main-content > div > div > form > div.govuk-button-group > button' });
});
Then(/^I am navigated to 'I need help communicating and understanding' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need help communicating and understanding');
});
When(/^I select all the options and click continue to next page$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0047');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0037');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0009');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0038');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0040');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0042');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0046');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(
  /^I am navigated to 'Hearing Enhancement System \(Hearing\/Induction Loop, Infrared Receiver\)' page$/,
  async function () {
    // I.wait(2);
    await I.waitForText('Hearing Enhancement System (Hearing/Induction Loop, Infrared Receiver)');
  }
);
When(/^I select all four options and click continue$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0043');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0045');
  await I.click('#checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0044');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(/^I am navigated to 'Which Sign Language Interpreter do you need to request\?' page$/, async function () {
  // I.wait(2);
  await I.waitForText('Which Sign Language Interpreter do you need to request?');
});
When(/^I type in the dynamic dropdown and select an option and click continue$/, async function () {
  // I.wait(2);
  await I.click('#custom-accessible-autocomplete');
  await I.fillField('#custom-accessible-autocomplete', 'British Sign Language (BSL)');
  await I.click('#custom-accessible-autocomplete__listbox');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(/^I am navigated to 'I need help with forms' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need help with forms');
});
When(/^I select all the three options and click continue$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0003-RA0017');
  await I.click('#checkbox-label-PF0001-RA0001-RA0003-RA0018');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(/^I am navigated to 'I need something to feel comfortable during my hearing' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need something to feel comfortable during my hearing');
});
When(/^I select all the five options and click continue$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0006-RA0030');
  await I.fillField('#flagComment-PF0001-RA0001-RA0006-RA0030', 'Describe what type of lighting you need');
  await I.click('#checkbox-label-PF0001-RA0001-RA0006-RA0033');
  await I.click('#checkbox-label-PF0001-RA0001-RA0006-RA0031');
  await I.click('#checkbox-label-PF0001-RA0001-RA0006-RA0032');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(/^I am navigated to 'I need to bring support with me to a hearing' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need to bring support with me to a hearing');
});
When(/^I select all the given options and click continue$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0005-RA0028');
  await I.click('#checkbox-label-PF0001-RA0001-RA0005-RA0027');
  await I.fillField('#flagComment-PF0001-RA0001-RA0005-RA0027', 'Mother');
  await I.click('#checkbox-label-PF0001-RA0001-RA0005-RA0026');
  await I.fillField('#flagComment-PF0001-RA0001-RA0005-RA0026', 'Carer');
  await I.click('#checkbox-label-PF0001-RA0001-RA0005-RA0029');
  await I.fillField('#flagComment-PF0001-RA0001-RA0005-RA0029', 'Dog');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});
Then(/^I am navigated to 'I need to request a certain type of hearing' page$/, async function () {
  // I.wait(2);
  await I.waitForText('I need to request a certain type of hearing');
});
When(/^I select all the four options and click continue$/, async function () {
  await I.click('#checkbox-label-PF0001-RA0001-RA0007-RA0034');
  await I.click('#checkbox-label-PF0001-RA0001-RA0007-RA0036');
  await I.click('#checkbox-label-PF0001-RA0001-RA0007-RA0035');
  await I.click('#main-content > div > div > form > div.govuk-button-group > button');
});

Then(/^I am navigated to 'Review the support you've requested' page$/, async function () {
  // I.wait(2);
  await I.waitForText("Review the support you've requested");
});

When(/^I review and click Submit$/, async function () {
  await I.click('#submit-review');
});

Then(/^I must see a successful message$/, async function () {
  await I.waitForText('This is a service dummy page');
});

When(/^I click on the button 'Enter Existing Journey'$/, async function () {
  // I.wait(2);
  await I.click('#demoexisting');
});

Then(/^I am navigated to 'Support for' page$/, async function () {
  // I.wait(2);
  await I.waitForText('Support for');
});

When(/^I click on 'Change my support options'$/, async function () {
  await I.click('#main-content > div > div > p > a');
});

Then(/^I am navigated to 'I want to tell you that my support needs have changed' page$/, async function () {
  // I.wait(1);
  await I.waitForText('I want to tell you that my support needs have changed');
});

When(/^I click on 'Start now' button$/, async function () {
  await I.click('#main-content > div > div > div.govuk-button-group > a.govuk-button.govuk-button--start');
});

Then(/^I am navigated to 'Review the support you've requested'$/, async function () {
  // I.wait(1);
  await I.waitForText("Review the support you've requested");
});

When(/^I click on 'Add a new support request' button$/, async function () {
  await I.click('#main-content > div > div > a');
});
