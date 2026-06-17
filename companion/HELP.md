# Tyvstart Kontrol - Bitfocus Companion Module

This module enables control and status feedback from a custom WPF application for false start control using the TCP protocol.

## Configuration

To configure the module, enter the following settings in Companion:

1. **WPF App IP:** Enter the IP address of the computer running the WPF application (typically `127.0.0.1` if running on the same machine).
2. **Port:** The default port is `9012` (must match the port configuration in your WPF app).
3. **Colors:** Customize the button colors for the states RED, GREEN, YELLOW, and BLINK.
4. **Blink Speed:** Adjust the button flashing frequency (in milliseconds).
5. **Connect Flash:** When enabled, all buttons will flash white for 2 seconds upon establishing a successful connection.

## TCP Protocol (For Developers)

The module communicates via raw TCP strings terminated by a newline character (`\n`).

### Outbound Commands (From Companion to App)
Pressing a button triggers the module to send the following strings:

* **Lanes 0-9:** Sends the digit directly (e.g., `1\n`)
* **Control:** `official\n`, `nst\n`, `s\n` (DNS), `D\n` (DSQ)
* **System:** `f5\n`, `backup\n`, `+\n`, `-\n`, `Y\n` (Yes), `N\n` (No)
* **Scoreboard:** `ctrl+insert\n` (ON), `ctrl+home\n` (OFF)
* **Other:** `U\n`, ` \n` (Space/End)

### Inbound Feedback (From App to Companion)
The application must send status updates using the following format to trigger button state changes:
`FB:[ID]:[STATUS]\n`

**Examples:**
* `FB:bane1:RED` (Changes Lane 1 button to red)
* `FB:nst:BLINK` (Causes the Next button to blink)
* `FB:officiel:GREEN` (Changes Official button to green)

**Supported States:** `RED`, `GREEN`, `YELLOW`, `BLINK`, `OFF`.

## Presets
The module includes ready-to-use **Presets** categorized into:
* **Lanes:** Buttons for lanes 0 through 9.
* **Control:** Judge and official functions.
* **System:** Navigation and confirmation keys.
* **Scoreboard:** Scoreboard power toggle.

Simply drag and drop a preset onto your Stream Deck. It comes pre-configured with the correct labels, actions, and color feedbacks.
