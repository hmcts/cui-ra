import { config as testConfig } from '../config';

const { I } = inject();

Given("I am on the Home page", () => {
  I.amOnPage(testConfig.TEST_URL);
});

When("I click the button with ID {string}", async (buttonId) => {
  await I.waitForVisible({ css: buttonId });
  await I.click({ css: buttonId });
});

When("I click on the button labeled {string}", async (label) => {
  const locator = await locate('button').withText(label);
  await I.seeElement(locator);
  await I.click(locator);
});

When("I click on the link labeled {string}", async (label) => {
  const locator = await locate('a').withText(label);
  await I.seeElement(locator);
  await I.click(locator);
});


When("I click the input with ID {string}", async (buttonId) => {
  await I.click({ css: buttonId });
});

When("I select the following checkboxes", async (checkboxIds) => {
  if (typeof checkboxIds !== 'object' || !checkboxIds.content) {
    throw new Error('Invalid checkboxIds object');
  }
  const ids = checkboxIds.content.trim().split('\n').map(id => id.trim());
  for (const id of ids) {
    await I.waitForVisible({ css: id });
    await I.click({ css: id });
  }
});

Then("I navigate to {string} page", async (pageTitle) => {
  await I.waitForText(pageTitle);
});

Then("I am navigated to {string} page", async (pageTitle) => {
  await I.waitForText(pageTitle);
});

When("I fill the textbox with ID {string} with value {string}", async (textboxId, value) => {
  await I.waitForVisible({ css: textboxId });
  await I.fillField({ css: textboxId }, value);
});

Then('I see selected options', async data => {
  const labels = data.rows.map(row => row.cells[0].value);
  labels.forEach(label => I.seeCheckboxIsChecked(label));
});

Then('I am presented with the following error message {string}', async (message) => {
  I.waitForText(message);
});
