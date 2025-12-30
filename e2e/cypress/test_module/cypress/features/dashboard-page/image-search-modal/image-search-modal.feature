Feature: | Image search modal |

    Background: Before each
        Given I authenticate to the system under role ROLE_MANAGER
        And I am on the Products page

    Scenario: Manager can see 'Search on Pexels' button on 'Update product' page
        Given I am on the Update Product page
        Then I see the Search on Pexels button

    Scenario: Manager can see 'Search on Pexels' button on 'Create a product' page
        Given I am on the Create a Product page
        Then I see the Search on Pexels button

    Scenario: Manager can search images by typing a word
        Given I have opened the Image Search modal
        When I type a word 'Phone'
        Then I see eight images
    
    Scenario: Manager can search images by selecting suggested keywords
        Given I have opened the Image Search modal
        When I search images with keyword 'Laptop'
        Then I see search results

    Scenario: Loader is displayed during image search
        Given I have opened the Image Search modal
        When I search images by typing keyword 'Smartphone'
        Then a loader is displayed

    Scenario: Manager selects an image from search results
        Given I have opened the Image Search modal
        When I search images by typing keyword 'Smartphone'
        And I select an image from the search results
        Then the image is marked as selected
        And the Confirm button becomes enabled

    Scenario: Manager confirms selected image
        Given an image is selected in the Image Search modal
        When I confirm the image selection
        Then the selected image is shown in the Image preview section

    Scenario: Manager can unselect image
        Given I have opened the Image Search modal
        When I search images with typing keyword 'Smartphone'
        And I select an image from the search results
        And I deselect the image
        Then no image is selected

    Scenario: Manager can close modal
        Given I have opened the Image Search modal
        When I click on the Close icon
        Then the modal is closed
