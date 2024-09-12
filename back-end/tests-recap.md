# Tests pour le smart contract FruitFableNFT

## 1. Test du constructeur
- Vérifier que le propriétaire initial est correctement défini
- Vérifier que les `ultimateTokenIds` sont correctement initialisés pour chaque fruit

## 2. Test de setURI
- Vérifier que seul le propriétaire peut modifier l'URI
- Vérifier que l'URI est correctement mise à jour

## 3. Test de getTokenId
- Vérifier que la fonction retourne l'ID correct pour chaque combinaison de fruit et d'émotion

## 4. Test de mint
- Vérifier que le mint fonctionne correctement pour différentes combinaisons de fruits et d'émotions
- Vérifier que le `totalMinted` est correctement mis à jour après chaque mint
- Vérifier que les tokens sont correctement attribués à l'appelant

## 5. Test de mergeFruits
- Vérifier que la fonction échoue si moins de 5 émotions sont fournies
- Vérifier que la fonction échoue si l'utilisateur ne possède pas tous les tokens requis
- Vérifier que les tokens sont correctement brûlés lors de la fusion
- Vérifier que le token ultime est correctement minté après une fusion réussie
- Tester la fusion pour chaque type de fruit

## 6. Test des limites et des cas d'erreur
- Tester le mint avec une quantité de 0
- Tester le mint avec une très grande quantité pour vérifier les limites
- Tester `mergeFruits` avec des émotions en double

## 7. Test des fonctions héritées d'ERC1155
- Tester `balanceOf` pour vérifier les soldes après mint et merge
- Tester `balanceOfBatch` pour vérifier plusieurs soldes en une seule fois

## 8. Test des fonctions héritées d'Ownable
- Vérifier que seul le propriétaire peut appeler `setURI`
- Tester le transfert de propriété

## 9. Test de la gestion des événements
- Vérifier que les événements appropriés sont émis lors du mint et du merge (`TransferSingle`, `TransferBatch`)

## 10. Test de l'intégrité des données
- Vérifier que `totalMinted` reste cohérent après plusieurs opérations de mint et de merge

## 11. Test de gas
- Mesurer la consommation de gas pour les opérations de mint et de merge

## 12. Test de la logique métier
- Vérifier que les ID des tokens ultimes sont uniques et correspondent bien à chaque fruit

## 13. Test de compatibilité avec les standards
- Vérifier que le contrat est compatible avec les fonctions standard ERC1155