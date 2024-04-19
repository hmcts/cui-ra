@new-journey-errors
Feature: Not selecting anything and trying to proceed should not de-select parent

  Scenario: Not selecting any features and submitting should not deselect parent
    Given I am on the Home page
    When I click the button with ID '#demonew'
    Then I am navigated to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0004
        #checkbox-label-PF0001-RA0001-RA0002
        #checkbox-label-PF0001-RA0001-RA0008
        #checkbox-label-PF0001-RA0001-RA0006
        #checkbox-label-PF0001-RA0001-RA0005
        #checkbox-label-PF0001-RA0001-RA0007
        """

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need adjustments to get to, into and around our buildings' page

    When I click on the button labeled 'Continue'

    Then I am presented with the following error message 'Select whether you need adjustments to get to, into and around our buildings'

    When I click on the link labeled 'Back'

    Then I am navigated to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    
    And I see selected options
    | I need adjustments to get to, into and around our buildings |
    | I need documents in an alternative format                   |


