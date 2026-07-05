# LIVE_GATEWAY Result — CitePay Agent

Status: PASS

Environment: Google Cloud Shell
Network: Arc Testnet
Payment mode: LIVE_GATEWAY
Amount: 0.001 USDC
Settlement reference: 41ff2be2-66c4-4b55-acec-88069d1a1992

Verified loop:
- unauthenticated request returned 402 Payment Required
- buyer agent created payment signature
- seller received payment-signature
- BatchFacilitatorClient.verify() returned isValid: true
- BatchFacilitatorClient.settle() returned success: true
- paid request unlocked article content
- final agent output included citation + receipt reference

Important fix:
BatchFacilitatorClient must use the testnet Gateway API endpoint:
https://gateway-api-testnet.circle.com

Default client endpoint points to mainnet and caused:
unsupported_network for eip155:5042002
