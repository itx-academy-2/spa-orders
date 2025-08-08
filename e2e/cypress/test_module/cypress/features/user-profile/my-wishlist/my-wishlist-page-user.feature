Feature: My Wishlist Page

    Background: 
        Given I authenticate to the system under role ROLE_USER

    Scenario: User can add a product to the wishlist on the All Products page
        Given I am on the All Products page
        When I click on the outlined heart icon on the first product to add to My Wishlist
        Then I should see a filled heart icon on the first product

    Scenario: User can delete a product from the wishlist on the All Products page
        Given I am on the All Products page
        And I ensure the first product is in My Wishlist
        When I click on the filled heart icon on the first product to remove from My Wishlist
        Then I should see an outlined heart icon on the first product

    Scenario: User can add a product to the wishlist on the sales page
        Given I am on the sales page
        When I click on the outlined heart icon on the first product to add to My Wishlist
        Then I should see a filled heart icon on the first product

    Scenario: User can delete a product from the wishlist on the sales page
        Given I am on the sales page
        And I ensure the first product is in My Wishlist
        When I click on the filled heart icon on the first product to remove from My Wishlist
        Then I should see an outlined heart icon on the first product

    Scenario: User can view the My Wishlist page
        When I click on the avatar icon in the header
        And I click on the My Profile dropdown icon
        And I click on the My Wishlist link on the left sidebar
        Then I should see the My Wishlist page

    Scenario: User can see wishlist page details
        Given I am on the My Wishlist page
        Then I should see the My Wishlist title displayed
        And I should see total amount of favorite products displayed
        And I should see sorting options

    Scenario: User can add several products to My Wishlist
        Given I am on the All Products page
        And I already have 7 products in My Wishlist
        When I go to the My Wishlist page
        Then I should see 7 products in My Wishlist 

    Scenario: User can use a pagination when products are more than six in My Wishlist
        Given I am on the All Products page
        And I already have 7 products in My Wishlist
        And I am on the My Wishlist page
        Then I should see a pagination component
        When I click on the next page button
        Then I should see one product on the second page
