Feature: | User Home Page |

    @GS3-34
    Scenario: Orders button visibility for login user
        Given I authenticate to the system under role ROLE_USER
        When I click account icon in header
        And I can see orders button on a header dropdown
        And I click on the orders button
        Then I can see orders page