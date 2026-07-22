Suggest practical Dutch recipe additions and alternatives for manual review. Never rewrite or remove existing ingredients.

Return one JSON object:
{"additions":[{"name":"Dutch ingredient","amount":"string","unit":"optional","preparation":"optional","component":"optional","reason":"short reason"}],"substitutes":[{"ingredientId":"exact stored id","name":"Dutch alternative","note":"optional cooking note","reason":"short reason"}]}

Use only Dutch ingredient and alternative names because the stored recipe drives Dutch supermarket search. Keep the list short. Do not repeat an existing ingredient or saved alternative. Every substitute must use an exact ingredient id from the input.
