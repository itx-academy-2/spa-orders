Feature: | My Reservations page |

    Background:
        Given I authenticate to the system under role ROLE_USER

    Scenario: User add product to reservation
        Given I am on the Product Details page
        When I click on the 'Reserve' button
        Then The button changes to 'Reserved'

    Scenario: User remove product from reservation
        Given I am on the Product Details page
        When I click on the 'Reserved' button
        Then The button changes back to 'Reserve'

    Scenario: User see added product in My Reservations page
        Given My reservations contain 1 product
        When I navigated to the My Reservations page
        Then I should see this reserved product

    Scenario: User see number of added products in My Reservations page
        Given My reservations contain 1 product
        When I navigated to the My Reservations page
        Then I should see that 1 product is listed

    Scenario: User see an error when adding a product exceeding reservation limit
        Given I have products in my reservation near the limit
        When I am on the Product Details page
        And I click on the 'Reserve' button to add one more product
        Then I should see a snackbar with the message 'Your total reservation amount can not exceed $5,000.'

    Scenario: User see an error when adding more than allowed quantity of a product
        Given I have maximum quantity of products in my reservation
        When I am on the Product Details page
        And I try to add one more of the same product
        Then I should see a snackbar with the message 'You can reserve up to 5 items.'
