Feature: Initial Functional test

    Scenario: The home page loads
        When I go to '/'
        Then I find 'Default page template' text
