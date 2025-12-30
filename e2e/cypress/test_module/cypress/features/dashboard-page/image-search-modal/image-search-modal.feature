Feature: | Image search modal |

    Background: Before each
        Given I authenticate to the system under role ROLE_MANAGER
        When I click on the dashboard button
        And I click on the 'products' tab
        And I click on the 'first product update icon'
        And I have opened the Image Search modal

    Scenario: Manager can search images by typing a word
        When I search images with typing keyword 'Smartphone'
        Then I see search results

    Scenario: Manager can search images by selecting suggested keywords
        When I search images with suggested keyword 'Laptop'
        Then I see search results

     Scenario: Loader is displayed during image search
        When I search images with typing keyword 'Smartphone'
        Then the loader is visible

    Scenario: Manager selects an image from search results
        When I search images with typing keyword 'Smartphone'
        And I select an image from the search results
        Then the image is marked as selected
        And the Confirm button becomes enabled

    Scenario: Manager confirms selected image
        When I search images with typing keyword 'Smartphone'
        And I select an image from the search results
        And I confirm the image selection
        Then the selected image is shown in the Image preview section

    Scenario: Manager can unselect image
        When I search images with typing keyword 'Smartphone'
        And I select an image from the search results
        And I deselect the image
        Then no image is selected

    Scenario: Manager can close modal
        When I click on the Close icon
        Then the modal is closed

