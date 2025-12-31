Feature: | My Reservations page |

    Background:
        Given I authenticate to the system under role ROLE_USER

    Scenario: User add product to reservation
        Given I an on the Product Details page
        When I click on the 'Reserve' button
        Then The button changes to 'Reserved'

    Scenario: User remove product from reservation
        Given I an on the Product Details page
        When I click on the 'Reserved' button
        Then The button changes back to 'Reserve'

    Scenario: User see added product in My Reservations page
        Given I have added 1 product to reservation
        When I navigate to the My Reservations page
        Then I should see this reserved product

    Scenario: User see number of added products in My Reservations page
        Given I have added 3 products to reservation
        When I navigate to the My Reservations page
        Then I should see that 3 products are listed

    Scenario: User sees an error when adding a product exceeding reservation limit
        Given I have products in my reservation near the limit
        When I try to add a product that exceeds the allowed total
        Then I should see a snackbar with the message 'Your total reservation amount can not exceed $5,000.'

    Scenario: User sees an error when adding more than allowed quantity of a product
        Given I have reached the maximum quantity for a product
        When I try to add one more of the same product
        Then I should see a snackbar with the message 'You can reserve up to 5 items.'
