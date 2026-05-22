# Guide de Démarrage - Locataire2Confiance

## Prérequis
1.  **Node.js** (v18+) installé.
2.  **PostgreSQL** installé et un serveur local en cours d'exécution.
    *   Si vous avez Docker, lancez simplement : `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

## Étapes pour lancer le projet

### 1. Configuration de l'environnement
Copiez le fichier d'exemple et configurez vos variables.
```bash
cp .env.example .env
```
Assurez-vous que `DATABASE_URL` dans `.env` correspond bien à vos accès PostgreSQL locaux.

### 2. Synchroniser la Base de Données
Créez les tables dans votre base de données locale.
```bash
npx prisma db push
```
*Si cette commande échoue, vérifiez que votre serveur Postgres est bien lancé.*

### 3. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## Comptes de test (Une fois l'app lancée)
Vous pouvez vous inscrire via le formulaire `/register` pour créer un compte Locataire ou `/landlord/register` pour un Propriétaire.
