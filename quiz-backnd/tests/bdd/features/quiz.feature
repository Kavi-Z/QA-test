Feature: Quiz Management
  Scenario: Create a quiz
    Given I am an authenticated user
    When I create a quiz with title "Sample Quiz"
    Then I should receive a success response
