# Tyvstart Kontrol - Bitfocus Companion Modul

Dette modul muliggør styring og status-feedback fra en specialbygget WPF-applikation til tyvstartskontrol via TCP-protokollen.

## Konfiguration

For at få modulet til at virke, skal du indstille følgende i Companion:

1.  **WPF App IP:** Indtast IP-adressen på den computer, hvor WPF-appen kører (typisk `127.0.0.1` hvis det er på samme maskine).
2.  **Port:** Standardporten er `9012` (skal matche indstillingen i din WPF-app).
3.  **Farver:** Du kan frit vælge hvilke farver knapperne skal have ved status RØD, GRØN, GUL og BLINK.
4.  **Blink hastighed:** Juster hvor hurtigt knapperne skal blinke (i millisekunder).
5.  **Connect Flash:** Hvis aktiveret, vil alle knapper lyse hvidt i 2 sekunder, når forbindelsen til appen oprettes.

## TCP Protokol (For Udviklere)

Modulet kommunikerer via rå TCP-strenge afsluttet med en Newline (`\n`).

### Udgående kommandoer (Fra Companion til App)
Når du trykker på en knap, sender modulet følgende strenge:

*   **Baner 0-9:** Sender tallet direkte (f.eks. `1\n`)
*   **Kontrol:** `official\n`, `nst\n`, `s\n` (DNS), `D\n` (DSQ)
*   **System:** `f5\n`, `backup\n`, `+\n`, `-\n`, `Y\n` (Yes), `N\n` (No)
*   **Scoreboard:** `ctrl+insert\n` (ON), `ctrl+home\n` (OFF)
*   **Andet:** `U\n`, ` \n` (Space/Ende)

### Indgående feedback (Fra App til Companion)
Appen skal sende statusopdateringer i følgende format for at knapperne skifter farve:
`FB:[ID]:[STATUS]\n`

**Eksempler:**
*   `FB:bane1:RED` (Gør Bane 1 knappen rød)
*   `FB:nst:BLINK` (Får Næste-knappen til at blinke)
*   `FB:officiel:GREEN` (Gør Officiel-knappen grøn)

**Understøttede statusser:** `RED`, `GREEN`, `YELLOW`, `BLINK`, `OFF`.

## Presets
Modulet indeholder færdige **Presets** opdelt i kategorierne:
*   **Baner:** Knapper for bane 0 til 9.
*   **Kontrol:** Dommer- og official-funktioner.
*   **System:** Navigation og bekræftelse.
*   **Scoreboard:** Tænd/sluk for scoreboard.

Træk blot en preset over på dit Stream Deck, og den er automatisk sat op med den rigtige tekst, handling og farve-feedback.
