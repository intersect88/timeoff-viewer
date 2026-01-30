# TimeOff Viewer

Applicazione web per la gestione di ferie, ROL ed ex-festività con autenticazione Google e salvataggio cloud.

## Funzionalità

- **Autenticazione Google**: Accedi con il tuo account Google
- **Saldi**: Gestione dei saldi di Ferie, ROL ed Ex-Festività (espressi in ore)
- **Totali**: Visualizzazione del totale in ore e giorni (1 giorno = 8 ore)
- **Registrazione**: Aggiungi permessi e ferie tramite modale
- **Report**: Visualizza lo storico dei permessi con ordinamento per data
- **Persistenza Cloud**: I dati vengono salvati automaticamente su Firebase Firestore
- **Multi-dispositivo**: Accedi ai tuoi dati da qualsiasi dispositivo

## Tecnologie

- React
- TypeScript
- Firebase (Authentication + Firestore)
- CSS3

## Configurazione Firebase

Prima di avviare l'applicazione, configura Firebase:

1. Crea un progetto su https://console.firebase.google.com/
2. Abilita l'autenticazione Google
3. Crea un database Firestore
4. Copia la configurazione nel file `src/firebase.ts`

Consulta la documentazione Firebase per i dettagli.

## Installazione

```bash
npm install
```

## Avvio

```bash
npm start
```

L'applicazione sarà disponibile su [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
```

## Repository

https://github.com/intersect88/timeoff-viewer
