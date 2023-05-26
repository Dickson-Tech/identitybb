@method=POST @endpoint=/wallet-binding
Feature: The endpoint to validate wallet create wallet user id

  @smoke @unit @positive
  Scenario: Successfully validates the wallet and generates the wallet user id smoke type test
    Given Wants to validate the wallet and generate wallet user id
    When Send POST /wallet-binding request with given "n3fy2qkg9r7h2" as individualId and "OTP" as authFactorType and "encoded-json" as format and "string" as challenge
    Then Receive a response from the /wallet-binding endpoint
    And The /wallet-binding response should be returned in a timely manner 15000ms
    And The /wallet-binding endpoint response should have status 200
    And The /wallet-binding endpoint response should match json schema with no errors

  @negative
  Scenario: Not able to generate the wallet binding because of unsupported challenge format
    Given Wants to validate the wallet and generate wallet user id
    When Send POST /wallet-binding request with given invalid format "n3fy2qkg9r7h2" as individualId and "OTP" as authFactorType and "invalid_format" as format and "string" as challenge
    Then Receive a response from the /wallet-binding endpoint
    And The /wallet-binding response should be returned in a timely manner 15000ms
    And The /wallet-binding endpoint response should have status 200
    And The /wallet-binding endpoint response should match json schema with errors
    And The /wallet-binding response should contain errorCode property equals to "unsupported_challenge_format"
