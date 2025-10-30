@new-journey-e2e
Feature: New Journey

  Scenario: The home page loads and I click on New Journey
    Given I am on the Home page

    When I click the button with ID '#demonew'

    Then I am navigated to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    Then I find 'Contact us for help' text

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
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0004-RA0024
        #checkbox-label-PF0001-RA0001-RA0004-RA0022
        #checkbox-label-PF0001-RA0001-RA0004-RA0025
        #checkbox-label-PF0001-RA0001-RA0004-RA0023
        #checkbox-label-PF0001-RA0001-RA0004-RA0021
        #checkbox-label-PF0001-RA0001-RA0004-RA0019
        #checkbox-label-PF0001-RA0001-RA0004-RA0020
        """

    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0004-RA0021' with value 'Parking Space'

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need documents in an alternative format' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0002-RA0014
        #checkbox-label-PF0001-RA0001-RA0002-RA0012
        #checkbox-label-PF0001-RA0001-RA0002-RA0010
        #checkbox-label-PF0001-RA0001-RA0002-RA0011
        #checkbox-label-PF0001-RA0001-RA0002-RA0013
        #checkbox-label-PF0001-RA0001-RA0002-RA0015
        #checkbox-label-PF0001-RA0001-RA0002-RA0016
        """

    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0002-RA0010' with value 'I need x,y,z colours'
    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0002-RA0013' with value '8.5 x 11'

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need help communicating and understanding' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0008-RA0047
        #checkbox-label-PF0001-RA0001-RA0008-RA0037
        #checkbox-label-PF0001-RA0001-RA0008-RA0009
        #checkbox-label-PF0001-RA0001-RA0008-RA0038
        #checkbox-label-PF0001-RA0001-RA0008-RA0040
        #checkbox-label-PF0001-RA0001-RA0008-RA0042
        #checkbox-label-PF0001-RA0001-RA0008-RA0046
        """

    When I click on the button labeled 'Continue'

    Then I am navigated to 'Hearing Enhancement System (Hearing/Induction Loop, Infrared Receiver)' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0043
        #checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0045
        #checkbox-label-PF0001-RA0001-RA0008-RA0009-RA0044
        """

    When I click on the button labeled 'Continue'

    Then I am navigated to 'Which Sign Language Interpreter do you need to request?' page
    Then I find 'Contact us for help' text

    When I click the input with ID '#custom-accessible-autocomplete'
    When I fill the textbox with ID '#custom-accessible-autocomplete' with value 'British Sign Language (BSL)'
    When I click the input with ID '#custom-accessible-autocomplete__listbox'

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need something to feel comfortable during my hearing' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0006-RA0030
        #checkbox-label-PF0001-RA0001-RA0006-RA0033
        #checkbox-label-PF0001-RA0001-RA0006-RA0031
        #checkbox-label-PF0001-RA0001-RA0006-RA0032
        """

    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0006-RA0030' with value 'Describe what type of lighting you need'

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need to bring support with me to a hearing' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0005-RA0028
        #checkbox-label-PF0001-RA0001-RA0005-RA0027
        #checkbox-label-PF0001-RA0001-RA0005-RA0026
        #checkbox-label-PF0001-RA0001-RA0005-RA0029
        """

    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0005-RA0027' with value 'Mother'
    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0005-RA0026' with value 'Carer'
    When I fill the textbox with ID '#flagComment-PF0001-RA0001-RA0005-RA0029' with value 'Dog'

    When I click on the button labeled 'Continue'

    Then I am navigated to 'I need to request a certain type of hearing' page
    Then I find 'Contact us for help' text

    When I select the following checkboxes
        """
        #checkbox-label-PF0001-RA0001-RA0007-RA0034
        #checkbox-label-PF0001-RA0001-RA0007-RA0036
        #checkbox-label-PF0001-RA0001-RA0007-RA0035
        """

    When I click on the button labeled 'Continue'

    Then I am navigated to "Review the support you've requested" page
    Then I find 'Contact us for help' text

    When I click the button with ID "#submit-review"

    Then I am navigated to 'This is a service dummy page' page
