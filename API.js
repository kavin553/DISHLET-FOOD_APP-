// JavaScript Example: Reading Entities
// Filterable fields: name, ingredients, instructions, cooking_time, difficulty, cuisine, servings, preference, image_url, rating, instructions_language
async function fetchRecipeEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/68b28da696f95bb9c917d1b9/entities/Recipe`, {
        headers: {
            'api_key': '68d1d26da3c546a18c946c79bc1c0df4', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: name, ingredients, instructions, cooking_time, difficulty, cuisine, servings, preference, image_url, rating, instructions_language
async function updateRecipeEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/68b28da696f95bb9c917d1b9/entities/Recipe/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '68d1d26da3c546a18c946c79bc1c0df4', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}