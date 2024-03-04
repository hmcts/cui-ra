Feature: Not selecting anything and trying to proceed should not de-select parent

  Scenario: Not selecting any features and submitting should not deselect parent
    Given I am on the Home page
    When I click on the button 'Enter New Journey'
    Then I navigate to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    When I select the following checkboxes and click continue
    | I need adjustments to get to, into and around our buildings |
    | I need documents in an alternative format                   |
    Then I am navigated to 'I need adjustments to get to, into and around our buildings'
    When I click continue
    Then I am presented with an error message
    When I click back
    Then I navigate to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    And I see selected options
    | I need adjustments to get to, into and around our buildings |
    | I need documents in an alternative format                   |


