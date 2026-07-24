# NFC Push TX Instructions

NFC Push TX lets you broadcast a freshly signed Bitcoin transaction from a COLDCARD hardware wallet with a single NFC tap. After signing, the COLDCARD shows an NFC animation. When you tap your phone to the device, the phone reads an NFC tag containing a URL with the signed transaction. Opening that URL in your phone's browser connects to your Bitcoin node and broadcasts the transaction.

## First-time setup

1. Run **Settings** and select the Bitcoin node to use for broadcasting, such as your local Bitcoin Core or testnet4 node.
2. After saving, run **Show Push TX URLs** to retrieve the push URL.
3. Enter the returned URL into your COLDCARD's NFC Push TX setting.

If you choose a Bitcoin node on this StartOS server, Push TX keeps the connection up to date automatically.

## COLDCARD configuration

On the COLDCARD, navigate to Settings > NFC Push TX and enter the URL shown by the **Show Push TX URLs** action.

## Actions

- **Settings** - Select the Bitcoin node used for broadcasting.
- **Show Push TX URLs** - Display the URL to enter into your COLDCARD.

## Tor

If Tor is installed, Push TX also generates a `.onion` URL. **Show Push TX URLs** displays every available address, and the COLDCARD can use any of them.

## Upstream documentation

For details about NFC Push TX on COLDCARD, see [pushtx.org](https://pushtx.org).
