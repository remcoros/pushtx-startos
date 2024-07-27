# NFC Push TX

This feature allows single-tap broadcast of freshly-signed transactions from a COLDCARD and hopefully others soon(tm).

Once enabled with a URL, the COLDCARD will show the NFC animation after signing the transaction. When the user taps their phone, the phone will see an NFC tag with URL inside. That URL contains the signed transaction ready to go, and once opening in the mobile browser of the phone, that URL will load. The page will connect to your Bitcoin node and send the transaction on the public Bitcoin network.

## Setting up Coldcard

This feature is available on Q and Mk4 and requires NFC to be enabled. On your Coldcard, see Settings > NFC Push Tx to enable.

When enabling NFC Push TX in the Coldcard, you can use the QR scanner to scan the correct URL from the 'Properties' page in StartOS (click on the QR icon to show the QR code of the LAN or Tor url).

    Note: do not use the URL from the 'Interfaces' page! Use the Tor or LAN url from the 'Properties' page instead. The url must end with a hashtag (#).
