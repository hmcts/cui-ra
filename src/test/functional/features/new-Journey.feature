@allJourney
Feature: New Journey

  Scenario: The home page loads and I click on New Journey
    Given I am on the Home page
    When I click on the button 'Enter New Journey'
    Then I navigate to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    When I select all the checkboxes and click continue
    Then I am navigated to 'I need adjustments to get to, into and around our buildings'
    When I select all the options and click Continue
    Then I am navigated to 'I need documents in an alternative format' page
    When I select all the options and continue to next page
    Then I am navigated to 'I need help communicating and understanding' page
    When I select all the options and click continue to next page
    Then I am navigated to 'Hearing Enhancement System (Hearing/Induction Loop, Infrared Receiver)' page
    When I select all four options and click continue
    Then I am navigated to 'Which Sign Language Interpreter do you need to request?' page
    When I type in the dynamic dropdown and select an option and click continue
    Then I am navigated to 'I need help with forms' page
    When I select all the three options and click continue
    Then I am navigated to 'I need something to feel comfortable during my hearing' page
    When I select all the five options and click continue
    Then I am navigated to 'I need to bring support with me to a hearing' page
    When I select all the given options and click continue
    Then I am navigated to 'I need to request a certain type of hearing' page
    When I select all the four options and click continue
    Then I am navigated to 'Review the support you've requested' page
    When I review and click Submit
    Then I must see a successful message

  Scenario: The home page loads and I click on Existing Journey
    Given I am on the Home page
    When I click on the button 'Enter Existing Journey'
    Then I am navigated to 'Support for' page
    When I click on 'Change my support options'
    Then I am navigated to 'I want to tell you that my support needs have changed' page
    When I click on 'Start now' button
    Then I am navigated to 'Review the support you've requested'
    When I click on 'Add a new support request' button
    Then I navigate to 'Do you have a physical, mental or learning disability or health condition that means you need support during your case?' page
    When I select all the checkboxes and click continue
    Then I am navigated to 'I need adjustments to get to, into and around our buildings'
    When I select all the options and click Continue
    Then I am navigated to 'I need documents in an alternative format' page
    When I select all the options and continue to next page
    Then I am navigated to 'I need help communicating and understanding' page
    When I select all the options and click continue to next page
    Then I am navigated to 'Hearing Enhancement System (Hearing/Induction Loop, Infrared Receiver)' page
    When I select all four options and click continue
    Then I am navigated to 'Which Sign Language Interpreter do you need to request?' page
    When I type in the dynamic dropdown and select an option and click continue
    Then I am navigated to 'I need help with forms' page
    When I select all the three options and click continue
    Then I am navigated to 'I need something to feel comfortable during my hearing' page
    When I select all the five options and click continue
    Then I am navigated to 'I need to bring support with me to a hearing' page
    When I select all the given options and click continue
    Then I am navigated to 'I need to request a certain type of hearing' page
    When I select all the four options and click continue
    Then I am navigated to 'Review the support you've requested' page
    When I review and click Submit
    Then I must see a successful message
